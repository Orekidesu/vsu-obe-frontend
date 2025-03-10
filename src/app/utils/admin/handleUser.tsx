import { toast } from "@/hooks/use-toast";
import { User } from "@/types/model/User";
import { UseMutationResult } from "@tanstack/react-query";
import { rejects } from "assert";
import { error } from "console";
import { set } from "react-hook-form";
import { number } from "zod";

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

export const deleteUserHandler = async (
  deleteUser: UseMutationResult<any, any, number, unknown>,
  id: number
) => {
  deleteUser.mutate(id, {
    onError: (error: any) => {
      toast({ description: error.message, variant: "destructive" });
    },
    onSuccess: () => {
      toast({ description: "User Deleted Successfully", variant: "success" });
    },
  });
};
