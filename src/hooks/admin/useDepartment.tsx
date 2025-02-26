import { useState, useEffect, use } from "react";
import useApi from "@/hooks/useApi";
import { Department } from "@/types/model/Department";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "department_data";

// const useDepartments = () => {
//   const api = useApi();

//   const [departments, setDepartments] = useState<Response<Department>>();
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     localData(STORAGE_KEY) &&
//       setDepartments({
//         loading: false,
//         data: localData(STORAGE_KEY),
//       });
//   }, []);

//   const getDepartments = async () => {
//     setDepartments({
//       loading: true,
//       data: null,
//     });

//     setError(null);

//     try {
//       const response = await api.get<{ data: Department[] }>(
//         "admin/departments"
//       );

//       const fetchedDepartments = response.data.data;
//       setDepartments({
//         loading: false,
//         data: fetchedDepartments,
//       });

//       localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedDepartments));
//     } catch (error: any) {
//       setError("failed to retrieve departments");
//       console.log("failed to retrieve departments: ", error);
//     }
//   };

//   return { departments, getDepartments, error };
// };

const useDepartments = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: departments,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get<{ data: Department[] }>(
        "admin/departments"
      );
      const responseData = response.data.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responseData));
      return responseData;
    },

    initialData: () => {
      const local = localData(STORAGE_KEY) || null;
      return local;
    },
  });

  // create department

  const createDepartment = useMutation({
    mutationFn: async (newDepartment: Partial<Department>) => {
      const response = await api.post("admin/departments", newDepartment);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // update a department
  const updateDepartment = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Partial<Department>;
    }) => {
      const response = await api.put(`admin/departments/${id}`, updatedData);
      const responseData = response.data;
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  // delete a department

  const deleteDepartment = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`admin/departments${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return {
    departments,
    isLoading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};

export default useDepartments;
