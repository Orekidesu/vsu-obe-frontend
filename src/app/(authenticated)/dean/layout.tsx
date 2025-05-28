"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import getCustomPathname from "@/app/utils/getCustomPathname";
import { ArrowLeftIcon } from "lucide-react";

const DeanLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  const pathname = usePathname();
  const customPathname = getCustomPathname(pathname);
  const router = useRouter();

  // Show back button only on paths with IDs (detail pages or revision pages)
  const shouldDisplayBackButton =
    pathname.match(/^\/dean\/proposals\/all-programs\/\d+/) ||
    pathname.match(/^\/dean\/proposals\/all-syllabi\/\d+/);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <header className="text-2xl font-bold pt-5 pb-8 flex items-center gap-2 sticky top-0 z-10 bg-white">
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

export default DeanLayout;
