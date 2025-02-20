"use client";

import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSideBar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
        <main>
          {/* {status === "authenticated" && <SidebarTrigger />} */}
          {/* {status === "authenticated" && children} */}
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AuthenticatedLayout;
