import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { YearSemester } from "@/store/wizard-store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Update the props interface to include predefinedYearSemesters
interface YearSemesterStepProps {
  yearSemesters: YearSemester[];
  predefinedYearSemesters: { year: number; semester: string; label: string }[];
  addYearSemester: (year: number, semester: string) => void;
  removeYearSemester: (id: string) => void;
}

// Update the component to accept and use predefinedYearSemesters
export function YearSemesterStep({
  yearSemesters,
  predefinedYearSemesters,
  addYearSemester,
  removeYearSemester,
}: YearSemesterStepProps) {
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState("first");
  const [error, setError] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState("");

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

  // Handle adding a new year-semester combination
  const handleAddYearSemester = () => {
    // Check if this combination already exists
    const id = `${year}-${semester}`;
    const exists = yearSemesters.some((ys) => ys.id === id);

    if (exists) {
      setError("This year and semester combination already exists.");
      return;
    }

    addYearSemester(year, semester);
    setError("");
  };

  // Handle adding a predefined year-semester combination
  const handleAddPredefined = () => {
    if (!selectedPredefined) {
      setError("Please select a year-semester combination.");
      return;
    }

    const [selectedYear, selectedSemester] = selectedPredefined.split("-");
    const yearNum = Number.parseInt(selectedYear);

    // Check if this combination already exists
    const id = `${yearNum}-${selectedSemester}`;
    const exists = yearSemesters.some((ys) => ys.id === id);

    if (exists) {
      setError("This year and semester combination already exists.");
      return;
    }

    addYearSemester(yearNum, selectedSemester);
    setError("");
    setSelectedPredefined("");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Add Years and Semesters
      </h2>

      <div className="space-y-8">
        {/* Current year-semester combinations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Current Year-Semester Combinations
          </h3>

          {yearSemesters.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>
                No year-semester combinations added yet. Add your first one
                below.
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
        </div>

        {/* Add new year-semester combination */}
        <div className="space-y-6 border p-6 rounded-md">
          <h3 className="text-lg font-medium">Add Year-Semester Combination</h3>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="predefined" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="predefined">Predefined Options</TabsTrigger>
              <TabsTrigger value="custom">Custom Combination</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="predefinedSelect">
                  Select a predefined year-semester
                </Label>
                <Select
                  value={selectedPredefined}
                  onValueChange={setSelectedPredefined}
                >
                  <SelectTrigger id="predefinedSelect">
                    <SelectValue placeholder="Select year and semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedYearSemesters.map((option) => (
                      <SelectItem
                        key={`${option.year}-${option.semester}`}
                        value={`${option.year}-${option.semester}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAddPredefined}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
                >
                  <Plus className="h-4 w-4" /> Add Selected Combination
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Year Selection */}
                <div className="space-y-4">
                  <Label className="text-base">Year</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setYear(Math.max(1, year - 1))}
                      disabled={year <= 1}
                      className="h-10 w-10"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="text-2xl font-semibold w-16 text-center">
                      {year}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setYear(Math.min(6, year + 1))}
                      disabled={year >= 6}
                      className="h-10 w-10"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Semester Selection */}
                <div className="space-y-4">
                  <Label className="text-base">Semester</Label>
                  <RadioGroup
                    value={semester}
                    onValueChange={setSemester}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="first"
                        id="first"
                        className="text-green-600"
                      />
                      <Label htmlFor="first" className="cursor-pointer">
                        First Semester
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="second"
                        id="second"
                        className="text-green-600"
                      />
                      <Label htmlFor="second" className="cursor-pointer">
                        Second Semester
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="midyear"
                        id="midyear"
                        className="text-green-600"
                      />
                      <Label htmlFor="midyear" className="cursor-pointer">
                        Midyear
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleAddYearSemester}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4" /> Add Custom Combination
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-sm text-muted-foreground mt-2">
            Note: Midyear semester occurs between years (after second semester
            and before the next year)
          </p>
        </div>
      </div>
    </>
  );
}
