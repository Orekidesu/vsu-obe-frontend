import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Faculty } from "@/types/model/Faculty";
import React, { useEffect } from "react";
import { Button } from "../ui";
import { useToast } from "@/hooks/use-toast";

const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
});

type FacultyFormProps = {
  onSubmit: (data: Partial<Faculty>) => void;
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error?: string | null;
  initialData?: Faculty;
};

const FacultyForm: React.FC<FacultyFormProps> = ({
  onSubmit,
  isLoading,
  setIsOpen,
  error,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Partial<Faculty>>({
    resolver: zodResolver(facultySchema),
    defaultValues: initialData || {},
  });

  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setValue("id", initialData.id);
      setValue("name", initialData.name);
      setValue("abbreviation", initialData.abbreviation);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: Partial<Faculty>) => {
    // manually add the id when submitting form (this is for update);
    console.log(data);
    if (initialData?.id) {
      data["id"] = initialData.id;
    }
    try {
      await onSubmit(data);
      console.log("nasubmit");
      setIsOpen(false);
      toast({
        description: `Faculty ${initialData ? "Updated" : "Created"} Successfully`,
        variant: "default",
      });
    } catch (error: any) {
      console.error(error);
      setIsOpen(true);
      toast({
        description: error.message || "Name or Abbreviation is already taken",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* for id */}
      <input type="hidden" {...register("id")} />
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
        {isLoading
          ? "Submitting..."
          : initialData
            ? "Update Faculty"
            : "Create Faculty"}
      </Button>
    </form>
  );
};

export default FacultyForm;
