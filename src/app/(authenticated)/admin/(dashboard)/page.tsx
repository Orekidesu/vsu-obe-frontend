"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/admin/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CustomCard from "@/components/card/CustomCard";

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
  const { getMissions, missions } = useMissions();
  const { visions, getVisions } = useVisions();
  const { graduateAttributes, getGraduateAttributes } = useGraduateAttributes();

  const concatenatedMissions = React.useMemo(() => {
    return missions?.data?.map((mission) => mission.description).join(", ");
  }, [missions]);

  const isFetched = (key: string) => {
    return !localStorage.getItem(key);
  };

  useEffect(() => {
    isFetched("vision_data") && getVisions();
    isFetched("mission_data") && getMissions();
    isFetched("graduate_attribute_data") && getGraduateAttributes();
  }, []);

  return (
    <div className="grid grid-rows-1 content-center">
      <div className="flex flex-col md:flex-row justify-evenly gap-4">
        {missions?.loading && visions?.loading ? (
          <>
            <Skeleton className="w-full h-52" />
            <Skeleton className="w-full h-52" />
          </>
        ) : (
          <>
            <CustomCard title="Vision" icon="/assets/images/vision.png">
              {visions?.data?.[0]?.description || ""}
            </CustomCard>

            <CustomCard
              title="Mission"
              iconHeight="h-8"
              iconWidth="w-8"
              icon="/assets/images/mission.png"
            >
              {concatenatedMissions}
            </CustomCard>
          </>
        )}
      </div>

      <div className="pt-10">
        {graduateAttributes?.loading ? (
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
              {graduateAttributes?.data?.map((graduateAttribute) => (
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
