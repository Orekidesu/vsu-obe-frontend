import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/model/Course";
import { CourseCategory, CurriculumCourse } from "./types";

interface CourseTableRowProps {
  course: CurriculumCourse;
  courseDetails: Course | undefined;
  categoryDetails: CourseCategory | undefined;
  handleStartEdit: (id: number) => void;
  handleDeleteCourse: (id: number) => void;
}

export function CourseTableRow({
  course,
  courseDetails,
  categoryDetails,
  handleStartEdit,
  handleDeleteCourse,
}: CourseTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono">
        {courseDetails?.code || course.course_code}
      </TableCell>
      <TableCell>
        {courseDetails?.descriptive_title || course.course_title}
      </TableCell>
      <TableCell>
        {categoryDetails?.name} ({categoryDetails?.code})
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
            onClick={() => handleDeleteCourse(course.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
