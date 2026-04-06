import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session || !session.user) {
    return { error: true, session: null };
  }

  return { error: false, session };
}
