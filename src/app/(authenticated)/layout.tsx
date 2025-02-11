"use client";

import { useAuth } from "@/hooks/useAuth";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default AuthenticatedLayout;
