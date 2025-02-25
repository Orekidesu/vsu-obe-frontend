"use client";
import React, { useState } from "react";
import useFaculties from "@/hooks/admin/useFaculty";
import useDepartments from "@/hooks/admin/useDepartment";
import { useEffect } from "react";
import { Search, MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Span } from "next/dist/trace";

const FacultiesDepartmentsPage = () => {
  const { faculties, getFaculties } = useFaculties();
  const { departments, getDepartments } = useDepartments();

  const [selectedFaculty, setSelectedFaculty] = useState(
    faculties?.data?.at(0)
  );

  const isFetched = (key: string) => {
    return !localStorage.getItem(key);
  };

  useEffect(() => {
    isFetched("faculty_data") && getFaculties();
    isFetched("department_data") && getDepartments();
  }, []);

  return (
    <div className=" grid md:grid-cols-2 grid-cols-1 gap-6">
      {/* FACULTY SECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Faculties</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
            <Input placeholder="Search Faculty" className="pl-8" />
          </div>
          <Select defaultValue="asc">
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="asc">A - Z</SelectItem>
              <SelectItem value="desc">Z - A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border border-rounded-lg h-64 flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto">
            {faculties?.data?.map((faculty) => (
              <div
                key={faculty.id}
                className={`flex items-center justify-between p-3 hover:bg-muted/50 ${selectedFaculty === faculty ? "bg-primary/15" : ""}`}
                onClick={() => setSelectedFaculty(faculty)}
              >
                <span>{faculty.name}</span>

                {selectedFaculty === faculty && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full border-t rounded-none hover:bg-primary/80 hover:text-primary-foreground"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>
      </div>

      {/* DEPARTMENT SECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Departments</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
            <Input placeholder="Search Department" className="pl-8" />
          </div>
          <Select defaultValue="asc">
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="asc">A - Z</SelectItem>
              <SelectItem value="desc">Z - A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="border border-rounded-lg h-64">
          {departments?.data?.map((department) => (
            <div key={department.id}>
              <span>{department.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultiesDepartmentsPage;
