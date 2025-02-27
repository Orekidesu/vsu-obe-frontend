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
  error?: string | null;
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
      console.error(error);
      setIsOpen(true);
      setIsButtonDisabled(false);
      toast({
        description: error.message || "Name or Abbreviation is already taken",
        variant: "destructive",
      });
    }
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
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled
            ? "submitting..."
            : initialData
              ? "Update Faculty"
              : "Create Faculty"}
        </Button>
      </form>
    </Form>
  );
};

export default FacultyForm;
