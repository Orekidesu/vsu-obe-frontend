import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useApi from "../useApi";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "graduate_attribute_data";

const useGraduateAttributes = () => {
  const api = useApi();
  const [error, setError] = useState<string | null>(null);

  const {
    data: graduateAttributes,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["graduate-attributes"],
    queryFn: async () => {
      const response = await api.get<{ data: GraduateAttribute[] }>(
        "admin/graduate-attributes"
      );
      const fetchedGraduateAttributes = response.data.data;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(fetchedGraduateAttributes)
      ); // Store locally

      return fetchedGraduateAttributes;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });

  const getGraduateAttributes = async (forceRefresh = false) => {
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

  return { graduateAttributes, getGraduateAttributes, isFetching, error };
};

export default useGraduateAttributes;
