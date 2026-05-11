"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export type ChangeState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export async function changePassword(
  _prev: ChangeState,
  formData: FormData
): Promise<ChangeState> {
  const session = await getSession();
  if (!session) redirect("/logga-in");

  const current = String(formData.get("current") ?? "");
  const next    = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next) {
    return { status: "error", message: "Fyll i nuvarande och nytt lösenord." };
  }
  if (next.length < 8) {
    return { status: "error", message: "Nytt lösenord måste vara minst 8 tecken." };
  }
  if (next !== confirm) {
    return { status: "error", message: "De nya lösenorden matchar inte." };
  }
  if (next === current) {
    return { status: "error", message: "Nytt lösenord får inte vara samma som det gamla." };
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, passwordHash: true, active: true },
  });
  if (!user || !user.active) {
    return { status: "error", message: "Konto inte längre giltigt — logga in på nytt." };
  }

  const ok = await verifyPassword(current, user.passwordHash);
  if (!ok) {
    return { status: "error", message: "Fel nuvarande lösenord." };
  }

  const newHash = await hashPassword(next);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { status: "ok", message: "Lösenordet är ändrat." };
}
