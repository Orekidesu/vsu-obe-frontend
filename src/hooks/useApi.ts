// import { useSession } from "next-auth/react";
// import axios, { AxiosInstance } from "axios";
// import { useMemo } from "react";
// import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// const useApi = (): AxiosInstance => {
//   const { data: session } = useSession();

//   return useMemo(() => {
//     return axios.create({
//       baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//       headers: (session as Session)?.accessToken
//         ? { Authorization: `Bearer ${(session as Session)?.accessToken}` }
//         : {},
//     });
//   }, [session]);
// };

// export default useApi;
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const useApi = (): AxiosInstance => {
  const { data: session } = useSession();

  return useMemo(() => {
    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: (session as Session)?.accessToken
        ? { Authorization: `Bearer ${(session as Session)?.accessToken}` }
        : {},
    });

    // Add response interceptor to handle auth errors
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token is invalid, log out the user
          signOut({ redirect: false });
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [session]);
};

export default useApi;
