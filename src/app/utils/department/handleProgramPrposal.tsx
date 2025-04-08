import { toast } from "@/hooks/use-toast";
import { ProgramProposal } from "@/types/model/ProgramProposal";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";

// create
export const createProgramPrposalHandler = async (
  createProgramProposalMutation: UseMutationResult<
    void,
    APIError,
    Partial<ProgramProposal>,
    unknown
  >,
  data: Partial<ProgramProposal>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    createProgramProposalMutation.mutate(data, {
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
export const getProgramProposalHandler = async (
  getProgramProposal: (id: number) => Promise<ProgramProposal>,
  id: number
): Promise<ProgramProposal | null> => {
  try {
    const programProposalDetails = await getProgramProposal(id);
    return programProposalDetails;
  } catch (error) {
    toast({
      description: "Failed to get Program proposal details",
      variant: "destructive",
    });
    console.error("Error fetching Program proposal details:", error);
    return null;
  }
};
//update
export const updateProgramProposalHandler = async (
  updateProgramProposalMutation: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<ProgramProposal> },
    unknown
  >,
  data: Partial<ProgramProposal>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updateProgramProposalMutation.mutate(
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

//delete
export const deleteProgramProposalHandler = async (
  deleteProgramProposal: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    deleteProgramProposal.mutate(id, {
      onError: (error) => {
        const errorMessage =
          error?.message || "Failed to delete program proposal";
        toast({ description: error.message, variant: "destructive" });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({
          description: "Program proposal Deleted Successfully",
          variant: "success",
        });
        resolve();
      },
    });
  });
};
