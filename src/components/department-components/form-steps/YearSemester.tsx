import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { YearSemester, ProgramTemplate } from "@/store/wizard-store";

interface YearSemesterStepProps {
  yearSemesters: YearSemester[];
  programTemplates: ProgramTemplate[];
  setYearSemesters: (yearSemesters: YearSemester[]) => void;
  removeYearSemester: (id: string) => void;
}

export function YearSemesterStep({
  yearSemesters,
  programTemplates,
  setYearSemesters,
  removeYearSemester,
}: YearSemesterStepProps) {
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  // Handle selecting a program template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);

    // Find the selected template
    const template = programTemplates.find((t) => t.id === templateId);

    if (template) {
      // Set the year-semesters from the template
      setYearSemesters([...template.yearSemesters]);
      setError("");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Program Structure
      </h2>

      <div className="space-y-8">
        {/* Program Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Program Structure</CardTitle>
            <CardDescription>
              Choose a predefined program structure to automatically set up your
              year and semester combinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedTemplate}
                onValueChange={handleSelectTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program structure" />
                </SelectTrigger>
                <SelectContent>
                  {programTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTemplate && (
                <p className="text-sm text-muted-foreground">
                  {
                    programTemplates.find((t) => t.id === selectedTemplate)
                      ?.description
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current year-semester combinations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Current Year-Semester Combinations
          </h3>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {yearSemesters.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>
                No year-semester combinations added yet. Select a program
                structure above.
              </p>
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
                {yearSemesters.map((ys) => (
                  <TableRow key={ys.id}>
                    <TableCell>Year {ys.year}</TableCell>
                    <TableCell>{getSemesterName(ys.semester)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeYearSemester(ys.id)}
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

          <p className="text-sm text-muted-foreground mt-2">
            Note: You can remove specific year-semester combinations if needed.
            Midyear semester occurs between years (after second semester and
            before the next year).
          </p>
        </div>
      </div>
    </>
  );
}
