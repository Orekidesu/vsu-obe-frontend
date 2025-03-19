import { User } from "@/types/model/User";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFaculties from "@/hooks/admin/useFaculty";
import useRoles from "@/hooks/admin/useRole";
import CustomSelect from "@/components/commons/select/CustomSelect";
import useUsers from "@/hooks/admin/useUser";
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
  const [isRoleDisabled, setIsRoleDisabled] = useState(false);
  const [isFacultyDisabled, setIsFacultyDisabled] = useState(false);
  const [isDepartmentDisabled, setIsDepartmentDisabled] = useState(false);
  const { users } = useUsers();
  const { roles, isLoading: rolesIsloading, error: rolesError } = useRoles();
  const { faculties, isLoading: facultyIsLoading } = useFaculties();

  // initialize the form, initialize default values to avoid error
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      role_id: initialData?.role.id || undefined,
      faculty_id: initialData?.faculty.id || undefined,
      department_id: initialData?.department?.id || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      // Set all fields to disable when there is initial data: which means it does not allow to change roles and update faculty and department
      // so only the name and email is allowed to change when updating a user
      setSelectedFaculty(initialData.faculty.id);
      setIsRoleDisabled(true);
      setIsFacultyDisabled(true);
      setIsDepartmentDisabled(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (!selectedFaculty && !initialData) {
      setIsDepartmentDisabled(true);
    }
  }, [selectedFaculty, initialData]);

  const handleFormSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      setIsButtonDisabled(true);

      const cleanedData = { ...data };
      if (isDepartmentDisabled) {
        delete cleanedData.department_id;
      }

      //  Dynamically Get Role IDs from `roles` List
      const deanRole = roles.find((role) => role.name === "Dean");
      const departmentRole = roles.find((role) => role.name === "Department");

      //  Validation: Restrict Dean per Faculty (Exclude Self)
      if (deanRole && cleanedData.role_id === deanRole.id) {
        const facultyHasDean = users.some(
          (user) =>
            user.role.id === deanRole.id &&
            user.faculty.id === cleanedData.faculty_id &&
            user.id !== initialData?.id //  Exclude current user
        );

        if (facultyHasDean) {
          setIsFormError(true);
          setIsButtonDisabled(false);
          toast({
            description: "A Dean already exists for this faculty.",
            variant: "destructive",
          });
          return;
        }
      }

      //  Validation: Restrict Department Account per Department (Exclude Self)
      if (departmentRole && cleanedData.role_id === departmentRole.id) {
        const departmentHasAccount = users.some(
          (user) =>
            user.role.id === departmentRole.id &&
            user.department?.id === cleanedData.department_id &&
            user.id !== initialData?.id //  Exclude current user
        );

        if (departmentHasAccount) {
          setIsFormError(true);
          setIsButtonDisabled(false);
          toast({
            description: "An account already exists for this department.",
            variant: "destructive",
          });
          return;
        }
      }

      await onSubmit(cleanedData);
      setIsOpen(false);
      toast({
        description: `User ${initialData ? "Updated" : "Created"} Successfully`,
        variant: "success",
      });
    } catch {
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

    if (facultyId) {
      // Restore previous department or reset if faculty changed
      form.setValue(
        "department_id",
        form.getValues("department_id") ?? undefined
      );
    } else {
      form.setValue("department_id", null);
    }

    form.trigger("department_id"); // Ensure validation updates
  };

  const handleRoleChange = (value: string) => {
    const roleId = parseInt(value);
    const selectedRole = roles?.find((role) => role.id === roleId);

    const isDean = selectedRole?.name === "Dean";
    setIsDepartmentDisabled(isDean);
    form.setValue("role_id", roleId);

    if (isDean) {
      // When switching to "Dean," reset the department
      form.setValue("department_id", null);
    } else {
      // When switching back to "Staff," restore the previous department value
      form.setValue(
        "department_id",
        form.getValues("department_id") ?? undefined
      );
    }

    form.trigger("department_id"); // Ensure validation updates
  };

  const departments =
    faculties?.find((faculty) => faculty.id === selectedFaculty)?.departments ||
    [];

  if (rolesIsloading || facultyIsLoading) {
    return <div>please wait...</div>;
  }
  if (rolesError) {
    return <div>Error in Fetching roles.</div>;
  }
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
              <FormLabel className={isRoleDisabled ? "text-gray-600" : ""}>
                Roles
              </FormLabel>
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
                    onChange={(value) => {
                      field.onChange(parseInt(value));
                      handleRoleChange(value);
                    }}
                    contentHeight="h-32"
                    isDisabled={isRoleDisabled}
                  />
                </div>
              </FormControl>
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getServerErrorMessage("role_id")}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2 w-full">
          {/* Faculty */}
          <div className="w-full ">
            <FormField
              control={form.control}
              name="faculty_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={isFacultyDisabled ? "text-gray-600" : ""}
                  >
                    Faculty
                  </FormLabel>
                  <FormControl>
                    <div>
                      <CustomSelect
                        defaultValue={
                          initialData ? initialData.faculty.id.toString() : ""
                        }
                        options={
                          faculties?.map((faculty) => ({
                            value: faculty.id.toString(),
                            label: faculty.abbreviation,
                          })) || []
                        }
                        onChange={(value) => {
                          field.onChange(parseInt(value));
                          handleFacultyChange(value);
                        }}
                        contentHeight="h-32"
                        isDisabled={isFacultyDisabled}
                      />
                    </div>
                  </FormControl>
                  {isFormError && (
                    <div className="text-red-500 text-[12.8px]">
                      {getServerErrorMessage("faculty_id")}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            {/* Department */}
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={isDepartmentDisabled ? "text-gray-600" : ""}
                  >
                    Department
                  </FormLabel>
                  <FormControl>
                    <div>
                      <CustomSelect
                        defaultValue={
                          initialData?.department?.id
                            ? initialData.department.id.toString()
                            : "" //  Ensure it doesn't break when department is null
                        }
                        options={
                          departments?.map((department) => ({
                            value: department.id.toString(),
                            label: department.abbreviation,
                          })) || []
                        }
                        onChange={(value) => field.onChange(parseInt(value))}
                        contentHeight="h-32"
                        isDisabled={isDepartmentDisabled}
                      />
                    </div>
                  </FormControl>
                  {isFormError && (
                    <div className="text-red-500 text-[12.8px]">
                      {getServerErrorMessage("department_id")}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getServerErrorMessage("first_name")}
                </div>
              )}
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
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getServerErrorMessage("last_name")}
                </div>
              )}
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
              {isFormError && (
                <div className="text-red-500 text-[12.8px]">
                  {getServerErrorMessage("email")}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isButtonDisabled}>
            {isButtonDisabled
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
                ? "Update User"
                : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
