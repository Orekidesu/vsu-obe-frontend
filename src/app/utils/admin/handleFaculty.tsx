import { Faculty } from "@/types/model/Faculty";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const createFacultyHandler = async (
  createdFaculty: UseMutationResult<any, any, Partial<Faculty>, unknown>,
  data: Partial<Faculty>,
  // setFormError: (error: string | null) => void
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    createdFaculty.mutate(data, {
      onError: (error: any) => {
        setFormError(error?.response?.data?.errors || "Something went wrong");
        reject(
          new Error(error?.response?.data?.errors || "Something went wrong")
        );
      },
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

export const updateFacultyHandler = async (
  updatedFaculty: UseMutationResult<
    any,
    any,
    { id: number; updatedData: Partial<Faculty> },
    unknown
  >,
  data: Partial<Faculty>,
  // setFormError: (error: string | null) => void
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updatedFaculty.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error: any) => {
            setFormError(
              error?.response?.data?.errors || "Something went wrong"
            );
            reject(
              new Error(error?.response?.data?.errors || "Something went wrong")
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

export const deleteFacultyHandler = (
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
