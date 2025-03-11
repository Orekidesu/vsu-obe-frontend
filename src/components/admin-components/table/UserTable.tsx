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
import { CustomAlertDialog } from "@/components/commons/alert-dialog/CustomAlertDialog";
import { UserTableLogic } from "@/components/admin-components/table/UserTableLogic";
import { UserTablePagination } from "./UserTablePagination";
import UserForm from "../form/UserForm";
import { User } from "@/types/model/User";
import {
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  resetUserPasswordHandler,
} from "@/app/utils/admin/handleUser";

type SortKey = "name" | "role" | "department" | "faculty";

const ITEMS_PER_PAGE = 5;

const UserTable = () => {
  const {
    users,
    isLoading: isUsersLoading,
    page,
    setPage,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getUser,
  } = useUsers();

  // Searching & Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
  const [isUserEditMode, setIsUserEditMode] = useState<boolean>(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] =
    useState<boolean>(false);

  // user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Error states
  const [formError, setFormError] = useState<
    Record<string, string[]> | string | null
  >(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Creating User
  const handleCreateUser = async (data: Partial<User>) => {
    await createUserHandler(createUser, data, setFormError);
  };

  // Get single user
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsDialogOpen(true);
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
  // Trigger delete modal from dropdown
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsAlertDialogOpen(true);
  };
  const handleDeleteUser = async (id: number) => {
    setIsDeleting(true); //  Show "Deleting..."
    try {
      await deleteUserHandler(deleteUser, id); //  Wait until deletion is done
      setIsAlertDialogOpen(false); //  Close dialog only AFTER deletion
      setUserToDelete(null);
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setIsDeleting(false); //  Reset button state
    }
  };

  const handleResetUserPassword = async (id: number) => {
    try {
      await resetUserPasswordHandler(resetUserPassword, id); // Wait until password reset is done
      setTimeout(() => {
        setIsResetDialogOpen(false); // Close dialog only AFTER reset and delay
        setUserToReset(null);
      }, 2000); // Delay of 2 seconds before closing the dialog
    } catch (error) {
      console.error("Password reset failed:", error);
    }
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
    Dean: "bg-green-200 text-green-800",
    Department: "bg-yellow-200 text-yellow-800",
    Staff: "bg-orange-200 text-orange-800",
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
                      className={`px-2 py-1  rounded-lg ${roleColors[user.role.name] || "bg-gray-600"}`}
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
                          onClick: () => handleViewUserDetails(user),
                        },
                        {
                          label: "Reset Password",
                          icon: (
                            <img
                              src="\assets\icons\change-password.svg"
                              alt=""
                              className="h-4 w-4 mr-2"
                            />
                          ),
                          onClick: () => {
                            setUserToReset(user);
                            setIsResetDialogOpen(true);
                          },
                        },
                        {
                          label: "Delete",
                          icon: (
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          ),

                          onClick: () => confirmDeleteUser(user),
                        },
                      ]}
                      margin="0 20px 0 0"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Area */}
      <UserTablePagination
        currentPage={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalUsers={totalUsers}
        goToPreviousPage={() => setPage((prev) => Math.max(1, prev - 1))}
        goToNextPage={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />
      {/*  Custom Alert Dialog For Deleting User Area */}
      <CustomAlertDialog
        title="Delete User"
        description="Are you sure you want to delete this user? All data associated with this user will also be deleted. This action cannot be undone."
        actionText="Delete"
        actionVariant="destructive"
        isLoading={isDeleting} // Pass state from UserTable
        onAction={() => userToDelete && handleDeleteUser(userToDelete.id)}
        onCancel={() => setIsAlertDialogOpen(false)}
        open={isAlertDialogOpen}
        onOpenChangeAction={setIsAlertDialogOpen}
      />
      {/* Custom Alert Dialog for Reseting User Password Area */}
      <CustomAlertDialog
        title="Reset Password"
        description={`Are you sure you want to reset the password for ${userToReset?.first_name} ${userToReset?.last_name}? This action cannot be undone.`}
        actionText="Resetting..."
        preActionText="Reset"
        actionVariant="destructive"
        onAction={() => {
          if (userToReset) {
            handleResetUserPassword(userToReset.id);
          }
        }}
        cancelText="Cancel"
        onCancel={() => {
          setIsResetDialogOpen(false);
          setUserToReset(null);
        }}
        open={isResetDialogOpen}
        onOpenChangeAction={setIsResetDialogOpen}
      />
      <CustomDialog
        title={`${selectedUser?.first_name}  ${selectedUser?.last_name}`}
        footerButtonTitle="Close"
        isOpen={isUserDetailsDialogOpen}
        setIsOpen={setIsUserDetailsDialogOpen}
      >
        {selectedUser && (
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {selectedUser.role.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {selectedUser.email}
            </p>
            <p>
              <span className="font-semibold">Faculty:</span>{" "}
              {selectedUser.faculty.name}
            </p>
            {selectedUser.department && (
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {selectedUser.department?.name}
              </p>
            )}
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default UserTable;
