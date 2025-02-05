import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { access } from "fs";

export interface Session extends DefaultSession {
  token?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
          console.log("Api Response:", data);
          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          return data;
        } catch (error) {
          console.error("Authentication Error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }): Promise<Session> {
      if (token.accessToken) {
        const getMeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );

        const myInfo = await getMeResponse.json();
        console.log("User info from API:", myInfo, token.accessToken);

        return { ...myInfo.data, accessToken: token.accessToken };
      }

      return session;
    },
    jwt({ token, user }): JWT {
      if (user) {
        return {
          ...token,
          accessToken: (user as any).token,
        };
      }
      console.log("Which token is this:", token);
      return token;
    },
  },
  pages: {
    // signIn: "/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: "VNsa93D+mVoLlUgHaRl9DBmzfRtigzlQak7Wg4P/hmo=",
};
