import { getSession, type Session } from "@/lib/auth";
import { KassaClient } from "./KassaClient";

export const dynamic = "force-dynamic";

export default async function KassaPage() {
  const session = await getSession();
  return <KassaClient session={session} />;
}
