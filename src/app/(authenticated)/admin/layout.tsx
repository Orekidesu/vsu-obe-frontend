"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import getCustomPathname from "@/app/utils/getCustomPathname";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const pathname = usePathname();
  const customPathname = getCustomPathname(pathname);

  return (
    <div>
      <header className="text-2xl font-bold pt-5 pb-8">{customPathname}</header>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default AdminLayout;
