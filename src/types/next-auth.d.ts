import { User } from "./../../node_modules/next-auth/core/types.d";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
    role: string;
  }
  interface Session {
    user:{
    token: string;
    role: string;
    id: string;
  }
}
}
declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    role: string;
    id: string;
  }
}
