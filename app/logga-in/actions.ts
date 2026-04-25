"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, setSession, clearSession } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const session = await verifyCredentials(username, password);
  if (!session) {
    redirect("/logga-in?fel=1");
  }

  await setSession(session);

  redirect(
    ["admin", "superadmin"].includes(session.role) ? "/admin" : "/konto"
  );
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
