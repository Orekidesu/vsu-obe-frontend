import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Semester {
  year: number;
  sem: string;
}

interface ProgramStructureEditProps {
  semesters: Semester[];
  updateSemesters: (semesters: Semester[]) => void;
  getSemesterName: (semesterCode: string) => string;
}

export function ProgramStructureEdit({
  semesters,
  updateSemesters,
  getSemesterName,
}: ProgramStructureEditProps) {
  const [localSemesters, setLocalSemesters] = useState<Semester[]>(semesters);
  const [newYear, setNewYear] = useState<string>("1");
  const [newSemester, setNewSemester] = useState<string>("first");

  const handleAddSemester = () => {
    const year = Number.parseInt(newYear);
    if (isNaN(year) || year < 1) return;

    // Check if this combination already exists
    const exists = localSemesters.some(
      (s) => s.year === year && s.sem === newSemester
    );
    if (exists) return;

    const updatedSemesters = [
      ...localSemesters,
      { year, sem: newSemester },
    ].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;

      const semOrder = { first: 0, second: 1, midyear: 2 };
      return (
        semOrder[a.sem as keyof typeof semOrder] -
        semOrder[b.sem as keyof typeof semOrder]
      );
    });

    setLocalSemesters(updatedSemesters);
    updateSemesters(updatedSemesters);
  };

  const handleRemoveSemester = (year: number, sem: string) => {
    const updatedSemesters = localSemesters.filter(
      (s) => !(s.year === year && s.sem === sem)
    );
    setLocalSemesters(updatedSemesters);
    updateSemesters(updatedSemesters);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={newYear} onValueChange={setNewYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={newSemester} onValueChange={setNewSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Semester</SelectItem>
                  <SelectItem value="second">Second Semester</SelectItem>
                  <SelectItem value="midyear">Midyear</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddSemester}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4" /> Add Semester
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-4">Current Semesters</h3>

        {localSemesters.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/20">
            <p>No semesters added yet. Add semesters using the form above.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localSemesters.map((semester) => (
                <TableRow key={`${semester.year}-${semester.sem}`}>
                  <TableCell>Year {semester.year}</TableCell>
                  <TableCell>{getSemesterName(semester.sem)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleRemoveSemester(semester.year, semester.sem)
                      }
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
