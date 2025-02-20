/*OPTION 1 */
import { useCallback, useState } from "react";
import useApi from "../useApi";

interface Mission {
  id: number;
  mission_no: number;
  description: string;
}

const useMissions = () => {
  const api = useApi();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: Mission[] }>("admin/missions");
      setMissions(response.data.data);
    } catch (error: any) {
      setError("Failed to retrieve missions");
      console.error("failed to fetch missions: ", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { missions, fetchMissions, loading };
};

export default useMissions;

/* make it persistent that even if we navigate to other tabs, it wont refresh*/

// import { useState, useCallback, useEffect } from "react";
// import useApi from "@/hooks/useApi";

// interface Mission {
//   id: number;
//   mission_no: number;
//   description: string;
// }

// const STORAGE_KEY = "missions_data";

// const useMissions = () => {
//   const api = useApi();
//   const [missions, setMissions] = useState<Mission[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Load cached data from localStorage on mount
//   useEffect(() => {
//     const cachedMissions = localStorage.getItem(STORAGE_KEY);
//     if (cachedMissions) {
//       setMissions(JSON.parse(cachedMissions));
//     }
//   }, []);

//   // Fetch data from API and cache it
//   const fetchMissions = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get<{ data: Mission[] }>("/admin/missions");
//       const fetchedMissions = response.data.data;
//       setMissions(fetchedMissions);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedMissions)); // Cache to localStorage
//     } catch (error) {
//       console.error("Failed to fetch missions:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [api]);

//   return { missions, fetchMissions, loading };
// };

// export default useMissions;
