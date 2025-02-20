// import { useSession } from "next-auth/react";
// import axios, { AxiosHeaders, AxiosInstance } from "axios";
// import { useCallback } from "react";
// import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// const useApi = () => {
//   const session = useSession();

//   const api = useCallback((): AxiosInstance => {
//     const headers: {
//       [key: string]: any;
//     } = {};
//     if ((session?.data as Session)?.accessToken) {
//       headers.Authorization = `Bearer ${
//         (session?.data as Session)?.accessToken
//       }`;
//     }

//     return axios.create({
//       baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//       headers: headers as AxiosHeaders,
//     });
//   }, [session]);

//   return {
//     api,
//   };
// };

// export default useApi;
import { useSession } from "next-auth/react";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const useApi = (): AxiosInstance => {
  const { data: session } = useSession();

  return useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: (session as Session)?.accessToken
        ? { Authorization: `Bearer ${(session as Session)?.accessToken}` }
        : {},
    });
  }, [session]);
};

export default useApi;
