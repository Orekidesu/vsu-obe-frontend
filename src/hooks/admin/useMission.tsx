import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { Mission } from "@/types/model/Mission";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "mission_data";

const useMissions = () => {
  const api = useApi();
  const [missions, setMissions] = useState<Response<Mission>>();
  const [error, setError] = useState<string | null>(null);

  //Fetch Existing Data from Location Storage
  useEffect(() => {
    localData(STORAGE_KEY) &&
      setMissions({
        loading: false,
        data: localData(STORAGE_KEY) || [],
      });
  }, []);

  const getMissions = async (forceRefresh = false) => {
    // if data exists in local storage and no force refresh is requested,return early
    if (!forceRefresh && localData(STORAGE_KEY)) {
      return;
    }
    setMissions({
      loading: true,
      data: null,
    });
    setError(null);
    try {
      const response = await api.get<{ data: Mission[] }>("admin/missions");
      const fetchedMissions = response.data.data;
      setMissions({
        loading: false,
        data: fetchedMissions,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedMissions));
    } catch (error: any) {
      setError("Failed to retrieve missions");
      console.error("failed to fetch missions: ", error);
    }
  };

  return { missions, getMissions, error };
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
