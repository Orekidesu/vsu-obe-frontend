"use client";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  const {
    users,
    totalUsers,
    totalPages,
    startIndex,
    endIndex,
    isLoading: isUsersLoading,
    error,
    page,
    setPage,
  } = useUsers();

  // Sorting & filtering
  const { currentUsers, handleSort } = UserTableLogic(
    users,
    searchTerm,
    sortConfig,
    page,
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
        disabled={isUsersLoading} // ✅ Disable sorting while loading
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 md:w-1/4 w-1/3"
            disabled={isUsersLoading} // ✅ Disable input while loading
          />
        </div>
        <Button className="flex items-center gap-2" disabled={isUsersLoading}>
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
            {isUsersLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading Users
                </TableCell>
              </TableRow>
            ) : currentUsers.length === 0 ? ( // ✅ Fix: Use `currentUsers` instead of `filteredAndSortedUsers`
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map(
                (
                  user,
                  index // ✅ Fix: Correctly map `currentUsers`
                ) => (
                  <TableRow
                    key={user.id}
                    className={`${
                      index !== currentUsers.length - 1 ? "border-b" : ""
                    } hover:bg-gray-50 transition-colors`}
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
                    <TableCell className="py-4">{user.faculty?.name}</TableCell>
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
                            icon: <FileSearch2 className="h-4 w-4 mr-2" />,
                            onClick: () => {},
                          },
                          {
                            label: "Delete",
                            icon: (
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            ),
                            onClick: () => {},
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        currentPage={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalUsers={totalUsers}
        goToPreviousPage={() => setPage((prev) => Math.max(1, prev - 1))}
        goToNextPage={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />
    </div>
  );
};

export default UserTable;
