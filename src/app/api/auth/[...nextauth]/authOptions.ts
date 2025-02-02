import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface Session extends DefaultSession {
  accessToken?: string;
}

export interface User extends DefaultUser {
  strapiToken?: string;
  role?: any;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const strapiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                email: credentials!.email,
                password: credentials!.password,
              }),
            }
          );

          if (!strapiResponse.ok) {
            // return error to signIn callback
            const contentType = strapiResponse.headers.get("content-type");
            if (contentType === "application/json; charset=utf-8") {
              const data = await strapiResponse.json();
              throw new Error(data.error);
            } else {
              throw new Error(strapiResponse.statusText);
            }
          }

          const data = await strapiResponse.json();

          return {
            ...data.user,
            accessToken: data?.access_token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }): Promise<Session> {
      if (token.accessToken) {
        const getMeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
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
        return {
          ...token,
          accessToken: (user as any).accessToken,
        };
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: "VNsa93D+mVoLlUgHaRl9DBmzfRtigzlQak7Wg4P/hmo=",
  pages: {
    signIn: "/sign-in",
    error: "/authError",
  },
};
