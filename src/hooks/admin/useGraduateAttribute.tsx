import { useCallback, useEffect, useState } from "react";
import useApi from "../useApi";

interface GraduateAttribute {
  id: number;
  ga_no: number;
  description: string;
}

const STORAGE_KEY = "graduate_attributes_data";

const useGraduateAttributes = () => {
  const api = useApi();

  const [graduateAttributes, setGraduateAttributes] = useState<
    GraduateAttribute[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedGraduateAttributes = localStorage.getItem(STORAGE_KEY);
    if (cachedGraduateAttributes) {
      setGraduateAttributes(JSON.parse(cachedGraduateAttributes));
    }
  }, []);

  const fetchGraduateAttributes = useCallback(async () => {
    setLoading(false);
    setError(null);

    try {
      setLoading(true);
      setError(null);

      const response = await api.get<{ data: GraduateAttribute[] }>(
        "admin/graduate-attributes"
      );
      const fetchedGraduateAttributes = response.data.data;
      setGraduateAttributes(fetchedGraduateAttributes);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(fetchedGraduateAttributes)
      );
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
