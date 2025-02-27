import { useState, useEffect, use } from "react";
import useApi from "@/hooks/useApi";
import { Department } from "@/types/model/Department";
import { Response } from "@/types/response/Response";
import localData from "@/hooks/useLocalData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "department_data";

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
      // localStorage.setItem(STORAGE_KEY, JSON.stringify(responseData));
      return responseData;
    },

    // initialData: () => {
    //   const local = localData(STORAGE_KEY) || null;
    //   const local = null;
    //   return local;
    // },
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
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to create department"
        );
      } else {
        console.error(error);
      }
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
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to update department"
        );
      } else {
        console.error(error);
      }
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
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to delete department"
        );
      } else {
        console.error(error);
      }
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
