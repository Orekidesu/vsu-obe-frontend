import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { Course } from "@/types/model/Course";
import {
  CourseCategory,
  CourseFormErrors,
  NewCourseFormData,
  SemesterData,
} from "./types";

interface CourseSearchFormProps {
  courses: Course[] | undefined;
  isLoadingCourses: boolean;
  coursesError: unknown;
  courseCategories: CourseCategory[];
  availableSemesters: SemesterData[];
  newCourse: NewCourseFormData;
  errors: CourseFormErrors;
  setNewCourse: (course: NewCourseFormData) => void;
  handleCategoryChange: (categoryId: string) => void;
  handleAddCourseFromSearch: () => void;
}

export function CourseSearchForm({
  courses,
  isLoadingCourses,
  coursesError,
  courseCategories,
  availableSemesters,
  newCourse,
  errors,
  setNewCourse,
  handleCategoryChange,
  handleAddCourseFromSearch,
}: CourseSearchFormProps) {
  const [courseSearchQuery, setCourseSearchQuery] = useState("");

  const filteredCourses = courses?.filter((course) => {
    if (!courseSearchQuery.trim()) return true;

    const query = courseSearchQuery.toLowerCase();
    return (
      course.code.toLowerCase().includes(query) ||
      course.descriptive_title.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="course" className="text-sm font-medium block mb-2">
          Select Course
        </label>
        {isLoadingCourses ? (
          <div className="flex items-center space-x-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            <span className="text-sm text-gray-500">Loading courses...</span>
          </div>
        ) : coursesError ? (
          <div className="text-sm text-red-500 py-2">
            Failed to load courses. Please try again.
          </div>
        ) : (
          <Select
            value={newCourse.course_id}
            onValueChange={(value) =>
              setNewCourse({ ...newCourse, course_id: value })
            }
          >
            <SelectTrigger id="course" className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent side="bottom" className="max-h-[300px]">
              <div className="sticky top-0 bg-white z-20 p-2 border-b shadow-sm">
                <div className="relative">
                  <Input
                    className="py-2 px-3"
                    placeholder="Search courses..."
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                  />
                  {courseSearchQuery && (
                    <button
                      type="button"
                      className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCourseSearchQuery("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-1">
                {filteredCourses?.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No courses found
                  </div>
                ) : (
                  filteredCourses?.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.descriptive_title}
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
        )}
        {errors.course_id && (
          <p className="text-sm text-red-500 mt-1">{errors.course_id}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="text-sm font-medium block mb-2">
            Course Category
          </label>
          <Select
            value={newCourse.course_category_id}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {courseCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
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
          <label htmlFor="semester" className="text-sm font-medium block mb-2">
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
            <SelectContent side="bottom">
              {availableSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  Year {semester.year} -{" "}
                  {semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1)}{" "}
                  Semester
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester_id && (
            <p className="text-sm text-red-500 mt-1">{errors.semester_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="units" className="text-sm font-medium block mb-2">
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
            <p className="text-sm text-red-500 mt-1">{errors.unit}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleAddCourseFromSearch}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white"
        disabled={
          isLoadingCourses ||
          !newCourse.course_id ||
          !newCourse.course_category_id ||
          !newCourse.semester_id
        }
      >
        <Plus className="h-4 w-4 mr-2" /> Add to Curriculum
      </Button>
    </div>
  );
}
