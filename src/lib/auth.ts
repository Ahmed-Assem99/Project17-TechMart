import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import apiServices from "@/services/apiServices";

// The NextAuth settings live here (not in route.ts) so other server code can use them.
// getServerSession(authOptions) needs this object to read the logged-in user's session.
// (A route.ts file may only export GET/POST/..., so it can't export authOptions itself.)
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        const response = await apiServices.Signin(
          credentials?.email ?? "",
          credentials?.password ?? "",
        );
        if (response.message == "success") {
          return {
            ...response.user,
            token: response.token,
            id: response.user.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // Runs on sign in (user is filled) and on every session check (user is undefined).
    // On sign in we copy the API token into NextAuth's encrypted cookie
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    // Decides what getSession() / getServerSession() / useSession() give back
    async session({ session, token }) {
      session.user.token = token.token;
      session.user.role = token.role;
      session.user.id = token.id;

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
