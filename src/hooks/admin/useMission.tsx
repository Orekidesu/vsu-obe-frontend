import { useState, useCallback } from "react";
import useApi from "@/hooks/useApi";

interface Mission {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const useMissions = () => {
  const api = useApi();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: Mission[] }>("admin/missions");
      setMissions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch missions:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { missions, fetchMissions, loading };
};

export default useMissions;
