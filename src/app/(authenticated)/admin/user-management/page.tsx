"use client";
import React from "react";
import UserTable from "@/components/admin-components/table/UserTable";
// import { UsersTable } from "@/components/UserTable";
const UserManagementPage = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-medium mb-6">Users</h1>
      <UserTable />
      {/* <UsersTable /> */}
    </div>
  );
};

export default UserManagementPage;
