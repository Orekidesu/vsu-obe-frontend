import { User } from "@/types/model/User";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFaculties from "@/hooks/admin/useFaculty";
import useRoles from "@/hooks/admin/useRole";
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
import { useToast } from "@/hooks/use-toast";

// initialize a schema

const userSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().min(2, "First Name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role_id: z.number(),
  faculty_id: z.number(),
  department_id: z.number().optional().nullable(),
});

type UserFormProps = {
  onSubmit: (data: Partial<User>) => void;
  setIsOpen: (isOpen: boolean) => void;
  error?: Record<string, string[]> | string | null;
  initialData?: User;
};

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  setIsOpen,
  error,
  initialData,
}) => {
  const { toast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);

  const { roles } = useRoles();
  const { faculties } = useFaculties();

  // initialize the form
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("id", initialData.id);
      form.setValue("first_name", initialData.first_name);
      form.setValue("last_name", initialData.last_name);
      form.setValue("email", initialData.email);
      form.setValue("role_id", initialData.role.id);
      form.setValue("faculty_id", initialData.faculty.id);
      form.setValue("department_id", initialData?.department.id);
      setSelectedFaculty(initialData.faculty.id);
    }
  }, [initialData, form]);

  const handleFormSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      setIsButtonDisabled(true);
      await onSubmit(data);
      setIsOpen(false);
      toast({
        description: `User ${initialData ? "Updated" : "Created"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      setIsOpen(true);
      setIsButtonDisabled(false);
      setIsFormError(true);
    }
  };

  const getServerErrorMessage = (field: string) => {
    if (typeof error === "string") {
      return error;
    }
    return error?.[field]?.[0];
  };

  const handleFacultyChange = (value: string) => {
    const facultyId = parseInt(value);
    setSelectedFaculty(facultyId);
    form.setValue("faculty_id", facultyId);
    form.setValue("department_id", null); // Reset department when faculty changes
  };

  const defaultFacultyValue = initialData
    ? faculties
        ?.find((faculty) => faculty.id === initialData.faculty.id)
        ?.id.toString()
    : undefined;

  const departments =
    faculties?.find((faculty) => faculty.id === selectedFaculty)?.departments ||
    [];

  const defaultDepartmentValue = initialData
    ? departments
        ?.find((department) => department.id === initialData.department.id)
        ?.id.toString()
    : undefined;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {/* Roles */}
        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <FormControl>
                <div>
                  <CustomSelect
                    defaultValue={
                      initialData ? initialData.role.id.toString() : ""
                    }
                    options={
                      roles?.map((role) => ({
                        value: role.id.toString(),
                        label: role.name,
                      })) || []
                    }
                    onChange={(value) => field.onChange(parseInt(value))}
                    contentHeight="h-32"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {/* Faculty */}
        <FormField
          control={form.control}
          name="faculty_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <FormControl>
                <div>
                  <CustomSelect
                    defaultValue={defaultFacultyValue}
                    options={
                      faculties?.map((faculty) => ({
                        value: faculty.id.toString(),
                        label: faculty.name,
                      })) || []
                    }
                    onChange={(value) => {
                      field.onChange(parseInt(value));
                      handleFacultyChange(value);
                    }}
                    contentHeight="h-32"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {/* Department */}
        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <div>
                  <CustomSelect
                    defaultValue={defaultDepartmentValue}
                    options={
                      departments?.map((department) => ({
                        value: department.id.toString(),
                        label: department.name,
                      })) || []
                    }
                    onChange={(value) => field.onChange(parseInt(value))}
                    contentHeight="h-32"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* First Name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isButtonDisabled}>
          {isButtonDisabled
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update User"
              : "Create User"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
