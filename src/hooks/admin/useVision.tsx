import { cache, useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { Vision } from "@/types/model/Vision";
import localData from "@/hooks/useLocalData";
import { Response } from "@/types/response/Response";

const STORAGE_KEY = "vision_data";

const useVisions = () => {
  const api = useApi();

  const [visions, setVisions] = useState<Response<Vision>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localData(STORAGE_KEY) &&
      setVisions({
        loading: false,
        data: localData(STORAGE_KEY) || [],
      });
  }, []);

  const getVisions = async (forceRefresh = false) => {
    // if data exists in local storage and no force refresh is requested,return early
    if (!forceRefresh && localData(STORAGE_KEY)) {
      return;
    }

    setVisions({ loading: true, data: null });
    setError(null);

    try {
      const response = await api.get<{ data: Vision[] }>("admin/visions");
      const fetchedVisions = response.data.data;
      setVisions({ loading: false, data: fetchedVisions });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedVisions));
    } catch (error: any) {
      setError("Failed to retrieve visions");
      console.error("Failed to retrieve visions: ", error);
    }
  };

  return { visions, getVisions, error };
};

export default useVisions;
