"use client";

import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Info,
  Check,
  X,
} from "lucide-react";
import {
  sampleSemesters,
  sampleCourses,
} from "@/store/revision/sample-data/data";

export function CurriculumCoursesRevision() {
  // Get curriculum courses and related functions from the store
  const curriculumCourses = useRevisionStore(
    (state) => state.curriculum_courses
  );
  const courseCategories = useRevisionStore((state) => state.course_categories);
  const isModified = useRevisionStore((state) =>
    state.isModified("curriculum_courses")
  );
  const resetSection = useRevisionStore((state) => state.resetSection);
  const addCurriculumCourse = useRevisionStore(
    (state) => state.addCurriculumCourse
  );
  const updateCurriculumCourse = useRevisionStore(
    (state) => state.updateCurriculumCourse
  );
  const removeCurriculumCourse = useRevisionStore(
    (state) => state.removeCurriculumCourse
  );

  // Local state for the form
  const [activeTab, setActiveTab] = useState("search");
  const [isEditingCourse, setIsEditingCourse] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    course_id: "",
    course_category_id: "",
    semester_id: "",
    unit: "",
  });

  // New course form state
  const [newCourse, setNewCourse] = useState({
    course_id: "",
    course_category_id: "",
    category_code: "",
    semester_id: "",
    unit: "3",
  });

  // New course manual entry state
  const [newManualCourse, setNewManualCourse] = useState({
    code: "",
    title: "",
    course_category_id: "",
    category_code: "",
    semester_id: "",
    unit: "3",
  });

  // Editing course state
  const [editCourse, setEditCourse] = useState({
    id: 0,
    course_id: 0,
    course_category_id: 0,
    category_code: "",
    semester_id: 0,
    unit: "",
  });

  // Get course details by ID
  const getCourseDetails = (courseId: number) => {
    return sampleCourses.find((course) => course.id === courseId);
  };

  // Get category details by ID
  const getCategoryDetails = (categoryId: number) => {
    return courseCategories.find((category) => category.id === categoryId);
  };

  // Update category code when category is selected
  const handleCategoryChange = (categoryId: string, isNewCourse = true) => {
    const category = courseCategories.find(
      (cat) => cat.id === Number.parseInt(categoryId)
    );
    if (category) {
      if (isNewCourse) {
        if (activeTab === "search") {
          setNewCourse({
            ...newCourse,
            course_category_id: categoryId,
            category_code: category.code,
          });
        } else {
          setNewManualCourse({
            ...newManualCourse,
            course_category_id: categoryId,
            category_code: category.code,
          });
        }
      } else {
        setEditCourse({
          ...editCourse,
          course_category_id: Number.parseInt(categoryId),
          category_code: category.code,
        });
      }
    }
  };

  // Handle adding a new course from search
  const handleAddCourseFromSearch = () => {
    // Validate inputs
    const newErrors = {
      course_id: "",
      course_category_id: "",
      semester_id: "",
      unit: "",
    };
    let isValid = true;

    if (!newCourse.course_id) {
      newErrors.course_id = "Course is required";
      isValid = false;
    }

    if (!newCourse.course_category_id) {
      newErrors.course_category_id = "Category is required";
      isValid = false;
    }

    if (!newCourse.semester_id) {
      newErrors.semester_id = "Semester is required";
      isValid = false;
    }

    if (!newCourse.unit) {
      newErrors.unit = "Units are required";
      isValid = false;
    } else if (
      isNaN(Number.parseFloat(newCourse.unit)) ||
      Number.parseFloat(newCourse.unit) <= 0
    ) {
      newErrors.unit = "Units must be a positive number";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      addCurriculumCourse({
        course_id: Number.parseInt(newCourse.course_id),
        course_category_id: Number.parseInt(newCourse.course_category_id),
        category_code: newCourse.category_code,
        semester_id: Number.parseInt(newCourse.semester_id),
        unit: newCourse.unit,
      });
      setNewCourse({
        course_id: "",
        course_category_id: "",
        category_code: "",
        semester_id: "",
        unit: "3",
      });
    }
  };

  // Handle adding a new manual course
  const handleAddManualCourse = () => {
    // Validate inputs
    const newErrors = {
      course_id: "",
      course_category_id: "",
      semester_id: "",
      unit: "",
    };
    let isValid = true;

    if (!newManualCourse.code.trim()) {
      newErrors.course_id = "Course code is required";
      isValid = false;
    }

    if (!newManualCourse.title.trim()) {
      newErrors.course_id = "Course title is required";
      isValid = false;
    }

    if (!newManualCourse.course_category_id) {
      newErrors.course_category_id = "Category is required";
      isValid = false;
    }

    if (!newManualCourse.semester_id) {
      newErrors.semester_id = "Semester is required";
      isValid = false;
    }

    if (!newManualCourse.unit) {
      newErrors.unit = "Units are required";
      isValid = false;
    } else if (
      isNaN(Number.parseFloat(newManualCourse.unit)) ||
      Number.parseFloat(newManualCourse.unit) <= 0
    ) {
      newErrors.unit = "Units must be a positive number";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // In a real app, we would first create the course and then add it to the curriculum
      // For now, we'll simulate this by using a high ID number
      const newCourseId = Math.max(...sampleCourses.map((c) => c.id)) + 1;

      addCurriculumCourse({
        course_id: newCourseId,
        course_category_id: Number.parseInt(newManualCourse.course_category_id),
        category_code: newManualCourse.category_code,
        semester_id: Number.parseInt(newManualCourse.semester_id),
        unit: newManualCourse.unit,
      });

      setNewManualCourse({
        code: "",
        title: "",
        course_category_id: "",
        category_code: "",
        semester_id: "",
        unit: "3",
      });
    }
  };

  // Start editing a course
  const handleStartEdit = (courseId: number) => {
    const course = curriculumCourses.find((c) => c.id === courseId);
    if (course) {
      setEditCourse({
        id: course.id,
        course_id: course.course_id,
        course_category_id: course.course_category_id,
        category_code: course.category_code,
        semester_id: course.semester_id,
        unit: course.unit,
      });
      setIsEditingCourse(courseId);
    }
  };

  // Save edited course
  const handleSaveEdit = () => {
    updateCurriculumCourse(editCourse.id, {
      course_id: editCourse.course_id,
      course_category_id: editCourse.course_category_id,
      category_code: editCourse.category_code,
      semester_id: editCourse.semester_id,
      unit: editCourse.unit,
    });
    setIsEditingCourse(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditingCourse(null);
  };

  // Handle deleting a course
  const handleDeleteCourse = () => {
    if (courseToDelete !== null) {
      removeCurriculumCourse(courseToDelete);
      setCourseToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle resetting the section
  const handleReset = () => {
    resetSection("curriculum_courses");
    setIsResetDialogOpen(false);
  };

  // Group courses by semester for display
  const coursesBySemester = curriculumCourses.reduce(
    (acc, course) => {
      const semesterId = course.semester_id;
      if (!acc[semesterId]) {
        acc[semesterId] = [];
      }
      acc[semesterId].push(course);
      return acc;
    },
    {} as Record<number, typeof curriculumCourses>
  );

  // Sort semesters by year and semester
  const sortedSemesters = [...sampleSemesters].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }

    const semOrder = { first: 1, second: 2, summer: 3 };
    return (
      semOrder[a.sem as keyof typeof semOrder] -
      semOrder[b.sem as keyof typeof semOrder]
    );
  });

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Curriculum Courses</CardTitle>
          {isModified && <Badge className="bg-green-500">Modified</Badge>}
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={!isModified}
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
            </Button>
          </div>

          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Manage the courses in your curriculum. You can add, edit, or
              remove courses, and assign them to different semesters and
              categories.
            </AlertDescription>
          </Alert>

          {/* Add Courses Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Courses to Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="search"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="search">
                    Search Existing Courses
                  </TabsTrigger>
                  <TabsTrigger value="new">Add New Course</TabsTrigger>
                </TabsList>

                <TabsContent value="search">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="course"
                        className="text-sm font-medium block mb-2"
                      >
                        Select Course
                      </label>
                      <Select
                        value={newCourse.course_id}
                        onValueChange={(value) =>
                          setNewCourse({ ...newCourse, course_id: value })
                        }
                      >
                        <SelectTrigger id="course" className="w-full">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleCourses.map((course) => (
                            <SelectItem
                              key={course.id}
                              value={course.id.toString()}
                            >
                              {course.code} - {course.descriptive_title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.course_id && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.course_id}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="category"
                          className="text-sm font-medium block mb-2"
                        >
                          Course Category
                        </label>
                        <Select
                          value={newCourse.course_category_id}
                          onValueChange={(value) => handleCategoryChange(value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name} ({category.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.course_category_id && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.course_category_id}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="semester"
                          className="text-sm font-medium block mb-2"
                        >
                          Year and Semester
                        </label>
                        <Select
                          value={newCourse.semester_id}
                          onValueChange={(value) =>
                            setNewCourse({ ...newCourse, semester_id: value })
                          }
                        >
                          <SelectTrigger id="semester">
                            <SelectValue placeholder="Select year/semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortedSemesters.map((semester) => (
                              <SelectItem
                                key={semester.id}
                                value={semester.id.toString()}
                              >
                                Year {semester.year} -{" "}
                                {semester.sem.charAt(0).toUpperCase() +
                                  semester.sem.slice(1)}{" "}
                                Semester
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.semester_id && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.semester_id}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="units"
                          className="text-sm font-medium block mb-2"
                        >
                          Units
                        </label>
                        <Input
                          id="units"
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={newCourse.unit}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, unit: e.target.value })
                          }
                          placeholder="e.g., 3.0"
                        />
                        {errors.unit && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.unit}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddCourseFromSearch}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                      disabled={
                        !newCourse.course_id ||
                        !newCourse.course_category_id ||
                        !newCourse.semester_id
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add to Curriculum
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="new">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="courseCode"
                          className="text-sm font-medium block mb-2"
                        >
                          Course Code
                        </label>
                        <Input
                          id="courseCode"
                          value={newManualCourse.code}
                          onChange={(e) =>
                            setNewManualCourse({
                              ...newManualCourse,
                              code: e.target.value,
                            })
                          }
                          placeholder="e.g., CSIT 101"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="courseTitle"
                          className="text-sm font-medium block mb-2"
                        >
                          Course Title
                        </label>
                        <Input
                          id="courseTitle"
                          value={newManualCourse.title}
                          onChange={(e) =>
                            setNewManualCourse({
                              ...newManualCourse,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g., Introduction to Computing"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="newCategory"
                          className="text-sm font-medium block mb-2"
                        >
                          Course Category
                        </label>
                        <Select
                          value={newManualCourse.course_category_id}
                          onValueChange={(value) => handleCategoryChange(value)}
                        >
                          <SelectTrigger id="newCategory">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name} ({category.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="newSemester"
                          className="text-sm font-medium block mb-2"
                        >
                          Year and Semester
                        </label>
                        <Select
                          value={newManualCourse.semester_id}
                          onValueChange={(value) =>
                            setNewManualCourse({
                              ...newManualCourse,
                              semester_id: value,
                            })
                          }
                        >
                          <SelectTrigger id="newSemester">
                            <SelectValue placeholder="Select year/semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortedSemesters.map((semester) => (
                              <SelectItem
                                key={semester.id}
                                value={semester.id.toString()}
                              >
                                Year {semester.year} -{" "}
                                {semester.sem.charAt(0).toUpperCase() +
                                  semester.sem.slice(1)}{" "}
                                Semester
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="newUnits"
                          className="text-sm font-medium block mb-2"
                        >
                          Units
                        </label>
                        <Input
                          id="newUnits"
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={newManualCourse.unit}
                          onChange={(e) =>
                            setNewManualCourse({
                              ...newManualCourse,
                              unit: e.target.value,
                            })
                          }
                          placeholder="e.g., 3.0"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleAddManualCourse}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                      disabled={
                        !newManualCourse.code.trim() ||
                        !newManualCourse.title.trim() ||
                        !newManualCourse.course_category_id ||
                        !newManualCourse.semester_id
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Course to
                      Curriculum
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Current Curriculum */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Current Curriculum</h2>

            {sortedSemesters.map((semester) => {
              const courses = coursesBySemester[semester.id] || [];
              if (courses.length === 0) return null;

              return (
                <div key={semester.id} className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Year {semester.year} -{" "}
                    {semester.sem.charAt(0).toUpperCase() +
                      semester.sem.slice(1)}{" "}
                    Semester
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Course Code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead className="w-[200px]">Category</TableHead>
                        <TableHead className="w-[80px]">Units</TableHead>
                        <TableHead className="w-[120px] text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => {
                        const courseDetails = getCourseDetails(
                          course.course_id
                        );
                        const categoryDetails = getCategoryDetails(
                          course.course_category_id
                        );

                        return (
                          <TableRow key={course.id}>
                            {isEditingCourse === course.id ? (
                              // Editing mode
                              <>
                                <TableCell className="font-mono">
                                  {courseDetails?.code}
                                </TableCell>
                                <TableCell>
                                  {courseDetails?.descriptive_title}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={editCourse.course_category_id.toString()}
                                    onValueChange={(value) =>
                                      handleCategoryChange(value, false)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {courseCategories.map((category) => (
                                        <SelectItem
                                          key={category.id}
                                          value={category.id.toString()}
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
                                    value={editCourse.unit}
                                    onChange={(e) =>
                                      setEditCourse({
                                        ...editCourse,
                                        unit: e.target.value,
                                      })
                                    }
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handleSaveEdit}
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <Check className="h-5 w-5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={handleCancelEdit}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </>
                            ) : (
                              // Display mode
                              <>
                                <TableCell className="font-mono">
                                  {courseDetails?.code}
                                </TableCell>
                                <TableCell>
                                  {courseDetails?.descriptive_title}
                                </TableCell>
                                <TableCell>
                                  {categoryDetails?.name} (
                                  {categoryDetails?.code})
                                </TableCell>
                                <TableCell>{course.unit}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleStartEdit(course.id)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setCourseToDelete(course.id);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      className="text-red-500 hover:text-red-700"
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
                </div>
              );
            })}

            {Object.keys(coursesBySemester).length === 0 && (
              <div className="text-center p-6 border rounded-md bg-muted/20">
                <p>
                  No courses added to the curriculum yet. Use the form above to
                  add courses.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this course from the curriculum?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Warning: Deleting a course will also remove any mappings to
                Program Outcomes.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all changes made to the curriculum
              courses? This will revert to the original data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
