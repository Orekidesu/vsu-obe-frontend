import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Department } from "@/types/model/Department";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentTableProps {
  departments: Department[];
  programProposals?: ProgramProposalResponse[];
}

export default function DepartmentTable({
  departments,
  programProposals = [],
}: DepartmentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Count active and pending programs for each department
  const getDepartmentStats = (department: Department) => {
    const activePrograms =
      department.programs?.filter((program) => program.status === "active") ||
      [];

    // Count program proposals with status "review" for this department
    const proposalsForReview = programProposals.filter(
      (proposal) =>
        proposal.status === "review" &&
        proposal.program.department_id === department.id
    );

    return {
      activeCount: activePrograms.length,
      proposalsForReviewCount: proposalsForReview.length,
    };
  };

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(departments);
  console.log(programProposals);

  return (
    <div className="space-y-4">
      <div className="flex items-center relative w-1/4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Department Name</TableHead>
              <TableHead className="text-center">Abbreviation</TableHead>
              <TableHead className="text-center">Active Programs</TableHead>
              <TableHead className="text-center">Pending Programs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  {departments.length === 0
                    ? "No departments found"
                    : "No departments match your search"}
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => {
                const { activeCount, proposalsForReviewCount } =
                  getDepartmentStats(department);
                return (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      {department.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {department.abbreviation}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        {activeCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        {proposalsForReviewCount}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
