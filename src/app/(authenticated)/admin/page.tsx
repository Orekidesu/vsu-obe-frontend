"use client";
import React, { useEffect } from "react";
import handleSignout from "@/app/utils/handleSignout";
import { useAuth } from "@/hooks/useAuth";
const page = () => {
  const { session, status } = useAuth();
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
