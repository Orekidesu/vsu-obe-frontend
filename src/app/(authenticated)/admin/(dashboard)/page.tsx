"use client";
import React from "react";
import useVisions from "@/hooks/admin/useVision";
import useMissions from "@/hooks/admin/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { useEffect } from "react";

const Dashboardpage = () => {
  const { missions, fetchMissions, loading: missionsLoading } = useMissions();
  const { visions, fetchVisions, loading: visionsLoading } = useVisions();
  const {
    graduateAttributes,
    fetchGraduateAttributes,
    loading: graduateAttributesLoading,
  } = useGraduateAttributes();

  useEffect(() => {
    fetchVisions();
    fetchMissions();
    fetchGraduateAttributes();
  }, [fetchVisions, fetchMissions, fetchGraduateAttributes]);

  return (
    <div>
      <h1>Missions</h1>
      <ul>
        {missions.map((mission) => (
          <li key={mission.id}>
            {mission.mission_no}: {mission.description}
          </li>
        ))}
      </ul>
      <h1>Vision</h1>
      <p>{visions[0]?.description}</p>

      <h1>Graduate Attributes</h1>
      <ul>
        {graduateAttributes.map((graduateAttribute) => (
          <li key={graduateAttribute.id}>
            {graduateAttribute.ga_no}: {graduateAttribute.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboardpage;
