import { useState, useEffect } from "react";
import useApi from "../useApi";
import { Faculty } from "@/types/model/Faculty";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "faculty_data";

const useFaculties = () => {
  const api = useApi();

  const [faculties, setFaculties] = useState<Response<Faculty>>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localData(STORAGE_KEY) &&
      setFaculties({
        loading: false,
        data: localData(STORAGE_KEY) || [],
      });
  }, []);

  const getFaculties = async () => {
    setFaculties({
      loading: true,
      data: null,
    });

    setError(null);

    try {
      const response = await api.get<{ data: Faculty[] }>("admin/faculties");
      const fetchedFaculties = response.data.data;
      setFaculties({ loading: false, data: fetchedFaculties });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedFaculties));
    } catch (error: any) {
      setError("failed to retrieve missions");
      console.error("failed to fetch missions: ", error);
    }
  };

  return { faculties, getFaculties, error };
};

export default useFaculties;
