/**
 * Nets Easy (Nexi Easy) payment integration.
 *
 * Two products run on the same JSON API:
 *  - Embedded checkout — iframe rendered on bilskrotscentralen.com via
 *    https://test.checkout.dibspayment.eu/checkout.js (or live equivalent).
 *  - Hosted payment page — Nets-hosted URL we redirect the customer to.
 *
 * We use embedded for the standard Swedish webshop UX so the customer
 * never leaves the site. The same `paymentId` flows through both modes,
 * so switching is just a config flag if Adam ever wants the hosted page.
 *
 * Docs: https://developer.nexigroup.com/nexi-checkout/en-EU/api/payment/
 */

const TEST_API = "https://test.api.dibspayment.eu";
const LIVE_API = "https://api.dibspayment.eu";

export const TEST_CHECKOUT_JS = "https://test.checkout.dibspayment.eu/checkout.js";
export const LIVE_CHECKOUT_JS = "https://checkout.dibspayment.eu/checkout.js";

function env() {
  return (process.env.NETS_EASY_ENV ?? "test").toLowerCase() === "live"
    ? "live"
    : "test";
}

export function netsApiBase() {
  return env() === "live" ? LIVE_API : TEST_API;
}

export function netsCheckoutJs() {
  return env() === "live" ? LIVE_CHECKOUT_JS : TEST_CHECKOUT_JS;
}

export function netsCheckoutKey() {
  return process.env.NEXT_PUBLIC_NETS_EASY_CHECKOUT_KEY ?? "";
}

function secret() {
  const k = process.env.NETS_EASY_SECRET_KEY;
  if (!k) throw new Error("NETS_EASY_SECRET_KEY is not set");
  return k;
}

export type NetsCustomer = {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  country?: string; // ISO-3, default "SWE"
};

export type NetsCartLine = {
  reference: string; // SKU
  name: string;
  quantity: number;
  unitPriceSek: number; // whole SEK
  vatPercent?: number; // default 25
};

export type CreatePaymentInput = {
  orderNumber: string;
  items: NetsCartLine[];
  shippingSek: number;
  customer: NetsCustomer;
  baseUrl: string;
};

export type CreatePaymentResult = {
  paymentId: string;
  checkoutKey: string;
  checkoutJs: string;
  hostedPaymentPageUrl?: string;
};

/**
 * All amounts are sent to Nets in MINOR units (öre). 100 öre = 1 SEK.
 * VAT is already INCLUDED in unitPrice — Nets treats `taxRate` informationally.
 */
function toMinor(sek: number) {
  return Math.round(sek * 100);
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  const { orderNumber, items, shippingSek, customer, baseUrl } = input;

  const itemsPayload = items.map((it) => {
    const vat = it.vatPercent ?? 25;
    const grossUnitMinor = toMinor(it.unitPriceSek);
    const grossTotalMinor = grossUnitMinor * it.quantity;
    // Nets wants net unit price + tax separately
    const netUnitMinor = Math.round(grossUnitMinor / (1 + vat / 100));
    const netTotalMinor = netUnitMinor * it.quantity;
    const taxTotalMinor = grossTotalMinor - netTotalMinor;
    return {
      reference: it.reference,
      name: it.name,
      quantity: it.quantity,
      unit: "st",
      unitPrice: netUnitMinor,
      taxRate: vat * 100, // basis points
      taxAmount: taxTotalMinor,
      grossTotalAmount: grossTotalMinor,
      netTotalAmount: netTotalMinor,
    };
  });

  if (shippingSek > 0) {
    const grossMinor = toMinor(shippingSek);
    const netMinor = Math.round(grossMinor / 1.25);
    itemsPayload.push({
      reference: "FRAKT",
      name: "Frakt",
      quantity: 1,
      unit: "st",
      unitPrice: netMinor,
      taxRate: 2500,
      taxAmount: grossMinor - netMinor,
      grossTotalAmount: grossMinor,
      netTotalAmount: netMinor,
    });
  }

  const totalGross = itemsPayload.reduce((s, i) => s + i.grossTotalAmount, 0);

  const webhookAuth = process.env.NETS_EASY_WEBHOOK_AUTH ?? "";
  const webhooks = webhookAuth
    ? [
        {
          eventName: "payment.checkout.completed",
          url: `${baseUrl}/api/webhooks/nets`,
          authorization: webhookAuth,
        },
        {
          eventName: "payment.charge.created",
          url: `${baseUrl}/api/webhooks/nets`,
          authorization: webhookAuth,
        },
        {
          eventName: "payment.cancel.created",
          url: `${baseUrl}/api/webhooks/nets`,
          authorization: webhookAuth,
        },
      ]
    : [];

  const body = {
    order: {
      currency: "SEK",
      reference: orderNumber,
      items: itemsPayload,
      amount: totalGross,
    },
    checkout: {
      // Embedded; if Adam wants hosted, set integrationType to "HostedPaymentPage".
      integrationType: "EmbeddedCheckout",
      url: `${baseUrl}/kassa`,
      termsUrl: `${baseUrl}/kopvillkor`,
      merchantHandlesConsumerData: true,
      consumer: {
        email: customer.email,
        phoneNumber: customer.phone
          ? { prefix: "+46", number: customer.phone.replace(/^(\+?46|0)/, "") }
          : undefined,
        privatePerson: {
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
        shippingAddress: {
          addressLine1: customer.address,
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country ?? "SWE",
        },
      },
      consumerType: { default: "B2C", supportedTypes: ["B2C"] },
      returnUrl: `${baseUrl}/kassa/bekraftelse?nets_payment_id={paymentId}`,
    },
    notifications: webhooks.length ? { webhooks } : undefined,
    merchantNumber: undefined,
  };

  const res = await fetch(`${netsApiBase()}/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: secret(),
      "Content-Type": "application/json",
      "commercePlatformTag": "bilskrotscentralen-nextjs",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Nets createPayment error", res.status, text);
    throw new Error(`Nets ${res.status}: ${text.slice(0, 300)}`);
  }
  const data: { paymentId: string; hostedPaymentPageUrl?: string } = JSON.parse(text);
  return {
    paymentId: data.paymentId,
    hostedPaymentPageUrl: data.hostedPaymentPageUrl,
    checkoutKey: netsCheckoutKey(),
    checkoutJs: netsCheckoutJs(),
  };
}

export type NetsPaymentDetails = {
  paymentId: string;
  state: string;
  reference: string;
  reservedAmount?: number;
  chargedAmount?: number;
  consumer?: { email?: string };
  summary?: { reservedAmount?: number; chargedAmount?: number; cancelledAmount?: number; refundedAmount?: number };
};

export async function getPayment(paymentId: string): Promise<NetsPaymentDetails> {
  const res = await fetch(`${netsApiBase()}/v1/payments/${paymentId}`, {
    headers: { Authorization: secret() },
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Nets getPayment ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.payment ?? data;
}

/** True when payment has been authorized (reservation) or charged. */
export function isPaymentSuccessful(p: NetsPaymentDetails): boolean {
  const reserved = p.summary?.reservedAmount ?? p.reservedAmount ?? 0;
  const charged = p.summary?.chargedAmount ?? p.chargedAmount ?? 0;
  return reserved > 0 || charged > 0;
}
