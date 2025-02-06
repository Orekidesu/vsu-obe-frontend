// import { signOut } from "next-auth/react";
// const handleSignout = async () => {
//   try {
//     signOut();
//   } catch (error) {
//     console.error("Error logging out", error);
//   }
// };

// export default handleSignout;

import { signOut } from "next-auth/react";

export const handleSignOut = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Logout response status: ", response.status);
    const data = await response.json();

    await signOut({ redirect: false });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default signOut;
