"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/admin/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const Dashboardpage = () => {
  const { missions, fetchMissions, loading: missionsLoading } = useMissions();
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
        <Card className="w-full text-center border-2 shadow-md ">
          <CardHeader className="text-4xl font-semi-bold">Vision</CardHeader>
          <CardContent className="">{visions[0]?.description}</CardContent>
        </Card>
        <Card className="w-full text-center border-2 shadow-md ">
          <CardHeader className="text-4xl font-semi-bold">Mission</CardHeader>
          <CardContent className="">
            {missions.map((mission) => (
              <span key={mission.id}>{mission.description}</span>
            ))}
          </CardContent>
        </Card>
      </div>
      <div></div>
    </div>
  );
};

export default Dashboardpage;
