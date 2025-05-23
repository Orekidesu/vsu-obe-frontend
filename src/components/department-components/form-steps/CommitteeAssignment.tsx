import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, UserMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Committee } from "@/store/wizard-store";

interface CommitteeAssignmentStepProps {
  committees: Committee[];
  selectedCommittees: number[];
  addCommittee: (committeeId: number) => void;
  removeCommittee: (committeeId: number) => void;
  setSelectedCommittees: (committeeIds: number[]) => void;
  isLoading?: boolean;
}

export function CommitteeAssignmentStep({
  committees,
  selectedCommittees,
  addCommittee,
  removeCommittee,
  setSelectedCommittees,
  isLoading = false,
}: CommitteeAssignmentStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter committees based on search term
  const filteredCommittees = committees.filter(
    (committee) =>
      committee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle committee selection
  const toggleCommittee = (committeeId: number) => {
    if (selectedCommittees.includes(committeeId)) {
      removeCommittee(committeeId);
    } else {
      addCommittee(committeeId);
    }
  };

  // Select all visible committees
  const selectAllVisible = () => {
    const visibleCommitteeIds = filteredCommittees.map(
      (committee) => committee.id
    );
    const newSelectedCommittees = [
      ...new Set([...selectedCommittees, ...visibleCommitteeIds]),
    ];
    setSelectedCommittees(newSelectedCommittees);
  };

  // Deselect all committees
  const deselectAll = () => {
    setSelectedCommittees([]);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Assign Committees
      </h2>

      <div className="space-y-6">
        {/* Search and actions */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search committees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllVisible}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden md:inline">Select All Visible</span>
              <span className="inline md:hidden">Select All</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
              className="flex items-center gap-1"
              disabled={selectedCommittees.length === 0}
            >
              <UserMinus className="h-4 w-4" />
              <span className="hidden md:inline">Deselect All</span>
              <span className="inline md:hidden">Deselect</span>
            </Button>
          </div>
        </div>

        {/* Selected committees summary */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Selected Committees</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCommittees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No committees selected yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCommittees.map((committeeId) => {
                  const committee = committees.find(
                    (c) => c.id === committeeId
                  );
                  if (!committee) return null;
                  return (
                    <Badge
                      key={committeeId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {committee.first_name} {committee.last_name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => removeCommittee(committeeId)}
                      >
                        <span className="sr-only">Remove</span>
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Committees table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-muted-foreground"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-pulse flex space-x-2 items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="ml-2">
                        Loading Available Committees...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCommittees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No committees found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommittees.map((committee) => (
                  <TableRow key={committee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCommittees.includes(committee.id)}
                        onCheckedChange={() => toggleCommittee(committee.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {committee.first_name} {committee.last_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {selectedCommittees.includes(committee.id) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCommittee(committee.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCommittee(committee.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Add
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedCommittees.length === 0 && (
          <Alert
            variant="destructive"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertDescription>
              Please select at least one committee member
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
