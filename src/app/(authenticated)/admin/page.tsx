"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import handleSignout from "@/app/utils/handleSignout";
import { useRouter } from "next/navigation";
const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session || session?.Role !== "Admin") {
      router.back();
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session?.Role !== "Admin") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>This is the Admin Page</div>

      <button onClick={handleSignout}> Logout</button>
    </div>
  );
};

export default page;

// rafce
