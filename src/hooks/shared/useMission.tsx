import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import { Mission } from "@/types/model/Mission";
import localData from "@/hooks/useLocalData";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const STORAGE_KEY = "mission_data";

interface UseMissionsOptions {
  role?: "admin" | "department";
}

const useMissions = (options: UseMissionsOptions = {}) => {
  const api = useApi();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Default to department if not specified
  // Use session.Role (capital R) instead of session.user.role
  const role =
    options.role ||
    ((session as Session)?.Role === "Admin" ? "admin" : "department");

  // Build the endpoint based on role
  const endpoint = `${role}/missions`;

  // Fetch missions with React Query (caches responses)
  const {
    data: missions,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["missions", role], // Include role in the query key for proper caching
    queryFn: async () => {
      const response = await api.get<{ data: Mission[] }>(endpoint);
      const fetchedMissions = response.data.data;
      localStorage.setItem(
        `${role}_${STORAGE_KEY}`,
        JSON.stringify(fetchedMissions)
      ); // Store locally with role prefix

      return fetchedMissions;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 3, // Retry failed requests up to 3 times
  });

  // Function to manually refetch missions (used for force refresh)
  const getMissions = async (forceRefresh = false) => {
    const cacheKey = `${role}_${STORAGE_KEY}`;
    if (!forceRefresh && localData(cacheKey)) {
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
