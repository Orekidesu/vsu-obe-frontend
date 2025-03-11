import type { Faculty } from "@/types/model/Faculty";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type React from "react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//Define schema
const facultySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
});

// Define the props for the FacultyForm component
type FacultyFormProps = {
  onSubmit: (data: Partial<Faculty>) => void;
  setIsOpen: (isOpen: boolean) => void;
  error?: Record<string, string[]> | string | null;
  initialData?: Faculty;
};

const FacultyForm: React.FC<FacultyFormProps> = ({
  onSubmit,
  setIsOpen,
  error,
  initialData,
}) => {
  const { toast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  // Initialize the form with default values and resolver
  const form = useForm<z.infer<typeof facultySchema>>({
    resolver: zodResolver(facultySchema),
    defaultValues: initialData || {
      name: "",
      abbreviation: "",
    },
  });

  // set initial values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.setValue("id", initialData.id);
      form.setValue("name", initialData.name);
      form.setValue("abbreviation", initialData.abbreviation);
    }
  }, [initialData, form]);

  // handle form submission
  const handleFormSubmit = async (data: z.infer<typeof facultySchema>) => {
    try {
      setIsButtonDisabled(true);
      await onSubmit(data);

      setIsOpen(false);
      toast({
        description: `Faculty ${initialData ? "Updated" : "Created"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      setIsOpen(true);
      setIsButtonDisabled(false);
      setIsFormError(true);
    }
  };
  const getErrorMessage = (field: string) => {
    if (typeof error === "string") {
      return error;
    }
    return error?.[field]?.[0];
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter faculty name" {...field} />
              </FormControl>
              <FormMessage />
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getErrorMessage("name")}
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abbreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abbreviation</FormLabel>
              <FormControl>
                <Input placeholder="Enter abbreviation" {...field} />
              </FormControl>

              <FormMessage />
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getErrorMessage("abbreviation")}
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled
            ? initialData
              ? "Submitting..."
              : "Creating..."
            : initialData
              ? "Update Faculty"
              : "Create Faculty"}
        </Button>
      </form>
    </Form>
  );
};

export default FacultyForm;
