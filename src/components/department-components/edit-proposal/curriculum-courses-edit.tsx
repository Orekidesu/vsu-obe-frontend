import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Course {
  code: string;
  descriptive_title: string;
}

interface CourseCategory {
  name: string;
  code: string;
}

interface Semester {
  year: number;
  sem: string;
}

interface CurriculumCourse {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
}

interface CurriculumCoursesEditProps {
  courses: Course[];
  curriculumCourses: CurriculumCourse[];
  categories: CourseCategory[];
  semesters: Semester[];
  updateCourses: (courses: Course[]) => void;
  updateCurriculumCourses: (curriculumCourses: CurriculumCourse[]) => void;
  getSemesterName: (semesterCode: string) => string;
}

export function CurriculumCoursesEdit({
  courses,
  curriculumCourses,
  categories,
  semesters,
  updateCourses,
  updateCurriculumCourses,
  getSemesterName,
}: CurriculumCoursesEditProps) {
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);
  const [localCurriculumCourses, setLocalCurriculumCourses] =
    useState<CurriculumCourse[]>(curriculumCourses);

  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSemesterYear, setSelectedSemesterYear] = useState<
    number | null
  >(null);
  const [selectedSemesterName, setSelectedSemesterName] = useState<string>("");
  const [units, setUnits] = useState<string>("3");

  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editSemesterYear, setEditSemesterYear] = useState<number | null>(null);
  const [editSemesterName, setEditSemesterName] = useState("");
  const [editUnits, setEditUnits] = useState("");

  // Group curriculum courses by semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  semesters.forEach((sem) => {
    const key = `${sem.year}-${sem.sem}`;
    groupedCourses[key] = localCurriculumCourses.filter(
      (cc) => cc.semester_year === sem.year && cc.semester_name === sem.sem
    );
  });

  // Sort semesters by year and semester
  const sortedSemesters = [...semesters].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;

    const semOrder = { first: 0, second: 1, midyear: 2 };
    return (
      semOrder[a.sem as keyof typeof semOrder] -
      semOrder[b.sem as keyof typeof semOrder]
    );
  });

  const handleAddCourse = () => {
    // Validate inputs
    if (
      !newCourseCode.trim() ||
      !newCourseTitle.trim() ||
      !selectedCategory ||
      !selectedSemesterYear ||
      !selectedSemesterName
    ) {
      setError("All fields are required.");
      return;
    }

    const unitsValue = Number.parseFloat(units);
    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Units must be a positive number.");
      return;
    }

    // Check if course code already exists
    const courseExists = localCourses.some(
      (c) => c.code.toLowerCase() === newCourseCode.toLowerCase()
    );
    let updatedCourses = [...localCourses];

    if (!courseExists) {
      // Add new course
      updatedCourses = [
        ...localCourses,
        { code: newCourseCode, descriptive_title: newCourseTitle },
      ];
      setLocalCourses(updatedCourses);
      updateCourses(updatedCourses);
    }

    // Check if this course is already in the curriculum for this semester
    const curriculumCourseExists = localCurriculumCourses.some(
      (cc) =>
        cc.course_code === newCourseCode &&
        cc.semester_year === selectedSemesterYear &&
        cc.semester_name === selectedSemesterName
    );

    if (curriculumCourseExists) {
      setError(
        `Course ${newCourseCode} is already in the curriculum for this semester.`
      );
      return;
    }

    // Add to curriculum courses
    const newCurriculumCourse: CurriculumCourse = {
      course_code: newCourseCode,
      category_code: selectedCategory,
      semester_year: selectedSemesterYear,
      semester_name: selectedSemesterName,
      units: unitsValue,
    };

    const updatedCurriculumCourses = [
      ...localCurriculumCourses,
      newCurriculumCourse,
    ];
    setLocalCurriculumCourses(updatedCurriculumCourses);
    updateCurriculumCourses(updatedCurriculumCourses);

    // Reset form
    setNewCourseCode("");
    setNewCourseTitle("");
    setSelectedCategory("");
    setSelectedSemesterYear(null);
    setSelectedSemesterName("");
    setUnits("3");
    setError("");
  };

  const handleStartEdit = (index: number) => {
    const course = localCurriculumCourses[index];
    setEditingIndex(index);
    setEditCategory(course.category_code);
    setEditSemesterYear(course.semester_year);
    setEditSemesterName(course.semester_name);
    setEditUnits(course.units.toString());
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditCategory("");
    setEditSemesterYear(null);
    setEditSemesterName("");
    setEditUnits("");
  };

  const handleSaveEdit = (index: number) => {
    // Validate inputs
    if (!editCategory || !editSemesterYear || !editSemesterName) {
      setError("All fields are required.");
      return;
    }

    const unitsValue = Number.parseFloat(editUnits);
    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Units must be a positive number.");
      return;
    }

    // Update the curriculum course
    const updatedCurriculumCourses = [...localCurriculumCourses];
    updatedCurriculumCourses[index] = {
      ...updatedCurriculumCourses[index],
      category_code: editCategory,
      semester_year: editSemesterYear,
      semester_name: editSemesterName,
      units: unitsValue,
    };

    setLocalCurriculumCourses(updatedCurriculumCourses);
    updateCurriculumCourses(updatedCurriculumCourses);

    // Reset form
    setEditingIndex(null);
    setEditCategory("");
    setEditSemesterYear(null);
    setEditSemesterName("");
    setEditUnits("");
    setError("");
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCurriculumCourses = localCurriculumCourses.filter(
      (_, i) => i !== index
    );
    setLocalCurriculumCourses(updatedCurriculumCourses);
    updateCurriculumCourses(updatedCurriculumCourses);
  };

  return (
    <div className="space-y-8">
      {/* Add Course Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Course to Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CSIT 101"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  placeholder="e.g., Introduction to Computing"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseCategory">Course Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="courseCategory">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.code} value={category.code}>
                        {category.name} ({category.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Year and Semester</Label>
                <Select
                  value={
                    selectedSemesterYear && selectedSemesterName
                      ? `${selectedSemesterYear}-${selectedSemesterName}`
                      : ""
                  }
                  onValueChange={(value) => {
                    const [year, sem] = value.split("-");
                    setSelectedSemesterYear(Number.parseInt(year));
                    setSelectedSemesterName(sem);
                  }}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select year/semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem
                        key={`${sem.year}-${sem.sem}`}
                        value={`${sem.year}-${sem.sem}`}
                      >
                        Year {sem.year} - {getSemesterName(sem.sem)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input
                  id="units"
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="3"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleAddCourse}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
            >
              <Plus className="h-4 w-4" /> Add to Curriculum
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Curriculum Courses */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Current Curriculum</h3>

        {localCurriculumCourses.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/20">
            <p>
              No courses added to the curriculum yet. Add courses using the form
              above.
            </p>
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={Object.keys(groupedCourses)}
            className="space-y-4"
          >
            {sortedSemesters.map((sem) => {
              const key = `${sem.year}-${sem.sem}`;
              const semesterCourses = groupedCourses[key] || [];

              if (semesterCourses.length === 0) return null;

              return (
                <AccordionItem
                  key={key}
                  value={key}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                    <h4 className="text-lg font-medium">
                      Year {sem.year} - {getSemesterName(sem.sem)}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Course Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semesterCourses.map((course) => {
                          const courseIndex = localCurriculumCourses.findIndex(
                            (c) =>
                              c.course_code === course.course_code &&
                              c.semester_year === course.semester_year &&
                              c.semester_name === course.semester_name
                          );

                          const courseDetails = localCourses.find(
                            (c) => c.code === course.course_code
                          );
                          const category = categories.find(
                            (c) => c.code === course.category_code
                          );

                          return (
                            <TableRow
                              key={`${course.course_code}-${course.semester_year}-${course.semester_name}`}
                            >
                              {editingIndex === courseIndex ? (
                                <>
                                  <TableCell>{course.course_code}</TableCell>
                                  <TableCell>
                                    {courseDetails?.descriptive_title ||
                                      "Unknown"}
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={editCategory}
                                      onValueChange={setEditCategory}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((category) => (
                                          <SelectItem
                                            key={category.code}
                                            value={category.code}
                                          >
                                            {category.name} ({category.code})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      step="0.5"
                                      min="0.5"
                                      value={editUnits}
                                      onChange={(e) =>
                                        setEditUnits(e.target.value)
                                      }
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleSaveEdit(courseIndex)
                                        }
                                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCancelEdit}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell>{course.course_code}</TableCell>
                                  <TableCell>
                                    {courseDetails?.descriptive_title ||
                                      "Unknown"}
                                  </TableCell>
                                  <TableCell>
                                    {category?.name || "Unknown"} (
                                    {course.category_code})
                                  </TableCell>
                                  <TableCell>{course.units}</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleStartEdit(courseIndex)
                                        }
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveCourse(courseIndex)
                                        }
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
