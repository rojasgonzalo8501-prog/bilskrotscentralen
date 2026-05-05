"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

type ActionResult = { ok: true } | { ok: false; error: string };

const ALLOWED_STATUSES = ["NEW", "IN_PROGRESS", "ANSWERED", "WON", "LOST"] as const;
type LeadStatus = typeof ALLOWED_STATUSES[number];

export async function updateLeadStatus(
  leadId: string,
  newStatus: string
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return { ok: false, error: "Behörighet saknas." };
  }
  if (!ALLOWED_STATUSES.includes(newStatus as LeadStatus)) {
    return { ok: false, error: "Okänd status." };
  }
  try {
    await db.lead.update({
      where: { id: leadId },
      data: {
        status: newStatus as LeadStatus,
        answeredAt:
          newStatus === "ANSWERED" || newStatus === "WON"
            ? new Date()
            : undefined,
      },
    });
    revalidatePath(`/admin/eftersok/${leadId}`);
    revalidatePath("/admin/eftersok");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("[updateLeadStatus]", err);
    return { ok: false, error: "Kunde inte spara status." };
  }
}

export async function appendLeadNote(
  leadId: string,
  noteText: string
): Promise<ActionResult> {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return { ok: false, error: "Behörighet saknas." };
  }
  const trimmed = noteText.trim();
  if (!trimmed) return { ok: false, error: "Tomma anteckningar sparas inte." };

  try {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      select: { notes: true },
    });
    if (!lead) return { ok: false, error: "Hittar inte förfrågan." };

    const stamp = new Date().toLocaleString("sv-SE", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
    const author = session.name || session.username || "Admin";
    const newEntry = `[${stamp} · ${author}]\n${trimmed}`;
    const merged = lead.notes ? `${lead.notes}\n\n${newEntry}` : newEntry;

    await db.lead.update({
      where: { id: leadId },
      data: { notes: merged },
    });
    revalidatePath(`/admin/eftersok/${leadId}`);
    return { ok: true };
  } catch (err) {
    console.error("[appendLeadNote]", err);
    return { ok: false, error: "Kunde inte spara anteckning." };
  }
}

export async function assignLeadToMe(leadId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return { ok: false, error: "Behörighet saknas." };
  }
  try {
    await db.lead.update({
      where: { id: leadId },
      data: {
        assignedToId: session.userId,
        status: "IN_PROGRESS",
      },
    });
    revalidatePath(`/admin/eftersok/${leadId}`);
    revalidatePath("/admin/eftersok");
    return { ok: true };
  } catch (err) {
    console.error("[assignLeadToMe]", err);
    return { ok: false, error: "Kunde inte tilldela." };
  }
}
