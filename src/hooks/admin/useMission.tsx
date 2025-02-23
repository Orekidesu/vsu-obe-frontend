/*OPTION 1 */
import { useCallback, useEffect, useState } from "react";
import useApi from "../useApi";
import { json } from "stream/consumers";

interface Mission {
  id: number;
  mission_no: number;
  description: string;
}

const STORAGE_KEY = "mission_data";

const useMissions = () => {
  const api = useApi();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [concatenatedMissions, setConcatenatedMissions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedMissions = localStorage.getItem(STORAGE_KEY);
    if (cachedMissions) {
      const parsedMissions = JSON.parse(cachedMissions);

      setMissions(parsedMissions);
      setConcatenatedMissions(
        parsedMissions.map((mission: Mission) => mission.description).join(", ")
      );
    }
  }, []);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: Mission[] }>("admin/missions");
      const fetchedMissions = response.data.data;
      setMissions(fetchedMissions);
      setConcatenatedMissions(
        fetchedMissions.map((mission) => mission.description).join(", ")
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedMissions));
    } catch (error: any) {
      setError("Failed to retrieve missions");
      console.error("failed to fetch missions: ", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { missions, fetchMissions, concatenatedMissions, loading };
};

export default useMissions;

/* OPTION 2 -> PUTTING EXPIRATION FOR LOCALSTORAGE*/

// import { useCallback, useEffect, useState } from "react";
// import useApi from "../useApi";

// interface Mission {
//   id: number;
//   mission_no: number;
//   description: string;
// }

// const STORAGE_KEY = "mission_data";
// const CACHE_EXPIRATION_KEY = "mission_data_expiration";
// // const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// const useMissions = () => {
//   const api = useApi();

//   const [missions, setMissions] = useState<Mission[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const cachedMissions = localStorage.getItem(STORAGE_KEY);
//     const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

//     if (
//       cachedMissions &&
//       cacheExpiration &&
//       Date.now() < parseInt(cacheExpiration)
//     ) {
//       setMissions(JSON.parse(cachedMissions));
//     } else {
//       fetchMissions();
//     }
//   }, []);

//   const fetchMissions = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get<{ data: Mission[] }>("admin/missions");
//       const fetchedMissions = response.data.data;
//       setMissions(fetchedMissions);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedMissions));
//       localStorage.setItem(
//         CACHE_EXPIRATION_KEY,
//         (Date.now() + CACHE_DURATION).toString()
//       );
//     } catch (error: any) {
//       setError("Failed to retrieve missions");
//       console.error("failed to fetch missions: ", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [api]);

//   return { missions, fetchMissions, loading, error };
// };

// export default useMissions;
