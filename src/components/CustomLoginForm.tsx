"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input, Label, Button } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session as Session).Role;
      console.log("ang role ani kay: ", role);
      if (role === "Admin") {
        router.push("/admin");
      } else if (role === "Department") {
        router.push("/department");
      } else if (role === "Dean") {
        router.push("/dean");
      } else {
        router.push("/faculty");
      }
    }
  }, [status, session, router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 5000);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Error",
          description: "Wrong Credentials, Please try again",
          variant: "destructive",
          duration: 2000,
        });
      } else {
        toast({
          title: "Login Successful",
          description: "You have been successfully logged in.",
          variant: "default",
          duration: 2000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="text-primary ">
          <Label htmlFor="email">Email</Label>
          <Input
            className="bg-white text-black"
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="py-5 text-primary">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className="bg-white text-black"
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground bg-white hover:bg-white shadow-none h-5"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-1/2 hover:bg-primary-foreground hover:text-primary transition duration-300 ease-in-out font-semibold border border-accent"
            disabled={isSubmitting || isButtonDisabled}
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
