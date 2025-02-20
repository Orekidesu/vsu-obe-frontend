"use client";
import React from "react";
import useMissions from "@/hooks/admin/useMission";
import { useEffect } from "react";

const Dashboardpage = () => {
  const { missions, fetchMissions, loading: missionsLoading } = useMissions();
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div>
      {" "}
      {missionsLoading ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(missions, null, 2)}</pre>
      )}
    </div>
  );
};

export default Dashboardpage;
