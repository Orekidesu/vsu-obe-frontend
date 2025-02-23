"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/admin/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import VisionMissionCard from "@/components/VisionMissionCard";
import missionLogo from "../../../../../public/assets/images/mission.png";
import visionLogo from "../../../../../public/assets/images/vision.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

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
  const {
    fetchMissions,
    concatenatedMissions,
    loading: missionsLoading,
  } = useMissions();
  const { visions, fetchVisions, loading: visionsLoading } = useVisions();
  const {
    graduateAttributes,
    fetchGraduateAttributes,
    loading: graduateAttributesLoading,
  } = useGraduateAttributes();

  useEffect(() => {
    if (!localStorage.getItem("vision_data")) {
      fetchVisions();
    }
    if (!localStorage.getItem("mission_data")) {
      fetchMissions();
    }
    if (!localStorage.getItem("graduate_attribute_data")) {
      fetchGraduateAttributes();
    }
  }, [fetchVisions, fetchMissions, fetchGraduateAttributes]);

  return (
    <div className="grid grid-rows-1 content-center">
      <div className="flex flex-col md:flex-row justify-evenly gap-4">
        <VisionMissionCard
          title="Vision"
          content={visions[0]?.description || ""}
          imageSrc={visionLogo}
          imageAlt="vision logo"
          imageSize="h-10 w-10"
          loading={visionsLoading}
        />
        <VisionMissionCard
          title="Mission"
          content={concatenatedMissions || ""}
          imageSrc={missionLogo}
          imageAlt="mission logo"
          imageSize="h-8 w-8"
          loading={missionsLoading}
        />
      </div>

      <div className="pt-10">
        {graduateAttributesLoading ? (
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
              {graduateAttributes.map((graduateAttribute) => (
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
