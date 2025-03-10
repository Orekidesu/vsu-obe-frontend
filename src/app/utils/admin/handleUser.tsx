import { toast } from "@/hooks/use-toast";
import { User } from "@/types/model/User";
import { UseMutationResult } from "@tanstack/react-query";
import { rejects } from "assert";
import { error } from "console";
import { set } from "react-hook-form";
import { number } from "zod";

// create
export const createUserHandler = async (
  createUserMutation: UseMutationResult<any, any, Partial<User>, unknown>,
  data: Partial<User>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    createUserMutation.mutate(data, {
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.errors ||
            "Something went wrong while creating the user."
        );
        reject(
          new Error(error?.response?.data?.errors || "Failed to create user")
        );
      },
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};

// update
export const updateUserHandler = async (
  updateUserMutation: UseMutationResult<
    any,
    any,
    { id: number; updatedData: Partial<User> },
    unknown
  >,
  data: Partial<User>,
  setFormError: (error: Record<string, string[]> | string | null) => void
) => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updateUserMutation.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error: any) => {
            setFormError(
              error?.response?.data?.errors ||
                "Something went wrong while updating the user."
            );
            reject(
              new Error(
                error?.response?.data?.errors || "Failed to update user"
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

// delete

export const deleteUserHandler = async (
  deleteUser: UseMutationResult<any, any, number, unknown>,
  id: number
) => {
  return new Promise<void>((resolve, reject) => {
    deleteUser.mutate(id, {
      onError: (error: any) => {
        toast({ description: error.message, variant: "destructive" });
        reject(error); //  Ensure error is propagated
      },
      onSuccess: () => {
        toast({ description: "User Deleted Successfully", variant: "success" });
        resolve(); // Ensure success resolves the Promise
      },
    });
  });
};

// reset password

export const resetUserPasswordHandler = async (
  resetUserPassword: UseMutationResult<any, any, number, unknown>,
  id: number
) => {
  resetUserPassword.mutate(id, {
    onError: (error: any) => {
      toast({
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Password has been reset successfully!",
        variant: "success",
      });
    },
  });
};
