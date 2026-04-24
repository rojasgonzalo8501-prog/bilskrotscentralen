import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/**
 * Customer portal gate. Any unauthenticated visitor is bounced to the
 * login page with ?portal=customer so the right tab is preselected.
 * Admins are also allowed in — they can act on behalf of a customer.
 */
export default async function KontoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");
  return <>{children}</>;
}
