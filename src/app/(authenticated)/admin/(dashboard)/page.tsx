"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/admin/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import missionLogo from "../../../../../public/assets/images/mission.png";
import visionLogo from "../../../../../public/assets/images/vision.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

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
        {visionsLoading && missionsLoading ? (
          <Skeleton className="w-full h-52" />
        ) : (
          <Card className="w-full text-center border-2 shadow-md ">
            <CardHeader className="text-4xl font-semi-bold">
              <span className="flex items-center justify-center gap-2">
                Vision
                <Image
                  className="h-10 w-10"
                  src={visionLogo}
                  alt="vision logo"
                  priority
                />
              </span>
            </CardHeader>
            <CardContent className="italic">
              {visions[0]?.description}
            </CardContent>
          </Card>
        )}
        {missionsLoading && visionsLoading ? (
          <Skeleton className="w-full h-52" />
        ) : (
          <Card className="w-full text-center border-2 shadow-md ">
            <CardHeader className="text-4xl font-semi-bold">
              <span className="flex items-center justify-center gap-2">
                Mission
                <Image
                  className="h-8 w-8"
                  src={missionLogo}
                  alt="vision logo"
                  priority
                />
              </span>
            </CardHeader>
            <CardContent className="italic">{concatenatedMissions}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;
