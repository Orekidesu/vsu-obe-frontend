"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import getCustomPathname from "@/app/utils/getCustomPathname";

const DepartmentLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  const pathname = usePathname();
  const customPathname = getCustomPathname(pathname);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className="text-2xl font-bold pt-5 pb-8">{customPathname}</header>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default DepartmentLayout;
