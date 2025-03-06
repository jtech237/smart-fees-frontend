import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { z } from "zod";

import type { NextAuthConfig, User } from "next-auth";
import type { UserType, UserResponse } from "@/types/user";
import { Credentials, credentialsSchema } from "@/types/login";

const AUTH_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
}/auth/token`;

class UnauthorizedError extends CredentialsSignin {
  code = "unauthorized";
  message =
    "Authentication failed! Incorrect Username or Password. Check your credentials";
  status = 401;
}

class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
  status = 400;
}

class UnexpectedError extends CredentialsSignin {
  code: string = "unexpected";
  message: string = "Internal server error. Contact administrator";
}

class RefreshTokenError extends CredentialsSignin {
  code = "refresh_failed";
  message = "Session expired. Please log in again.";
  status = 401;
}

async function fetchUser(from: string | URL, body: Credentials) {
  try {
    const url = typeof from === "string" ? from : from.toString();
    const res = await axios.post<UserResponse>(url, body);

    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new UnauthorizedError();
      }
      if (status === 404) {
        throw new UnexpectedError("Auth URL unavailable", { cause: error });
      }
      console.log("New ===> ", error);
    }
    throw new UnexpectedError({ cause: error });
  }
}

function createUser(user: UserResponse) {
  const objectUser: UserType = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    accessToken: user.access,
    refreshToken: user.refresh,
    expire_in: user.expires
  };

  return objectUser;
}

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          type: "text",
          label: "Username",
          placeholder: "Enter email or username",
        },
        password: { type: "password", label: "Password" },
      },
      async authorize(credentials) {
        try {
          const { username, password } = await credentialsSchema.parseAsync(
            credentials
          );
          const userResponse = await fetchUser(AUTH_URL, {
            username,
            password,
          });

          const user = userResponse ? createUser(userResponse) : null;
          return user as User | null;
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new InvalidCredentials(error);
          }

          throw error;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expires = user.expire_in
        token.role = user.role;
        token.name = user.name;
        token.username = user.username;
        token.id = user.id as unknown as number;

        return token;
      }

      try {

        const buffer =  5 * 60 * 1000; // 5 minutes de buffer

        if (Date.now() < (token.expires - buffer)) {
          return token;
        }
        const response = await axios.post(`${AUTH_URL}/refresh`, {
          refresh: token.refreshToken,
        });
        token.accessToken = response.data.access;
        token.refreshToken = response.data.refresh;
        token.expires = response.data.expires * 1000
        return token;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new RefreshTokenError();
        }
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id, // Accepte un id number
        name: token.name,
        username: token.username,
        email: token.email as string,
        role: token.role,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        emailVerified: null,
      };

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
