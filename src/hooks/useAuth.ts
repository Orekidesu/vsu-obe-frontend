import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (status === "loading") {
          return;
        }
        if (!session) {
          router.push("/");
        } else {
          const role = (session as any).Role;
          console.log(role);
          if (role === "Admin" && !pathName.startsWith("admin")) {
            router.push("/admin");
          } else if (role === "Dean" && !pathName.startsWith("dean")) {
            router.push("/dean");
          } else if (
            role === "Department" &&
            !pathName.startsWith("department")
          ) {
            router.push("/department");
          } else {
            router.push("/faculty");
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      }
    };
    checkAuth();
  }, [session, status, pathName, router]);

  return { session, status };
};
