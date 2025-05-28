import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Course,
  CourseCategory,
  YearSemester,
  CurriculumCourse,
} from "@/store/wizard-store";

// Import sub-components
import { CourseSearchForm } from "@/components/department-components/form-steps/curriculum-course-components/CourseSearchForm";
import { NewCourseForm } from "@/components/department-components/form-steps/curriculum-course-components/NewCourseForm";
import { CurriculumCourseTable } from "@/components/department-components/form-steps/curriculum-course-components/CurriculumCourseTable";
import { getSemesterName } from "@/app/utils/department/getSemesterName";

interface CurriculumCoursesStepProps {
  premadeCourses: Course[];
  courseCategories: CourseCategory[];
  yearSemesters: YearSemester[];
  curriculumCourses: CurriculumCourse[];
  addCourse: (code: string, descriptive_title: string) => number;
  addCurriculumCourse: (
    courseId: number,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  updateCurriculumCourse: (
    id: number,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  removeCurriculumCourse: (id: number) => void;
  isLoading?: boolean;
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
  isLoading = false,
}: CurriculumCoursesStepProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYearSemester, setSelectedYearSemester] = useState<string>("");
  const [units, setUnits] = useState<string>("3");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editYearSemester, setEditYearSemester] = useState("");
  const [editUnits, setEditUnits] = useState("");

  // Handle adding a course from search
  // const handleAddFromSearch = () => {
  //   if (!selectedCourse || !selectedCategory || !selectedYearSemester) {
  //     setError("Please select a course, category, and year/semester.");
  //     return;
  //   }

  //   const unitsValue = Number.parseFloat(units);
  //   if (isNaN(unitsValue) || unitsValue <= 0) {
  //     setError("Units must be a positive number.");
  //     return;
  //   }

  //   // Add the course to the curriculum
  //   addCurriculumCourse(
  //     parseInt(selectedCourse, 10),
  //     selectedCategory,
  //     selectedYearSemester,
  //     unitsValue
  //   );

  //   // Reset form
  //   setSelectedCourse("");
  //   setSelectedCategory("");
  //   setSelectedYearSemester("");
  //   setUnits("3");
  //   setError("");
  // };

  // Handle adding a new course
  // const handleAddNewCourse = () => {
  //   // Validate inputs
  //   if (
  //     !newCourseCode.trim() ||
  //     !newCourseTitle.trim() ||
  //     !selectedCategory ||
  //     !selectedYearSemester
  //   ) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   const unitsValue = Number.parseFloat(units);
  //   if (isNaN(unitsValue) || unitsValue <= 0) {
  //     setError("Units must be a positive number.");
  //     return;
  //   }

  //   // Add the new course to premade courses
  //   const courseId = addCourse(newCourseCode, newCourseTitle);

  //   // Add the course to the curriculum
  //   addCurriculumCourse(
  //     courseId,
  //     selectedCategory,
  //     selectedYearSemester,
  //     unitsValue
  //   );

  //   // Reset form
  //   setNewCourseCode("");
  //   setNewCourseTitle("");
  //   setSelectedCategory("");
  //   setSelectedYearSemester("");
  //   setUnits("3");
  //   setError("");
  // };

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

    // Get the selected course
    const course = premadeCourses.find(
      (c) => c.id.toString() === selectedCourse
    );
    if (!course) {
      setError("Selected course not found.");
      return;
    }

    // Check if this course code already exists in ANY semester (not just the current one)
    const courseExists = curriculumCourses.some(
      (cc) => cc.code === course.code
    );
    if (courseExists) {
      setError(
        `Course with code "${course.code}" already exists in the curriculum.`
      );
      return;
    }

    // Add the course to the curriculum
    addCurriculumCourse(
      parseInt(selectedCourse, 10),
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

    // Check if a course with this code already exists in premade courses
    const premadeCourseExists = premadeCourses.some(
      (c) => c.code.toLowerCase() === newCourseCode.trim().toLowerCase()
    );

    // Check if this course code already exists in the curriculum
    const curriculumCourseExists = curriculumCourses.some(
      (cc) => cc.code.toLowerCase() === newCourseCode.trim().toLowerCase()
    );

    if (premadeCourseExists || curriculumCourseExists) {
      setError(`Course with code "${newCourseCode}" already exists.`);
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
  const handleSaveEdit = (id: number) => {
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
                <CourseSearchForm
                  premadeCourses={premadeCourses}
                  curriculumCourses={curriculumCourses} // Add this line
                  courseCategories={courseCategories}
                  yearSemesters={yearSemesters}
                  handleAddFromSearch={handleAddFromSearch}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedYearSemester={selectedYearSemester}
                  setSelectedYearSemester={setSelectedYearSemester}
                  units={units}
                  setUnits={setUnits}
                  isLoading={isLoading}
                  // error={error}
                  setError={setError}
                />
              </TabsContent>

              <TabsContent value="new">
                <NewCourseForm
                  courseCategories={courseCategories}
                  yearSemesters={yearSemesters}
                  premadeCourses={premadeCourses} // Add this
                  curriculumCourses={curriculumCourses} // Add this
                  handleAddNewCourse={handleAddNewCourse}
                  newCourseCode={newCourseCode}
                  setNewCourseCode={setNewCourseCode}
                  newCourseTitle={newCourseTitle}
                  setNewCourseTitle={setNewCourseTitle}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedYearSemester={selectedYearSemester}
                  setSelectedYearSemester={setSelectedYearSemester}
                  units={units}
                  setUnits={setUnits}
                  setError={setError}
                />
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
                    <CurriculumCourseTable
                      courses={courses}
                      courseCategories={courseCategories}
                      handleStartEdit={handleStartEdit}
                      handleSaveEdit={handleSaveEdit}
                      handleCancelEdit={handleCancelEdit}
                      removeCurriculumCourse={removeCurriculumCourse}
                      editingId={editingId}
                      editCategory={editCategory}
                      setEditCategory={setEditCategory}
                      editUnits={editUnits}
                      setEditUnits={setEditUnits}
                    />
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
