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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Course,
  CourseCategory,
  YearSemester,
  CurriculumCourse,
} from "@/store/wizard-store";

interface CurriculumCoursesStepProps {
  premadeCourses: Course[];
  courseCategories: CourseCategory[];
  yearSemesters: YearSemester[];
  curriculumCourses: CurriculumCourse[];
  addCourse: (code: string, title: string) => string;
  addCurriculumCourse: (
    courseId: string,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  updateCurriculumCourse: (
    id: string,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  removeCurriculumCourse: (id: string) => void;
}

export function CurriculumCoursesStep({
  premadeCourses,
  courseCategories,
  yearSemesters,
  curriculumCourses,
  addCourse,
  addCurriculumCourse,
  updateCurriculumCourse,
  removeCurriculumCourse,
}: CurriculumCoursesStepProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYearSemester, setSelectedYearSemester] = useState<string>("");
  const [units, setUnits] = useState<string>("3");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editYearSemester, setEditYearSemester] = useState("");
  const [editUnits, setEditUnits] = useState("");

  // Remove this useEffect since we're now filtering directly in the render

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

  // Handle adding a course from search
  const handleAddFromSearch = () => {
    if (!selectedCourse || !selectedCategory || !selectedYearSemester) {
      setError("Please select a course, category, and year/semester.");
      return;
    }

    const unitsValue = Number.parseFloat(units);
    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Units must be a positive number.");
      return;
    }

    // Add the course to the curriculum
    addCurriculumCourse(
      selectedCourse,
      selectedCategory,
      selectedYearSemester,
      unitsValue
    );

