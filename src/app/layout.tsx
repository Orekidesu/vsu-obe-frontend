import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/reactQueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Provider from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "VSU Management & Monitoring System",
  description: "A Management and Monitoring System for VSU",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${robotoSans.variable} ${robotoSans.variable} antialiased`}
      >
        <div className="flex h-screen w-screen overflow-auto">
          <main className="w-full h-full grow">
            <QueryClientProvider client={queryClient}>
              <Provider session={session}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </Provider>
            </QueryClientProvider>
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
