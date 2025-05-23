import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CourseCategory, NewManualCourseFormData, SemesterData } from "./types";

interface NewCourseFormProps {
  courseCategories: CourseCategory[];
  sortedSemesters: SemesterData[];
  newManualCourse: NewManualCourseFormData;
  setNewManualCourse: (course: NewManualCourseFormData) => void;
  handleCategoryChange: (categoryId: string) => void;
  handleAddManualCourse: () => void;
}

export function NewCourseForm({
  courseCategories,
  sortedSemesters,
  newManualCourse,
  setNewManualCourse,
  handleCategoryChange,
  handleAddManualCourse,
}: NewCourseFormProps) {
  return (
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
            value={newManualCourse.descriptive_title}
            onChange={(e) =>
              setNewManualCourse({
                ...newManualCourse,
                descriptive_title: e.target.value,
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
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="newCategory">
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
            <SelectContent side="bottom">
              {sortedSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  Year {semester.year} -{" "}
                  {semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1)}{" "}
                  Semester
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="newUnits" className="text-sm font-medium block mb-2">
            Units
          </label>
          <Input
            id="newUnits"
            type="number"
            step="0.5"
            min="0.5"
            value={newManualCourse.unit}
            onChange={(e) => {
              const value = e.target.value;
              // Format the value to always show 2 decimal places
              const formattedValue =
                value && !isNaN(parseFloat(value))
                  ? parseFloat(value).toFixed(2)
                  : value;

              setNewManualCourse({
                ...newManualCourse,
                unit: formattedValue,
              });
            }}
            placeholder="e.g., 3.0"
          />
        </div>
      </div>

      <Button
        onClick={handleAddManualCourse}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white"
        disabled={
          !newManualCourse.code.trim() ||
          !newManualCourse.descriptive_title.trim() ||
          !newManualCourse.course_category_id ||
          !newManualCourse.semester_id
        }
      >
        <Plus className="h-4 w-4 mr-2" /> Add New Course to Curriculum
      </Button>
    </div>
  );
}
