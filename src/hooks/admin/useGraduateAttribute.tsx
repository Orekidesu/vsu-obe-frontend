import { useCallback, useEffect, useState } from "react";
import useApi from "../useApi";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "graduate_attribute_data";

const useGraduateAttributes = () => {
  const api = useApi();

  const [graduateAttributes, setGraduateAttributes] =
    useState<Response<GraduateAttribute>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localData(STORAGE_KEY) &&
      setGraduateAttributes({
        loading: false,
        data: localData(STORAGE_KEY) || [],
      });
  }, []);

  const getGraduateAttributes = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && localData(STORAGE_KEY)) {
        return;
      }

      setGraduateAttributes({ loading: true, data: null });
      setError(null);

      try {
        setError(null);
        const response = await api.get<{ data: GraduateAttribute[] }>(
          "admin/graduate-attributes"
        );
        const fetchedGraduateAttributes = response.data.data;
        setGraduateAttributes({
          loading: false,
          data: fetchedGraduateAttributes,
        });
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(fetchedGraduateAttributes)
        );
      } catch (error: any) {
        setError("failed to retrieve graduate attributes");
        console.error("failed to retrieve graduate attributes ", error);
      }
    },
    [api]
  );

  return { graduateAttributes, getGraduateAttributes, error };
};

export default useGraduateAttributes;
