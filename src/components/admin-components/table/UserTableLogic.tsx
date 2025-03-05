"use client";

import { useMemo } from "react";

type SortKey = "name" | "role" | "department" | "faculty";
type SortConfig = { key: SortKey; direction: "asc" | "desc" } | null;

export const UserTableLogic = (
  users: any[], // Already paginated users from API
  searchTerm: string,
  sortConfig: SortConfig
) => {
  // ✅ Only filter and sort, DO NOT paginate again
  const filteredAndSortedUsers = useMemo(() => {
    return (
      users
        ?.filter((user) =>
          Object.values(user).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort((a, b) => {
          if (!sortConfig) return 0;

          let aValue, bValue;
          switch (sortConfig.key) {
            case "name":
              aValue = `${a.first_name} ${a.last_name}`;
              bValue = `${b.first_name} ${b.last_name}`;
              break;
            case "role":
              aValue = a.role.name;
              bValue = b.role.name;
              break;
            case "department":
              aValue = a.department?.name || "";
              bValue = b.department?.name || "";
              break;
            case "faculty":
              aValue = a.faculty.name;
              bValue = b.faculty.name;
              break;
          }
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }) || []
    );
  }, [users, searchTerm, sortConfig]);

  const handleSort =
    (key: SortKey) =>
    (prevConfig: SortConfig): SortConfig => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    };

  console.log("Filtered Users:", filteredAndSortedUsers);

  return {
    filteredAndSortedUsers,
    handleSort,
  };
};
