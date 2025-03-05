"use client";

import { useMemo } from "react";

type SortKey = "name" | "role" | "department" | "faculty";
type SortConfig = { key: SortKey; direction: "asc" | "desc" } | null;

export const UserTableLogic = (
  users: any[],
  searchTerm: string,
  sortConfig: SortConfig,
  currentPage: number,
  itemsPerPage: number
) => {
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

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

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

  const goToPreviousPage = () => {
    return Math.max(1, currentPage - 1);
  };

  const goToNextPage = () => {
    return Math.min(totalPages, currentPage + 1);
  };

  return {
    filteredAndSortedUsers,
    currentUsers,
    totalPages,
    startIndex,
    endIndex,
    handleSort,
    goToPreviousPage,
    goToNextPage,
  };
};
