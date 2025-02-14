import NextAuth, { Session, User, DefaultSession } from "next-auth";
import { UserType } from "./user";
import {JWT} from "next-auth/jwt"
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User extends UserType{
  }
  interface Session{
    user: UserType & DefaultSession['user']
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {
    expires: number
  }
}
