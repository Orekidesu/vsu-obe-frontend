import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions"; // Import the correct session type

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
          const role = (session as Session)?.role; // ✅ Use the correct role property
          if (role === "Admin" && !pathName.startsWith("/admin")) {
            router.push("/admin");
          } else if (role === "Dean" && !pathName.startsWith("/dean")) {
            router.push("/dean");
          } else if (
            role === "Department" &&
            !pathName.startsWith("/department")
          ) {
            router.push("/department");
          } else if (role === "Faculty" && !pathName.startsWith("/faculty")) {
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
