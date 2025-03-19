import { Faculty } from "@/types/model/Faculty";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { APIError, handleMutationError } from "../errorHandler";

export const createFacultyHandler = async (
  createdFaculty: UseMutationResult<void, APIError, Partial<Faculty>, unknown>,
  data: Partial<Faculty>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    createdFaculty.mutate(data, {
      onError: (error) =>
        reject(handleMutationError(error, "Failed to add faculty")),
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

export const updateFacultyHandler = async (
  updatedFaculty: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<Faculty> },
    unknown
  >,
  data: Partial<Faculty>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updatedFaculty.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error) =>
            reject(handleMutationError(error, "Failed to updated faculty")),
          onSuccess: () => {
            setFormError(null);
            resolve();
          },
        }
      );
    }
  });
};

export const deleteFacultyHandler = (
  deleteFaculty: UseMutationResult<void, APIError, number, unknown>,
  id: number
) => {
  deleteFaculty.mutate(id, {
    onError: (error) => {
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
