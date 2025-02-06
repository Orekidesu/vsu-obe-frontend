import { signOut } from "next-auth/react";
import api from "./axiosInstance";

// const handleSignout = async () => {
//   try {
//     await api.post("api/auth/logout");
//     await signOut();
//   } catch (error) {
//     console.error("Logout failed: ", error);
//   }
// };

const handleSignout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    console.log("naka logout out sa server");
    signOut();
  } catch (error) {
    console.error("Error logging out", error);
  }
};

export default handleSignout;
