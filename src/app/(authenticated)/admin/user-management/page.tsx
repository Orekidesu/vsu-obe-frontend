import React from "react";
import { UsersTable } from "@/components/UserTable";
const UserManagementPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-bold mb-6">Users</h1>
      <UsersTable />
    </div>
  );
};

export default UserManagementPage;
