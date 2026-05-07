"use server";

import { redirect } from "next/navigation";
import {
  verifyCredentials,
  setSession,
  clearSession,
  setPending2FA,
} from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await verifyCredentials(username, password);

  if (result.kind === "fail") {
    redirect("/logga-in?fel=1");
  }

  if (result.kind === "needs-2fa") {
    // Password OK; ask for the 6-digit code on the next page.
    await setPending2FA(result.userId);
    redirect("/logga-in/2fa");
  }

  await setSession(result.session);
  redirect(
    ["admin", "superadmin"].includes(result.session.role) ? "/admin" : "/konto"
  );
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
