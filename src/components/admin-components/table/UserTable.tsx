"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  FileSearch2,
} from "lucide-react";
import useUsers from "@/hooks/admin/useUser";
import CustomDropdown from "@/components/commons/dropdown/CustomDropdown";
import { UserTableLogic } from "@/components/admin-components/table/UserTableLogic";
import { UserTablePagination } from "./UserTablePagination";

type SortKey = "name" | "role" | "department" | "faculty";

const ITEMS_PER_PAGE = 5;

const UserTable = () => {
  const { users } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  // for filtering and sorting
  const {
    filteredAndSortedUsers,
    currentUsers,
    totalPages,
    startIndex,
    endIndex,
    handleSort,
    goToPreviousPage,
    goToNextPage,
  } = UserTableLogic(
    users,
    searchTerm,
    sortConfig,
    currentPage,
    ITEMS_PER_PAGE
  );

  const SortableHeader: React.FC<{ column: SortKey; label: string }> = ({
    column,
    label,
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => setSortConfig(handleSort(column))}
        className="flex items-center gap-1"
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name" label="Name" />
              <SortableHeader column="role" label="Role" />
              <TableHead>Email</TableHead>
              <SortableHeader column="department" label="Department" />
              <SortableHeader column="faculty" label="Faculty" />
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className={`
                  ${index !== currentUsers.length - 1 ? "border-b" : ""}
                  hover:bg-gray-50 transition-colors
                `}
              >
                <TableCell className="py-4">
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="py-4">
                  <span className="px-2 py-1 rounded-lg bg-green-600 text-white">
                    {user.role.name}
                  </span>
                </TableCell>
                <TableCell className="py-4">{user.email}</TableCell>
                <TableCell className="py-4">
                  {user.department?.name ? (
                    user.department.abbreviation
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell className="py-4">{user.faculty.name}</TableCell>
                <TableCell className="py-4 w-[80px]">
                  <CustomDropdown
                    actions={[
                      {
                        label: "Edit",
                        icon: <Pencil className="h-4 w-4 mr-2" />,
                        onClick: () => {},
                      },
                      {
                        label: "Details",
                        icon: <FileSearch2 className="h-4 w-4 mr-2 " />,
                        onClick: () => {},
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                        onClick: () => {},
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalUsers={filteredAndSortedUsers.length}
        goToPreviousPage={() => setCurrentPage(goToPreviousPage)}
        goToNextPage={() => setCurrentPage(goToNextPage)}
      />
    </div>
  );
};

export default UserTable;
