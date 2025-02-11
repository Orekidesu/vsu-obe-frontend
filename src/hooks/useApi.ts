import { useSession } from "next-auth/react";
import axios, { AxiosHeaders, AxiosInstance } from "axios";
import { useCallback } from "react";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

const useApi = () => {
  const session = useSession();

  const api = useCallback((): AxiosInstance => {
    const headers: {
      [key: string]: any;
    } = {};
    if ((session?.data as Session)?.accessToken) {
      headers.Authorization = `Bearer ${
        (session?.data as Session)?.accessToken
      }`;
    }

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: headers as AxiosHeaders,
    });
  }, [session]);

  return {
    api,
  };
};

export default useApi;
