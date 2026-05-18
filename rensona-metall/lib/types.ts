export type MaterialCategory =
  | "Koppar"
  | "Mässing"
  | "Aluminium"
  | "Rostfritt"
  | "Järn & Stål"
  | "Bly"
  | "Special"
  | "Bil";

export type Material = {
  id: string;
  slug: string;
  name: string;
  category: MaterialCategory;
  description: string | null;
  price_per_kg: number;
  co2_savings_per_kg: number;
  unit: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  type: "private" | "business";
  name: string;
  personal_id: string | null;
  org_number: string | null;
  vat_number: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  kyc_verified: boolean;
  kyc_verified_at: string | null;
  total_transactions: number;
  total_value: number;
  total_weight_kg: number;
  total_co2_saved_kg: number;
  created_at: string;
};

export type PaymentMethod = "swish" | "bankgiro" | "cash" | "invoice";

export type Transaction = {
  id: string;
  receipt_number: string;
  customer_id: string | null;
  staff_id: string | null;
  transaction_type: "drop_in" | "pickup" | "container" | "car_scrap";
  total_amount: number;
  total_weight_kg: number;
  total_co2_saved_kg: number;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  kyc_flagged: boolean;
  status: "pending" | "completed" | "cancelled" | "refunded";
  receipt_pdf_url: string | null;
  notes: string | null;
  created_at: string;
};

export type TransactionItem = {
  id: string;
  transaction_id: string;
  material_id: string;
  material_name: string;
  weight_kg: number;
  price_per_kg: number;
  subtotal: number;
  co2_saved_kg: number;
};

export type CartItem = {
  material: Material;
  weight_kg: number;
  price_per_kg: number;
};

export const KYC_THRESHOLD_SEK = 58000;

export const formatSEK = (amount: number): string =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatKg = (kg: number): string =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(kg) + " kg";

export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
