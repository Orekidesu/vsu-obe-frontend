"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
  username: string;
  department: string;
  faculty: string;
}

// Sample data - in a real application, this would likely come from an API
const allUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  name: "Carl Michael C.",
  role: ["Committee", "Dean", "Dept. Head"][i % 3],
  username: `User${i + 1}`,
  department: [
    "Computer Science",
    "Information Technology",
    "Biology",
    "Chemistry",
  ][i % 4],
  faculty: ["CET", "CAS"][i % 2],
}));

const ITEMS_PER_PAGE = 5;

export function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = allUsers.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.faculty}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {startIndex + 1}-{Math.min(endIndex, allUsers.length)} of{" "}
          {allUsers.length}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            add new user
          </Button>
        </div>
      </div>
    </div>
  );
}
