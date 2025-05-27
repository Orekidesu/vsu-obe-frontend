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
// import { useSession, signOut } from "next-auth/react";
// import axios, { AxiosInstance } from "axios";
// import { useMemo } from "react";
// import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// const useApi = (): AxiosInstance => {
//   const { data: session } = useSession();

//   return useMemo(() => {
//     const api = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//       headers: (session as Session)?.accessToken
//         ? { Authorization: `Bearer ${(session as Session)?.accessToken}` }
//         : {},
//     });

//     // Add response interceptor to handle auth errors
//     api.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           // Token is invalid, log out the user
//           signOut({ redirect: false });
//           window.location.href = "/";
//         }
//         return Promise.reject(error);
//       }
//     );

//     return api;
//   }, [session]);
// };

// export default useApi;
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// Create a simple loading overlay module
const showRedirectingOverlay = () => {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.id = "redirect-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  // Create message element
  const message = document.createElement("div");
  message.textContent = "Your session has expired";
  message.style.color = "white";
  message.style.fontSize = "24px";
  message.style.marginBottom = "16px";

  // Create spinner or loading message
  const redirectingText = document.createElement("div");
  redirectingText.textContent = "Redirecting you to the main page...";
  redirectingText.style.color = "white";
  redirectingText.style.fontSize = "16px";

  // Append elements
  overlay.appendChild(message);
  overlay.appendChild(redirectingText);
  document.body.appendChild(overlay);

  return overlay;
};

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
          // Show loading overlay with message (no need to store the reference)
          showRedirectingOverlay();

          // Sign out the user
          signOut({ redirect: false });

          // Redirect after a short delay to show the message
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [session]);
};

export default useApi;
