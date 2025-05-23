"use client";
import React from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Loader2 } from "lucide-react";

// import CustomCard2 from "@/components/commons/card/CustomCard2";

const DashboardPage = () => {
  // const { session } = useAuth() as { session: Session | null };

  // console.log(session); //check if the iscommittee is in the session

  return (
    <div className="grid grid-rows-1 content-center">
      <div className="flex flex-col md:flex-row justify-evenly gap-2 ">
        Active Syllabus,Pending Syllabus Revision
      </div>
    </div>
  );
};

export default DashboardPage;
