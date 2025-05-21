"use client";

import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, RotateCcw } from "lucide-react";
import { sampleSemesters } from "@/store/revision/sample-data/data";

import useCourses from "@/hooks/department/useCourse";
import { Course } from "@/types/model/Course";

// Import the subcomponents
import { CourseSearchForm } from "./curriculum-course-revision-components/CourseSearchForm";
import { NewCourseForm } from "./curriculum-course-revision-components/NewCourseForm";
import { CurriculumTable } from "./curriculum-course-revision-components/CurriculumTable";
import { ConfirmationDialogs } from "./curriculum-course-revision-components/ConfirmationDialogs";
import {
  CourseFormErrors,
  EditCourseFormData,
  NewCourseFormData,
  NewManualCourseFormData,
} from "./curriculum-course-revision-components/types";

export function CurriculumCoursesRevision() {
  // Get curriculum courses and related functions from the store
  const {
    courses,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useCourses();

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
  const [errors, setErrors] = useState<CourseFormErrors>({
    course_id: "",
    course_category_id: "",
    semester_id: "",
    unit: "",
  });

  // New course form state
  const [newCourse, setNewCourse] = useState<NewCourseFormData>({
    course_id: "",
    course_category_id: "",
    category_code: "",
    semester_id: "",
    unit: "3",
  });

  // New course manual entry state
  const [newManualCourse, setNewManualCourse] =
    useState<NewManualCourseFormData>({
      code: "",
      descriptive_title: "",
      course_category_id: "",
      category_code: "",
      semester_id: "",
      unit: "3",
    });

  // Editing course state
  const [editCourse, setEditCourse] = useState<EditCourseFormData>({
    id: 0,
    course_id: 0,
    course_category_id: 0,
    category_code: "",
    semester_id: 0,
    unit: "",
  });

  // Get course details by ID
  const getCourseDetails = (courseId: number): Course | undefined => {
    // Use API courses instead of sample data
    return courses?.find((course) => course.id === courseId);
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
  const handleAddManualCourse = async () => {
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

    if (!newManualCourse.descriptive_title.trim()) {
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
      // In a real app, we would create a new course, but for now we'll just use a high ID
      const newCourseId =
        courses && courses.length > 0
          ? Math.max(...courses.map((c) => c.id)) + 1
          : 1000;

      addCurriculumCourse({
        course_id: newCourseId,
        course_category_id: Number.parseInt(newManualCourse.course_category_id),
        category_code: newManualCourse.category_code,
        semester_id: Number.parseInt(newManualCourse.semester_id),
        unit: newManualCourse.unit,
        course_code: newManualCourse.code,
        course_title: newManualCourse.descriptive_title,
      });

      setNewManualCourse({
        code: "",
        descriptive_title: "",
        course_category_id: "",
        category_code: "",
        semester_id: "",
        unit: "3",
      });
    }
  };

  const getAvailableSemesters = () => {
    // Get unique semester IDs from the curriculum courses
    const semesterIds = [
      ...new Set(curriculumCourses.map((course) => course.semester_id)),
    ];

    // Filter sampleSemesters to only include those found in curriculum courses
    const availableSemesters = sampleSemesters.filter((semester) =>
      semesterIds.includes(semester.id)
    );

    // Sort semesters by year and term
    return [...availableSemesters].sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      const semOrder = { first: 1, second: 2, summer: 3 };
      return (
        semOrder[a.sem as keyof typeof semOrder] -
        semOrder[b.sem as keyof typeof semOrder]
      );
    });
  };

  const availableSemesters = getAvailableSemesters();

  // Add this helper function to get semester details
  const getSemesterDetails = (semesterId: number) => {
    return sampleSemesters.find((semester) => semester.id === semesterId);
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

  // Handle preparing to delete a course
  const handlePrepareDeleteCourse = (courseId: number) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
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
                  <CourseSearchForm
                    courses={courses}
                    isLoadingCourses={isLoadingCourses}
                    coursesError={coursesError}
                    courseCategories={courseCategories}
                    availableSemesters={availableSemesters}
                    newCourse={newCourse}
                    errors={errors}
                    setNewCourse={setNewCourse}
                    handleCategoryChange={(categoryId) =>
                      handleCategoryChange(categoryId)
                    }
                    handleAddCourseFromSearch={handleAddCourseFromSearch}
                  />
                </TabsContent>

                <TabsContent value="new">
                  <NewCourseForm
                    courseCategories={courseCategories}
                    sortedSemesters={sortedSemesters}
                    newManualCourse={newManualCourse}
                    setNewManualCourse={setNewManualCourse}
                    handleCategoryChange={(categoryId) =>
                      handleCategoryChange(categoryId)
                    }
                    handleAddManualCourse={handleAddManualCourse}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Current Curriculum */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Current Curriculum</h2>
            <CurriculumTable
              availableSemesters={availableSemesters}
              sortedSemesters={sortedSemesters}
              coursesBySemester={coursesBySemester}
              isEditingCourse={isEditingCourse}
              editCourse={editCourse}
              setEditCourse={setEditCourse}
              courseCategories={courseCategories}
              getCourseDetails={getCourseDetails}
              getCategoryDetails={getCategoryDetails}
              getSemesterDetails={getSemesterDetails}
              handleCategoryChange={handleCategoryChange}
              handleStartEdit={handleStartEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleDeleteCourse={handlePrepareDeleteCourse}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialogs
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isResetDialogOpen={isResetDialogOpen}
        setIsResetDialogOpen={setIsResetDialogOpen}
        handleDeleteCourse={handleDeleteCourse}
        handleReset={handleReset}
      />
    </div>
  );
}
