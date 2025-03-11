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
