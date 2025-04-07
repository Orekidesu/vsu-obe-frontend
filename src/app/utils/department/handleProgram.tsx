import { toast } from "@/hooks/use-toast";
import { Program } from "@/types/model/Program";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";

// Create
export const createProgramHandler = async (
  createUserMutation: UseMutationResult<void, APIError, Partial<User>, unknown>,
  data: Partial<User>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    createUserMutation.mutate(data, {
      onError: (error) =>
        reject(
          handleMutationError(error, "Failed to create user", setFormError)
        ),
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

// get

// update

// delete
