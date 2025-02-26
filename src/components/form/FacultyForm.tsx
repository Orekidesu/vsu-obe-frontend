import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Faculty } from "@/types/model/Faculty";
import React from "react";
import { Button } from "../ui";

const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
});

type FacultyFormProps = {
  onSubmit: (data: Partial<Faculty>) => void;
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FacultyForm: React.FC<FacultyFormProps> = ({
  onSubmit,
  isLoading,
  setIsOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Faculty>>({ resolver: zodResolver(facultySchema) });

  const handleFormSubmit = (data: Partial<Faculty>) => {
    onSubmit(data);
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name")}
          className="w-full p-2 border rounded"
          placeholder="Enter faculty name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      {/* Abbreviation Field */}
      <div>
        <label className="block text-sm font-medium">Abbreviation</label>
        <input
          {...register("abbreviation")}
          className="w-full p-2 border rounded"
          placeholder="Enter abbreviation"
        />
        {errors.abbreviation && (
          <p className="text-red-500 text-sm">{errors.abbreviation?.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Create Faculty"}
      </Button>
    </form>
  );
};

export default FacultyForm;
