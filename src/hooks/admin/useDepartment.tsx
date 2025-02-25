import { useState, useEffect, use } from "react";
import useApi from "@/hooks/useApi";
import { Department } from "@/types/model/Department";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";

const STORAGE_KEY = "department_data";

const useDepartments = () => {
  const api = useApi();

  const [departments, setDepartments] = useState<Response<Department>>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localData(STORAGE_KEY) &&
      setDepartments({
        loading: false,
        data: localData(STORAGE_KEY),
      });
  }, []);

  const getDepartments = async () => {
    setDepartments({
      loading: true,
      data: null,
    });

    setError(null);

    try {
      const response = await api.get<{ data: Department[] }>(
        "admin/departments"
      );

      const fetchedDepartments = response.data.data;
      setDepartments({
        loading: false,
        data: fetchedDepartments,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedDepartments));
    } catch (error: any) {
      setError("failed to retrieve departments");
      console.log("failed to retrieve departments: ", error);
    }
  };

  return { departments, getDepartments, error };
};

export default useDepartments;
