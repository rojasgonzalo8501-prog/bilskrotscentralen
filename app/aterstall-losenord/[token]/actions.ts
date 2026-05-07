"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { verifyResetToken } from "@/lib/password-reset-token";
import { setSession, clearPending2FA } from "@/lib/auth";

export type ResetState = {
  status: "idle" | "error";
  message?: string;
};

export async function resetPassword(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { status: "error", message: "Länken saknar token. Begär en ny återställnings-länk." };
  if (password.length < 8) {
    return { status: "error", message: "Lösenordet måste vara minst 8 tecken." };
  }
  if (password !== confirm) {
    return { status: "error", message: "Lösenorden matchar inte." };
  }

  // Decode userId from token (without verifying yet) so we can fetch
  // the current passwordHash, which is part of the HMAC payload.
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { status: "error", message: "Ogiltig länk." };
  }
  let userId: string;
  try {
    userId = Buffer.from(parts[0].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return { status: "error", message: "Ogiltig länk." };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.active) {
    return { status: "error", message: "Länken är inte längre giltig." };
  }

  const verified = verifyResetToken(token, user.passwordHash);
  if (!verified.ok) {
    if (verified.reason === "expired") {
      return {
        status: "error",
        message: "Länken har gått ut (gäller i 60 minuter). Begär en ny.",
      };
    }
    return { status: "error", message: "Länken är inte giltig. Begär en ny." };
  }

  const newHash = await hashPassword(password);
  await db.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Auto-login + clear any leftover pending-2FA cookie. If 2FA is
  // enabled the user can re-authenticate next time; we don't bypass
  // the second factor here because they only proved control of email.
  if (!user.totpEnabled) {
    await setSession({
      userId: user.id,
      username: user.username,
      role: user.role === "SUPERADMIN" ? "superadmin" : user.role === "ADMIN" ? "admin" : "customer",
      name: user.name,
    });
  }
  await clearPending2FA();

  redirect(
    user.totpEnabled
      ? "/logga-in?reset=1"
      : ["ADMIN", "SUPERADMIN"].includes(user.role)
      ? "/admin"
      : "/konto"
  );
}
