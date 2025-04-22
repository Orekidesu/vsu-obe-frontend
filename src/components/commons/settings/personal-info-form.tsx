import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the schema for personal info form
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

// Define the type from the schema
type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface PersonalInfoFormProps {
  user: User;
  updateUserInfo: (updatedInfo: Partial<User>) => void;
}

export function PersonalInfoForm({
  user,
  updateUserInfo,
}: PersonalInfoFormProps) {
  const { toast } = useToast();

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  // Handle form submission
  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user info in parent component
      updateUserInfo(data);

      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description:
          "There was a problem updating your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-gray-100">
            <span className="text-sm text-gray-700">{user.role}</span>
            <Badge variant="outline" className="ml-2 bg-gray-200">
              Read only
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Your role determines your permissions in the system. Contact an
            administrator to change your role.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
