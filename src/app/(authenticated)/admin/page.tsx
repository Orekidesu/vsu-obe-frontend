"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import handleSignout from "@/app/utils/handleSignout";
import { useRouter } from "next/navigation";
const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session || (session as any).Role !== "Admin") {
      router.back();
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session as any).Role !== "Admin") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>This is the Admin Page</div>
      <button onClick={() => handleSignout((session as any).accessToken)}>
        logout
      </button>
    </div>
  );
};

export default page;

// rafce
