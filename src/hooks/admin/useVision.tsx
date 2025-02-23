import { cache, useCallback, useEffect, useState } from "react";
import useApi from "../useApi";

interface Vision {
  id: number;
  description: string;
}

const STORAGE_KEY = "vision_data";

const useVisions = () => {
  const api = useApi();

  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedVisions = localStorage.getItem(STORAGE_KEY);
    if (cachedVisions) {
      setVisions(JSON.parse(cachedVisions));
    }
  }, []);

  const fetchVisions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Vision[] }>("admin/visions");
      const fetchedVisions = response.data.data;
      setVisions(fetchedVisions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedVisions));
    } catch (error: any) {
      setError("Failed to retrieve visions");
      console.error("Failed to retrieve visions: ", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { visions, fetchVisions, loading, error };
};

export default useVisions;
