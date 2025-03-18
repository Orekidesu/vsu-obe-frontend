import { Department } from "@/types/model/Department";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { APIError, handleMutationError } from "../errorHandler";

//  Create Department Handler
export const createDepartmentHandler = async (
  createDepartment: UseMutationResult<
    void,
    APIError,
    Partial<Department>,
    unknown
  >,
  data: Partial<Department>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    createDepartment.mutate(data, {
      onError: (error) =>
        reject(
          handleMutationError(error, "Failed to add department", setFormError)
        ),
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

//  Update Department Handler
export const updateDepartmentHandler = async (
  updateDepartment: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<Department> },
    unknown
  >,
  data: Partial<Department>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!data.id) {
      reject(new Error("Department ID is required"));
      return;
    }

    updateDepartment.mutate(
      { id: data.id, updatedData: data },
      {
        onError: (error) =>
          reject(
            handleMutationError(
              error,
              "Failed to update department",
              setFormError
            )
          ),
        onSuccess: () => {
          setFormError(null);
          resolve();
        },
      }
    );
  });
};

//  Delete Department Handler
export const deleteDepartmentHandler = async (
  deleteDepartment: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    deleteDepartment.mutate(id, {
      onError: (error) => {
        const errorMessage = error?.message || "Failed to delete department";
        toast({ description: errorMessage, variant: "destructive" });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({
          description: "Department Deleted Successfully",
          variant: "success",
        });
        resolve();
      },
    });
  });
};
