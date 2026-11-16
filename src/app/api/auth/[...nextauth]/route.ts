import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// The settings (providers, callbacks, secret) are in src/lib/auth.ts
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
