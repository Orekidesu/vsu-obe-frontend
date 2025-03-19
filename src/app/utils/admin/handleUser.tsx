import { toast } from "@/hooks/use-toast";
import { User } from "@/types/model/User";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";

// create
export const createUserHandler = async (
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

// get single user

export const getUserHandler = async (
  getUser: (id: number) => Promise<User>,
  id: number
): Promise<User | null> => {
  try {
    const userDetails = await getUser(id);
    return userDetails;
  } catch (error) {
    toast({
      description: "Failed to get user details",
      variant: "destructive",
    });
    console.error("Error fetching user details:", error);
    return null;
  }
};

// update
export const updateUserHandler = async (
  updateUserMutation: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<User> },
    unknown
  >,
  data: Partial<User>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updateUserMutation.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error) =>
            reject(
              handleMutationError(error, "Failed to updated user", setFormError)
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
export const deleteUserHandler = async (
  deleteUser: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    deleteUser.mutate(id, {
      onError: (error) => {
        const errorMessage = error?.message || "Failed to delete user";
        toast({ description: error.message, variant: "destructive" });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({ description: "User Deleted Successfully", variant: "success" });
        resolve();
      },
    });
  });
};

// reset password

export const resetUserPasswordHandler = async (
  resetUserPassword: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    resetUserPassword.mutate(id, {
      onError: (error) => {
        const errorMessage = error?.message || "Failed to reset password";
        toast({
          description: error.message || "Failed to reset password.",
          variant: "destructive",
        });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({
          description: "Password has been reset successfully!",
          variant: "success",
        });
        resolve();
      },
    });
  });
};
