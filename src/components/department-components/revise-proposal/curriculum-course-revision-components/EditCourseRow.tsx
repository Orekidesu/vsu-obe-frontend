import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { Course } from "@/types/model/Course";
import { CourseCategory, EditCourseFormData, SemesterData } from "./types";

interface EditCourseRowProps {
  courseDetails: Course | undefined;
  courseCategories: CourseCategory[];
  sortedSemesters: SemesterData[];
  editCourse: EditCourseFormData;
  setEditCourse: (course: EditCourseFormData) => void;
  handleCategoryChange: (categoryId: string, isNewCourse: boolean) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
}

export function EditCourseRow({
  courseDetails,
  courseCategories,
  sortedSemesters,
  editCourse,
  setEditCourse,
  handleCategoryChange,
  handleSaveEdit,
  handleCancelEdit,
}: EditCourseRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono">{courseDetails?.code}</TableCell>
      <TableCell>{courseDetails?.descriptive_title}</TableCell>
      <TableCell>
        <Select
          value={editCourse.course_category_id.toString()}
          onValueChange={(value) => handleCategoryChange(value, false)}
        >
          <SelectTrigger>
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
      </TableCell>
      {/* Add semester selection dropdown */}
      <TableCell>
        <Select
          value={editCourse.semester_id.toString()}
          onValueChange={(value) =>
            setEditCourse({
              ...editCourse,
              semester_id: Number.parseInt(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent side="bottom">
            {sortedSemesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id.toString()}>
                Year {semester.year} -{" "}
                {semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1)}
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
    </TableRow>
  );
}
