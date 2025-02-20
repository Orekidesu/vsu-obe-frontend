import { useCallback, useState } from "react";
import useApi from "../useApi";

interface Vision {
  id: number;
  description: string;
}

const useVisions = () => {
  const api = useApi();

  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Vision[] }>("admin/visions");
      setVisions(response.data.data);
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
