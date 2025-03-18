// OPTION 3

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import { Mission } from "@/types/model/Mission";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "mission_data";

const useMissions = () => {
  const api = useApi();
  const [error, setError] = useState<string | null>(null);

  // Fetch missions with React Query (caches responses)
  const {
    data: missions,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const response = await api.get<{ data: Mission[] }>("admin/missions");
      const fetchedMissions = response.data.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedMissions)); // Store locally

      return fetchedMissions;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });

  // Function to manually refetch missions (used for force refresh)
  const getMissions = async (forceRefresh = false) => {
    if (!forceRefresh && localData(STORAGE_KEY)) {
      return; // Use cached data
    }
    try {
      await refetch();
    } catch (error) {
      setError("Failed to retrieve missions");
      console.error("Failed to fetch missions:", error);
    }
  };

  return { missions, getMissions, isFetching, error };
};

export default useMissions;
