import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
/**
 * Extracts and formats user data from a session object
 * @param session - The user session object
 * @returns An object containing the user's first name, last name, and email
 */

export function getUserData(session: Session): {
  firstName: string;
  lastName: string;
  email: string;
} {
  if (!session) {
    return {
      firstName: "",
      lastName: "",
      email: "",
    };
  }
  return {
    firstName: session.First_Name || "",
    lastName: session.Last_Name || "",
    email: session.Email || "",
  };
}

/**
 * Gets the full name of the user from the session
 * @param session - The user session object
 * @returns The user's full name (first + last)
 */
export function getFullName(session: Session): string {
  if (!session) return "";

  const firstName = session.First_Name || "";
  const lastName = session.Last_Name || "";

  return `${firstName} ${lastName}`.trim();
}

/**
 * Gets the user's role from the session
 * @param session - The user session object
 * @returns The user's role or an empty string if not available
 */
export function getUserRole(session: Session): string {
  if (!session) return "";
  return session.Role || "";
}

/**
 * Gets department information from the session
 * @param session - The user session object
 * @returns Department name and abbreviation if available
 */
export function getDepartmentInfo(
  session: Session
): { name: string; abbreviation: string } | null {
  if (!session || !session.Department) return null;

  return {
    name: session.Department.name || "",
    abbreviation: session.Department.abbreviation || "",
  };
}
