import { Department } from "@/types/model/Department";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
export const createDepartmentHandler = async (
  createdDepartment: UseMutationResult<any, any, Partial<Department>, unknown>,
  data: Partial<Department>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    createdDepartment.mutate(data, {
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.errors ||
            "something went wrong during adding department"
        );
        reject(
          new Error(
            error?.response?.data?.errors ||
              "something went wrong during adding department"
          )
        );
      },
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

export const updateDepartmentHandler = async (
  updatedDepartment: UseMutationResult<
    any,
    any,
    { id: number; updatedData: Partial<Department> },
    unknown
  >,
  data: Partial<Department>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updatedDepartment.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error: any) => {
            setFormError(
              error?.response?.data?.errors ||
                "something went wrong during updating department"
            );
            reject(
              new Error(
                error?.response?.data?.errors ||
                  "something went wrong during updating department"
              )
            );
          },
          onSuccess: () => {
            setFormError(null);
            resolve();
          },
        }
      );
    }
  });
};

const deleteDepartmentHandler = async (
  deleteFaculty: UseMutationResult<any, any, number, unknown>,
  id: number
) => {
  deleteFaculty.mutate(id, {
    onError: (error: any) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Faculty Deleted Successfully",
        variant: "success",
      });
    },
  });
};
