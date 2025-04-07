import { toast } from "@/hooks/use-toast";
import { Program } from "@/types/model/Program";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";

// Create
export const createProgramHandler = async (
  createProgramMutation: UseMutationResult<
    void,
    APIError,
    Partial<Program>,
    unknown
  >,
  data: Partial<Program>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    createProgramMutation.mutate(data, {
      onError: (error) =>
        reject(
          handleMutationError(error, "Failed to create program", setFormError)
        ),
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

// get
export const getProgramHandler = async (
  getProgram: (id: number) => Promise<Program>,
  id: number
): Promise<Program | null> => {
  try {
    const programDetails = await getProgram(id);
    return programDetails;
  } catch (error) {
    toast({
      description: "Failed to get Program details",
      variant: "destructive",
    });
    console.error("Error fetching Program details:", error);
    return null;
  }
};

// update
export const updateProgramHandler = async (
  updateProgramMutation: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<Program> },
    unknown
  >,
  data: Partial<Program>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updateProgramMutation.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error) =>
            reject(
              handleMutationError(
                error,
                "Failed to update program",
                setFormError
              )
            ),
          onSuccess: () => {
            setFormError(null);
            resolve();
          },
        }
      );
    }
  });
};

// delete
export const deleteProgramHandler = async (
  deleteProgram: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    deleteProgram.mutate(id, {
      onError: (error) => {
        const errorMessage = error?.message || "Failed to delete program";
        toast({ description: error.message, variant: "destructive" });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({
          description: "Program Deleted Successfully",
          variant: "success",
        });
        resolve();
      },
    });
  });
};
