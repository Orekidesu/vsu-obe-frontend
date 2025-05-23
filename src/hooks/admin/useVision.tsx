import { useState } from "react";
import useApi from "@/hooks/useApi";
import { Vision } from "@/types/model/Vision";
import localData from "@/hooks/useLocalData";
import { useQuery } from "@tanstack/react-query";
const STORAGE_KEY = "vision_data";

const useVisions = () => {
  const api = useApi();
  const [error, setError] = useState<string | null>(null);

  const {
    data: vision,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["visions"],
    queryFn: async () => {
      const response = await api.get<{ data: Vision[] }>("admin/visions");
      const fetchedVision = response.data.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedVision)); // Store locally

      return fetchedVision;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });

  const getVision = async (forceRefresh = false) => {
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

  return { vision, getVision, isFetching, error };
};

export default useVisions;
