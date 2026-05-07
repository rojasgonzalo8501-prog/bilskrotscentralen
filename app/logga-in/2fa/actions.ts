"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  getPending2FA,
  clearPending2FA,
  setSession,
  sessionForUser,
} from "@/lib/auth";
import { verifyTotp } from "@/lib/totp";

export async function verify2faAction(formData: FormData): Promise<void> {
  const userId = await getPending2FA();
  if (!userId) {
    // Pending cookie expired or never set — kick back to login.
    redirect("/logga-in?fel=1");
  }

  const token = String(formData.get("code") ?? "").trim();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || !user.active || !user.totpEnabled || !user.totpSecret) {
    await clearPending2FA();
    redirect("/logga-in?fel=1");
  }

  if (!verifyTotp(token, user.totpSecret)) {
    redirect("/logga-in/2fa?fel=1");
  }

  const session = await sessionForUser(userId);
  if (!session) {
    await clearPending2FA();
    redirect("/logga-in?fel=1");
  }

  await clearPending2FA();
  await setSession(session);
  redirect(
    ["admin", "superadmin"].includes(session.role) ? "/admin" : "/konto"
  );
}

export async function cancel2faAction(): Promise<void> {
  await clearPending2FA();
  redirect("/logga-in");
}
