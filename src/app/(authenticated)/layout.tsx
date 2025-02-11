"use client";
import React, { useState, useEffect } from "react";
import { UserNavigation } from "@/components/UserNavigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="p-0 m-0">
      <UserNavigation
        isOpen={isSidebarOpen}
        setIsOpenAction={setIsSidebarOpen}
      />
      <main
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0 lg:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
