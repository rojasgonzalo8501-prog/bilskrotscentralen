import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import UsersClient from "./UsersClient";

export const metadata = { title: "Användare" };
export const dynamic = "force-dynamic";

export default async function AnvandareePage() {
  const session = await getSession();
  if (session?.role !== "superadmin") redirect("/admin");

  const users = await db.user.findMany({
    select: { id: true, username: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Användare</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Hantera admins och kundkonton. Endast synligt för superadmin.
        </p>
      </div>
      <UsersClient users={users} currentUserId={session.userId} />
    </div>
  );
}