    // Reset form
    setSelectedCourse("");
    setSelectedCategory("");
    setSelectedYearSemester("");
    setUnits("3");
    setError("");
  };

  // Handle adding a new course
  const handleAddNewCourse = () => {
    // Validate inputs
    if (
      !newCourseCode.trim() ||
      !newCourseTitle.trim() ||
      !selectedCategory ||
      !selectedYearSemester
    ) {
      setError("All fields are required.");
      return;
    }

    const unitsValue = Number.parseFloat(units);
    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Units must be a positive number.");
      return;
    }

    // Add the new course to premade courses
    const courseId = addCourse(newCourseCode, newCourseTitle);

    // Add the course to the curriculum
    addCurriculumCourse(
      courseId,
      selectedCategory,
      selectedYearSemester,
      unitsValue
    );

    // Reset form
    setNewCourseCode("");
    setNewCourseTitle("");
    setSelectedCategory("");
    setSelectedYearSemester("");
    setUnits("3");
    setError("");
  };

  // Start editing a curriculum course
  const handleStartEdit = (course: CurriculumCourse) => {
    setEditingId(course.id);
    setEditCategory(course.categoryId);
    setEditYearSemester(course.yearSemesterId);
    setEditUnits(course.units.toString());
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCategory("");
    setEditYearSemester("");
    setEditUnits("");
  };

  // Save edited curriculum course
  const handleSaveEdit = (id: string) => {
    // Validate inputs
    if (!editCategory || !editYearSemester) {
      setError("Category and year/semester are required.");
      return;
    }

    const unitsValue = Number.parseFloat(editUnits);
    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Units must be a positive number.");
      return;
    }

    // Update the curriculum course
    updateCurriculumCourse(id, editCategory, editYearSemester, unitsValue);

    // Reset form
    setEditingId(null);
    setEditCategory("");
    setEditYearSemester("");
    setEditUnits("");
    setError("");
  };

  // Group curriculum courses by year-semester
  const groupedCourses: Record<string, CurriculumCourse[]> = {};
  yearSemesters.forEach((ys) => {
    groupedCourses[ys.id] = curriculumCourses.filter(
      (cc) => cc.yearSemesterId === ys.id
    );
  });

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Curriculum Courses
      </h2>

      <div className="space-y-8">
        {/* Add Course Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Courses to Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="search">
                  Search Existing Courses
                </TabsTrigger>
                <TabsTrigger value="new">Add New Course</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="search">
                <div className="space-y-6">
                  {/* Course Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="selectedCourse">Select Course</Label>
                    <Select
                      value={selectedCourse}
                      onValueChange={setSelectedCourse}
                    >
                      <SelectTrigger id="selectedCourse">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="py-2 px-3 border-b">
                          <Input
                            placeholder="Filter courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        {(searchTerm.trim() === ""
                          ? premadeCourses
                          : premadeCourses.filter(
                              (course) =>
                                course.code
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                course.title
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            )
                        ).map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Course Details */}
                  {selectedCourse && (
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
                            {courseCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name} ({category.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearSemester">Year and Semester</Label>
                        <Select
                          value={selectedYearSemester}
                          onValueChange={setSelectedYearSemester}
                        >
                          <SelectTrigger id="yearSemester">
                            <SelectValue placeholder="Select year/semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearSemesters.map((ys) => (
                              <SelectItem key={ys.id} value={ys.id}>
                                Year {ys.year} - {getSemesterName(ys.semester)}
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
                  )}

                  <Button
                    onClick={handleAddFromSearch}
                    disabled={
                      !selectedCourse ||
                      !selectedCategory ||
                      !selectedYearSemester
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
                  >
                    <Plus className="h-4 w-4" /> Add to Curriculum
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="new">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newCourseCode">Course Code</Label>
                      <Input
                        id="newCourseCode"
                        placeholder="e.g., CSIT 101"
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newCourseTitle">Course Title</Label>
                      <Input
                        id="newCourseTitle"
                        placeholder="e.g., Introduction to Computing"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newCourseCategory">Course Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger id="newCourseCategory">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name} ({category.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newYearSemester">Year and Semester</Label>
                      <Select
                        value={selectedYearSemester}
                        onValueChange={setSelectedYearSemester}
                      >
                        <SelectTrigger id="newYearSemester">
                          <SelectValue placeholder="Select year/semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearSemesters.map((ys) => (
                            <SelectItem key={ys.id} value={ys.id}>
                              Year {ys.year} - {getSemesterName(ys.semester)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newUnits">Units</Label>
                      <Input
                        id="newUnits"
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
                    onClick={handleAddNewCourse}
                    disabled={
                      !newCourseCode.trim() ||
                      !newCourseTitle.trim() ||
                      !selectedCategory ||
                      !selectedYearSemester
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
                  >
                    <Plus className="h-4 w-4" /> Add New Course to Curriculum
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Current Curriculum Courses */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Current Curriculum</h3>

          {curriculumCourses.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>
                No courses added to the curriculum yet. Add courses using the
                form above.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {yearSemesters.map((ys) => {
                const courses = groupedCourses[ys.id] || [];
                if (courses.length === 0) return null;

                return (
                  <div key={ys.id} className="space-y-4">
                    <h4 className="font-medium">
                      Year {ys.year} - {getSemesterName(ys.semester)}
                    </h4>
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
                        {courses.map((course) => (
                          <TableRow
                            key={`${course.id}-${course.yearSemesterId}`}
                          >
                            {editingId === course.id ? (
                              <>
                                <TableCell>{course.code}</TableCell>
                                <TableCell>{course.title}</TableCell>
                                <TableCell>
                                  <Select
                                    value={editCategory}
                                    onValueChange={setEditCategory}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {courseCategories.map((category) => (
                                        <SelectItem
                                          key={category.id}
                                          value={category.id}
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
                                      onClick={() => handleSaveEdit(course.id)}
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
                                <TableCell>{course.code}</TableCell>
                                <TableCell>{course.title}</TableCell>
                                <TableCell>
                                  {courseCategories.find(
                                    (category) =>
                                      category.id === course.categoryId
                                  )?.name || "Unknown"}{" "}
                                  (
                                  {courseCategories.find(
                                    (category) =>
                                      category.id === course.categoryId
                                  )?.code || "?"}
                                  )
                                </TableCell>
                                <TableCell>{course.units}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleStartEdit(course)}
                                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeCurriculumCourse(course.id)
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
