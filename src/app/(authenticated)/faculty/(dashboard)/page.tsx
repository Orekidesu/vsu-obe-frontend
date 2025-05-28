"use client";
import React from "react";
import CustomCard2 from "@/components/commons/card/CustomCard2";
import { FileText, Clock } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  // const { session } = useAuth() as { session: Session | null };

  // Static data for demonstration
  const activeSyllabi = 5;
  const pendingSyllabi = 2;

  return (
    <div className="grid grid-rows-1 content-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CustomCard2
          title="Active Syllabi"
          value={activeSyllabi}
          description="Total number of approved syllabi you've created"
          icon={<FileText size={24} />}
        />

        <CustomCard2
          title="Pending Syllabi"
          value={pendingSyllabi}
          description="Total number of syllabi waiting for approval"
          icon={<Clock size={24} />}
        />
      </div>

      {/* You can add more content below the cards */}
      <div className="mt-8">
        {/* Additional dashboard content can go here */}
      </div>
    </div>
  );
};

export default DashboardPage;
