import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useApi from "../useApi";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import localData from "@/hooks/useLocalData";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const STORAGE_KEY = "graduate_attribute_data";

interface UseGraduateAttributeOptions {
  role?: "admin" | "department";
}

const useGraduateAttributes = (options: UseGraduateAttributeOptions = {}) => {
  const api = useApi();
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Admin" ? "admin" : "department");

  const endpoint = `${role}/graduate-attributes`;

  const {
    data: graduateAttributes,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["graduate-attributes", role],
    queryFn: async () => {
      const response = await api.get<{ data: GraduateAttribute[] }>(endpoint);
      const fetchedGraduateAttributes = response.data.data;
      localStorage.setItem(
        `${role}_${STORAGE_KEY}`,
        JSON.stringify(fetchedGraduateAttributes)
      ); // Store locally

      return fetchedGraduateAttributes;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });

  const getGraduateAttributes = async (forceRefresh = false) => {
    if (!forceRefresh && localData(`${role}_${STORAGE_KEY}`)) {
      return; // Use cached data
    }
    try {
      await refetch();
    } catch (error) {
      setError("Failed to retrieve graduate attributes");
      console.error("Failed to fetch graduate attributes:", error);
    }
  };

  return { graduateAttributes, getGraduateAttributes, isFetching, error };
};

export default useGraduateAttributes;
