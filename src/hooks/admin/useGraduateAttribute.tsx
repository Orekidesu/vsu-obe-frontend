import { useCallback, useState } from "react";
import useApi from "../useApi";

interface GraduateAttribute {
  id: number;
  ga_no: number;
  description: string;
}

const useGraduateAttributes = () => {
  const api = useApi();

  const [graduateAttributes, setGraduateAttributes] = useState<
    GraduateAttribute[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGraduateAttributes = useCallback(async () => {
    setLoading(false);
    setError(null);

    try {
      setLoading(true);
      setError(null);

      const response = await api.get<{ data: GraduateAttribute[] }>(
        "admin/graduate-attributes"
      );
      setGraduateAttributes(response.data.data);
    } catch (error: any) {
      setError("failed to retrieve graduate attributes");
      console.error("failed to retrieve graduate attributes ", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { graduateAttributes, fetchGraduateAttributes, loading };
};

export default useGraduateAttributes;
