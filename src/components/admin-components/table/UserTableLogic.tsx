"use client";

import { useMemo } from "react";
import { User } from "@/types/model/User";

type SortKey = "name" | "role" | "department" | "faculty";
type SortConfig = { key: SortKey; direction: "asc" | "desc" } | null;

export const UserTableLogic = (
  users: User[], // Now contains ALL users
  searchTerm: string,
  sortConfig: SortConfig,
  currentPage: number,
  itemsPerPage: number
) => {
  // Apply searching & sorting BEFORE paginating
  const filteredAndSortedUsers = useMemo(() => {
    let processedUsers = [...users];

    // Search Users
    if (searchTerm) {
      processedUsers = processedUsers.filter((user) =>
        Object.values(user).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    //  Sorting
    if (sortConfig) {
      processedUsers.sort((a, b) => {
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
          default:
            return 0;
        }
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return processedUsers;
  }, [users, searchTerm, sortConfig]);

  //  Apply pagination AFTER filtering & sorting
  const totalUsers = filteredAndSortedUsers.length; //  Now updates dynamically
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  //  Sorting Toggle
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

  return {
    filteredAndSortedUsers,
    currentUsers,
    totalUsers, //  Now passing correct total user count
    totalPages,
    startIndex,
    endIndex,
    handleSort,
  };
};
