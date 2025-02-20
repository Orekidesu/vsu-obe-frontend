"use client";

import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSideBar";
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main>
          {status === "authenticated" && <SidebarTrigger />}
          {status === "authenticated" && children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AuthenticatedLayout;
