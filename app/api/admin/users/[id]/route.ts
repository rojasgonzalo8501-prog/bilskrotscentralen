import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (typeof body.active === "boolean") data.active = body.active;
  if (body.role) data.role = body.role;
  if (body.password) data.passwordHash = await hashPassword(body.password);
  if (body.name) data.name = body.name;

  const user = await db.user.update({
    where: { id },
    data,
    select: { id: true, username: true, name: true, email: true, role: true, active: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if (id === session.userId) {
    return NextResponse.json(
      { error: "Du kan inte ta bort ditt eget konto" },
      { status: 400 }
    );
  }

  // Look up the target so we can refuse to delete the last superadmin.
  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true, username: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Användaren finns inte" }, { status: 404 });
  }
  if (target.role === "SUPERADMIN") {
    const superCount = await db.user.count({ where: { role: "SUPERADMIN" } });
    if (superCount <= 1) {
      return NextResponse.json(
        { error: "Kan inte ta bort sista superadmin — skapa en till först." },
        { status: 400 }
      );
    }
  }

  // Manually release Lead.assignedToId FKs first. Prisma's onDelete:
  // SetNull does this automatically when the Lead table is healthy in
  // the DB; running it explicitly is harmless and survives the case
  // where the Lead table hasn't been migrated to prod yet (the catch
  // below swallows that — there's nothing to release if the table
  // doesn't exist).
  try {
    await db.lead.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    });
  } catch (err) {
    console.warn("[users DELETE] Could not release Lead assignments:", err);
    // Continue anyway — if the table genuinely is missing, the user
    // delete below should succeed.
  }

  try {
    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted: target.username });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[users DELETE] failed:", err);
    return NextResponse.json(
      {
        error:
          "Kunde inte ta bort användaren — det finns kopplade rader (ordrar, fakturor, leads) som hindrar. " +
          "Pausa kontot istället (PauseCircle-ikonen) eller ta bort de kopplade raderna först.",
        detail: message,
      },
      { status: 409 }
    );
  }
}
