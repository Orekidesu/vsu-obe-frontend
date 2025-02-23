"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSideBar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Roboto } from "next/font/google";
const inter = Roboto({ subsets: ["latin"], weight: "400" });

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { status, session } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session) {
    return null;
  }

  const role = (session as any).Role;

  return (
    <div>
      <SidebarProvider>
        <AppSidebar role={role} session={session as any} />
        <SidebarInset>
          <main className={inter.className}>
            <SidebarTrigger className="fixed" />
            {/* {status === "authenticated" && <SidebarTrigger />} */}
            {/* {status === "authenticated" && children} */}
            <div className="p-10">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AuthenticatedLayout;
