"use client";
import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions"; // Import the correct session type

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const { session, status } = useAuth();

  const role = (session as Session)?.Role;

  console.log(role);
  if (status === "loading" || !session || role !== "Dean") {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default Page;
