"use server";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";

export type ForgotState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

/**
 * Always responds "if the email exists you'll get a link" — never
 * reveals which addresses are registered. The actual send is async
 * with errors logged on the server side.
 */
export async function requestPasswordReset(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { status: "error", message: "Skriv en giltig e-postadress." };
  }

  // Honeypot — same trick as on /eftersok
  const honeypot = String(formData.get("company_url") ?? "").trim();
  if (honeypot) {
    return { status: "sent" }; // pretend success
  }

  try {
    const user = await db.user.findFirst({
      where: { email, active: true },
      select: { id: true, email: true, name: true, passwordHash: true },
    });

    if (user && user.email) {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        userId: user.id,
        passwordHash: user.passwordHash,
      });
    } else {
      // No matching user — log it but still respond as if success.
      console.log("[forgot-password] no user for email", email);
    }
  } catch (err) {
    console.error("[forgot-password]", err);
    // Same neutral response — don't help attackers map the user table.
  }

  return { status: "sent" };
}
