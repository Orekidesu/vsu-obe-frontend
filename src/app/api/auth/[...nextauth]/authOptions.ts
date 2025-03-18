import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define a proper type for authenticated user
interface AuthUser {
  id: string;
  email: string;
  role: string;
  token: string;
}

// Extend the default session type
export interface Session extends DefaultSession {
  accessToken?: string | {};
  role?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          console.log(credentials);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Return only the required user information
          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          console.error("Authentication Error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({
      token,
      session,
    }: {
      token: JWT;
      session: Session;
    }): Promise<Session> {
      if (token.accessToken) {
        const getMeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );

        const myInfo = await getMeResponse.json();

        return { ...myInfo.data, accessToken: token.accessToken };
      }

      return session;
    },
    jwt({ token, user }): JWT {
      if (user) {
        // Explicitly cast user to AuthUser type
        const authUser = user as AuthUser;
        return {
          ...token,
          accessToken: authUser.token, // No more TypeScript error
        };
      }
      return token;
    },
  },
  pages: {
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: "VNsa93D+mVoLlUgHaRl9DBmzfRtigzlQak7Wg4P/hmo=",
};
