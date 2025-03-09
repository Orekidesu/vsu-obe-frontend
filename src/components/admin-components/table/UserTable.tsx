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
import CustomDialog from "@/components/commons/dialog/CustomDialog";
import { UserTableLogic } from "@/components/admin-components/table/UserTableLogic";
import { UserTablePagination } from "./UserTablePagination";
import UserForm from "../form/UserForm";
import { User } from "@/types/model/User";
import {
  createUserHandler,
  updateUserHandler,
} from "@/app/utils/admin/handleUser";

type SortKey = "name" | "role" | "department" | "faculty";

const ITEMS_PER_PAGE = 5;

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isUserEditMode, setIsUserEditMode] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<
    Record<string, string[]> | string | null
  >(null);

  const {
    users,
    isLoading: isUsersLoading,
    page,
    setPage,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  // Creating User
  const handleCreateUser = async (data: Partial<User>) => {
    await createUserHandler(createUser, data, setFormError);
  };

  // Updating User
  const handleUpdateUser = async (data: Partial<User>) => {
    await updateUserHandler(updateUser, data, setFormError);
    setIsUserEditMode(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user); //set selected user state
    setIsUserEditMode(true);
    setIsUserDialogOpen(true);
  };

  // Handling submit form
  const handleSubmitUserForm = async (data: Partial<User>) => {
    if (isUserEditMode && selectedUser) {
      await handleUpdateUser({ ...selectedUser, ...data });
    } else {
      await handleCreateUser(data);
    }
  };

  // Sorting & filtering logic
  const {
    currentUsers,
    totalUsers,
    totalPages,
    startIndex,
    endIndex,
    handleSort,
  } = UserTableLogic(users, searchTerm, sortConfig, page, ITEMS_PER_PAGE);

  // Sorting headers
  const SortableHeader: React.FC<{ column: SortKey; label: string }> = ({
    column,
    label,
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => setSortConfig(handleSort(column))}
        className="m-0 p-0"
        disabled={isUsersLoading}
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );

  const roleColors: { [key: string]: string } = {
    Dean: "bg-green-600",
    Department: "bg-yellow-600",
    Staff: "bg-yellow-600",
  };
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); //  Reset pagination when searching
            }}
            className="pl-8 md:w-1/4 w-1/3"
            disabled={isUsersLoading}
          />
        </div>
        <CustomDialog
          buttonTitle="Add User"
          title={`${isUserEditMode ? "Edit" : "Add"} User`}
          footerButtonTitle="save"
          isOpen={isUserDialogOpen}
          setIsOpen={(isOpen) => {
            setIsUserDialogOpen(isOpen);
            if (!isOpen) setIsUserEditMode(false);
          }}
          buttonIcon={<Plus />}
        >
          <UserForm
            onSubmit={handleSubmitUserForm}
            setIsOpen={setIsUserDialogOpen}
            error={formError}
            initialData={isUserEditMode ? selectedUser || undefined : undefined}
          />
        </CustomDialog>
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isUsersLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading Users...
                </TableCell>
              </TableRow>
            ) : currentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`${
                    index !== currentUsers.length - 1 ? "border-b" : ""
                  } hover:bg-primary/10 transition-colors ${
                    selectedUser?.id === user.id ? "bg-primary/10" : ""
                  }`} // Highlight row if user is selected
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell className="py-4 w-1/5">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="py-4 w-1/8">
                    <span
                      className={`px-2 py-1 rounded-lg text-white ${roleColors[user.role.name] || "bg-gray-600"}`}
                    >
                      {user.role.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 w-1/5">{user.email}</TableCell>
                  <TableCell className="py-4">
                    {user.department?.name ? (
                      user.department.abbreviation
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 w-1/5">
                    {user.faculty?.abbreviation}
                  </TableCell>
                  <TableCell className="py-4 w-[80px]">
                    <CustomDropdown
                      actions={[
                        {
                          label: "Edit",
                          icon: <Pencil className="h-4 w-4 mr-2" />,
                          onClick: () => handleEditUser(user),
                        },
                        {
                          label: "Details",
                          icon: <FileSearch2 className="h-4 w-4 mr-2 " />,
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
              ))
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
