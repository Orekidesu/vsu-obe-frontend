"use client";
import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const { session, status } = useAuth();

  if (
    status === "loading" ||
    !session ||
    (session as any).Role !== "Department"
  ) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default Page;
