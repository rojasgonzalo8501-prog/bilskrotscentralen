"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateSecret, verifyTotp } from "@/lib/totp";

type Result = { ok: true } | { ok: false; error: string };

async function requireAuthed() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

/**
 * Step 1 of enrollment: generate a fresh secret and stash it on the User
 * row WITHOUT enabling 2FA yet. The user scans the QR (rendered from
 * this secret), then runs verifyEnrollment with a code from the app.
 */
export async function startEnrollment(): Promise<Result & { secret?: string }> {
  const session = await requireAuthed();
  if (!session) return { ok: false, error: "Inte inloggad." };

  const secret = generateSecret();
  try {
    await db.user.update({
      where: { id: session.userId },
      data: {
        totpSecret: secret,
        totpEnabled: false,
        totpVerifiedAt: null,
      },
    });
    revalidatePath("/admin/sakerhet");
    return { ok: true, secret };
  } catch (err) {
    console.error("[startEnrollment]", err);
    return { ok: false, error: "Kunde inte starta inställning." };
  }
}

/**
 * Step 2: user types in a 6-digit code from the authenticator app.
 * If it verifies against the stored secret, flip totpEnabled = true.
 */
export async function verifyEnrollment(code: string): Promise<Result> {
  const session = await requireAuthed();
  if (!session) return { ok: false, error: "Inte inloggad." };

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.totpSecret) {
    return { ok: false, error: "Ingen pågående inställning. Börja om." };
  }
  if (!verifyTotp(code, user.totpSecret)) {
    return { ok: false, error: "Felaktig kod — kontrollera klockan på telefonen och försök igen." };
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: {
        totpEnabled: true,
        totpVerifiedAt: new Date(),
      },
    });
    revalidatePath("/admin/sakerhet");
    return { ok: true };
  } catch (err) {
    console.error("[verifyEnrollment]", err);
    return { ok: false, error: "Kunde inte spara." };
  }
}

/** Disable 2FA for the current user. Requires a valid current code. */
export async function disable2fa(code: string): Promise<Result> {
  const session = await requireAuthed();
  if (!session) return { ok: false, error: "Inte inloggad." };

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.totpSecret || !user.totpEnabled) {
    return { ok: false, error: "2FA är inte aktivt på det här kontot." };
  }
  if (!verifyTotp(code, user.totpSecret)) {
    return { ok: false, error: "Felaktig kod." };
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: {
        totpSecret: null,
        totpEnabled: false,
        totpVerifiedAt: null,
      },
    });
    revalidatePath("/admin/sakerhet");
    return { ok: true };
  } catch (err) {
    console.error("[disable2fa]", err);
    return { ok: false, error: "Kunde inte avaktivera." };
  }
}
