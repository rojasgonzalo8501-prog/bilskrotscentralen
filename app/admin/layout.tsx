import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "../logga-in/actions";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=admin");
  if (!["admin", "superadmin"].includes(session.role)) redirect("/konto");

  return (
    <div className="fixed inset-0 z-[60] flex bg-[var(--color-dark-900)] text-[var(--color-text-primary)]">
      <AdminSidebar
        userName={session.name}
        role={session.role}
        logoutAction={logoutAction}
      />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
