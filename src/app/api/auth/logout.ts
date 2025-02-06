import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
// import api from "@/app/utils/axiosInstance";
// import { signOut } from "next-auth/react";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const session = await getSession({ req });

//   if (session) {
//     try {
//       await api.post("/logout");

//       res.status(200).json({ message: "Logged Out Successfully" });
//     } catch (error) {
//       console.error("Logout error:", error);
//       res.status(500).json({ message: "Failed to log out" });
//     }
//   } else {
//     res.status(401).json({ message: "Not Authenticated" });
//   }
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  }
  res.status(200).json({ message: "This user Logged out" });
};
