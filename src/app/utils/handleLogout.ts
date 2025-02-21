// import { signOut } from "next-auth/react";
// const handleSignout = async () => {
//   try {
//     signOut();
//   } catch (error) {
//     console.error("Error logging out", error);
//   }
// };

// export default handleSignout;

// import { signOut } from "next-auth/react";
// import { resolve } from "path";

// const handleLogout = async (token: string) => {
//   try {
//     console.log("mao ni ang token:" + token);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("Logout response status: ", response.status);
//     console.log("logged out successfully");
//     const data = await response.json();
//     console.log(data);

//     await signOut({ redirect: false });
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

// export default handleLogout;
import { signOut } from "next-auth/react";

const handleLogout = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, // Ensure correct API URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json", // Ensure Laravel returns JSON
        },
      }
    );

    console.log("Logout response status: ", response.status);

    // Check if response is valid before parsing
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logout failed: ${errorText}`);
    }

    const data = await response.json();

    console.log("Logout response data:", data);
    await signOut({ redirect: false });

    // i clear tanan data na naa sa local storage after logout
    localStorage.clear();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default handleLogout;
