"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { setSession } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/welcome-email";

export type SignupResult = {
  ok: boolean;
  error?: string;
  fields?: { name?: string; email?: string; username?: string };
};

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function signupAction(formData: FormData): Promise<SignupResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  // Basic validation — same defensive shape as login.
  if (!name || name.length < 2) {
    return { ok: false, error: "Ange ditt fullständiga namn." };
  }
  if (!email || !isEmail(email)) {
    return { ok: false, error: "Ange en giltig e-postadress." };
  }
  if (!username || username.length < 3 || !/^[a-z0-9._-]+$/.test(username)) {
    return {
      ok: false,
      error:
        "Användarnamn måste vara minst 3 tecken och får bara innehålla a–z, 0–9, ._-",
    };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: "Lösenordet måste vara minst 8 tecken." };
  }
  if (password !== confirm) {
    return { ok: false, error: "Lösenorden matchar inte." };
  }

  // Uniqueness checks.
  const existingByUsername = await db.user.findUnique({ where: { username } });
  if (existingByUsername) {
    return {
      ok: false,
      error: "Det användarnamnet är upptaget. Välj ett annat.",
    };
  }
  const existingByEmail = await db.user.findFirst({ where: { email } });
  if (existingByEmail) {
    return {
      ok: false,
      error: "Det finns redan ett konto med den e-postadressen.",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      username,
      passwordHash,
      name,
      email,
      role: "CUSTOMER",
      active: true,
    },
  });

  await setSession({
    userId: user.id,
    username: user.username,
    role: "customer",
    name: user.name,
  });

  // Best-effort welcome mail — don't block the signup flow if Resend
  // is unavailable or the domain isn't verified yet.
  void sendWelcomeEmail({
    email: user.email!,
    name: user.name,
    username: user.username,
  });

  redirect("/konto");
}
