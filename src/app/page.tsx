"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Input, Label, Button } from "@/components/ui";
import Image from "next/image";
import vsuLogo from "../../public/assets/images/vsu_logo.png";
import vsuHomePageLogo from "../../public/assets/images/vsu_home_page_logo2.jpg";

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
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session as any).Role;
      console.log("ang role ani kay: ", role);
      if (role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/dean");
      }
    }
  }, [status, session, router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Left side - Illustration */}
      <div className="hidden w-1/2 bg-muted lg:block">
        <div className="flex h-full items-center justify-center">
          <Image src={vsuHomePageLogo} alt="home page logo"></Image>
        </div>
      </div>

      {/* Right side - Login form */}
      {/* <div className="flex w-full items-center justify-center lg:w-1/2 bg-primary text-primary-foreground"> */}
      <div className="flex w-full items-center justify-center lg:w-1/2 bg-[#e5dfda] text-primary">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col justify-center items-center">
            <div>
              <Image src={vsuLogo} alt="vsu logo" className="h-28 w-28"></Image>
            </div>
            <div className="pt-10 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                VSU OBE MANAGEMENT AND MONITORING SYSTEM
              </h1>
            </div>
          </div>

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
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Log in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
