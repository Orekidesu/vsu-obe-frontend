"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/shared/useMission";
import useGraduateAttributes from "@/hooks/shared/useGraduateAttribute";
import { Skeleton } from "@/components/ui/skeleton";
import CustomCard from "@/components/commons/card/CustomCard";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboardpage = () => {
  const { missions, isFetching: isFetchingMissions } = useMissions();

  const { vision, isFetching: isFetchingVision } = useVisions();
  const { graduateAttributes, isFetching: isFetchingGraduateAttributes } =
    useGraduateAttributes();

  const concatenatedMissions = React.useMemo(() => {
    return missions?.map((mission) => mission.description).join(", ");
  }, [missions]);

  return (
    <div className="grid grid-rows-1 content-center">
      <div className="flex flex-col md:flex-row justify-evenly gap-4 ">
        {isFetchingMissions && isFetchingVision ? (
          <>
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-52" />
          </>
        ) : (
          <>
            <CustomCard
              title="Vision"
              icon="/assets/images/vision.png"
              iconHeight={40}
              iconWidth={40}
            >
              {vision?.[0]?.description || ""}
            </CustomCard>

            <CustomCard
              title="Mission"
              iconHeight={32}
              iconWidth={32}
              icon="/assets/images/mission.png"
            >
              {concatenatedMissions}
            </CustomCard>
          </>
        )}
      </div>

      <div className="pt-10">
        {isFetchingGraduateAttributes ? (
          <Skeleton className=" h-60 w-full" />
        ) : (
          <Table>
            <TableCaption>List of Graduate Attributes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">GA_No.</TableHead>
                <TableHead className="">Name</TableHead>
                <TableHead className="">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(graduateAttributes || []).map((graduateAttribute) => (
                <TableRow key={graduateAttribute.id}>
                  <TableCell>{graduateAttribute.ga_no}</TableCell>
                  <TableCell className="font-semibold">
                    {graduateAttribute.name}
                  </TableCell>
                  <TableCell>{graduateAttribute.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;
