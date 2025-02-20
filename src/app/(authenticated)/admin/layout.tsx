"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
