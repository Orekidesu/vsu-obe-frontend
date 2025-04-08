"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import getCustomPathname from "@/app/utils/getCustomPathname";
import { ArrowLeftIcon } from "lucide-react";

const DepartmentLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  const pathname = usePathname();
  const customPathname = getCustomPathname(pathname);
  const router = useRouter();

  // Define routes where the back button should NOT appear
  const routesWithoutBackButton = [
    "/department",
    "/department/programs/all-programs",
    "/department/programs/archive",
    "/department/courses",
    "/department/committees",
    "/department/settings",
  ];
  const shouldDisplayBackButton = !routesWithoutBackButton.includes(pathname);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <header className="text-2xl font-bold pt-5 pb-8 flex items-center gap-2">
        {shouldDisplayBackButton && (
          <button
            onClick={() => router.back()}
            className="hover:text-gray-600"
            aria-label="Go back"
          >
            <ArrowLeftIcon />
          </button>
        )}
        <span>{customPathname}</span>
      </header>
      <main className="w-full grow">{children}</main>
    </div>
  );
};

export default DepartmentLayout;
