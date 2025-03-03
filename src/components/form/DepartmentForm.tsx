import { Department } from "@/types/model/Department";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type React from "react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import useFaculties from "@/hooks/admin/useFaculty";
import CustomSelect from "@/components/commons/select/CustomSelect";

import { Button, Input } from "@/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Value } from "@radix-ui/react-select";

// schema for department
const departmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters"),
  faculty_id: z.number().min(1, "select a faculty"),
});

// define the props

type DepartmentFormProps = {
  onSubmit: (data: Partial<Department>) => void;
  setIsOpen: (isOpen: boolean) => void;
  error?: Record<string, string[]> | string | null;
  initialData?: Department;
};

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  onSubmit,
  setIsOpen,
  error,
  initialData,
}) => {
  const { toast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);

  const { faculties } = useFaculties();

  // initialize the form
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: initialData || {
      name: "",
      abbreviation: "",
    },
  });

  // set initial values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.setValue("id", initialData.id);
      form.setValue("faculty_id", initialData.faculty_id);
      form.setValue("name", initialData.name);
      form.setValue("abbreviation", initialData.abbreviation);
    }
  }, [initialData, form]);

  // handle form submission
  const handleFormSubmit = async (data: z.infer<typeof departmentSchema>) => {
    try {
      setIsButtonDisabled(true);
      await onSubmit(data);
      setIsOpen(false);
      toast({
        description: `Department ${initialData ? "Updated" : "Created"} Successfully`,
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
          name="faculty_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faulty</FormLabel>
              <FormControl>
                <div className="">
                  <CustomSelect
                    options={
                      faculties?.map((faculty) => ({
                        value: faculty.id.toString(),
                        label: faculty.name,
                      })) || []
                    }
                    onChange={(value) => field.onChange(parseInt(value))}
                    contentHeight="h-32"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter department name" {...field} />
              </FormControl>
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getErrorMessage("name")}
                </div>
              )}
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
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getErrorMessage("abbreviation")}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled
            ? "submitting..."
            : initialData
              ? "Update Department"
              : "Create Department"}
        </Button>
      </form>
    </Form>
  );
};

export default DepartmentForm;
