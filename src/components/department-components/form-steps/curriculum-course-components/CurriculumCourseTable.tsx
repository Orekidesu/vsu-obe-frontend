import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { CourseCategory, CurriculumCourse } from "@/store/wizard-store";

interface CurriculumCourseTableProps {
  courses: CurriculumCourse[];
  courseCategories: CourseCategory[];
  handleStartEdit: (course: CurriculumCourse) => void;
  handleSaveEdit: (id: number) => void;
  handleCancelEdit: () => void;
  removeCurriculumCourse: (id: number) => void;
  editingId: number | null;
  editCategory: string;
  setEditCategory: (value: string) => void;
  editUnits: string;
  setEditUnits: (value: string) => void;
}

export function CurriculumCourseTable({
  courses,
  courseCategories,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  removeCurriculumCourse,
  editingId,
  editCategory,
  setEditCategory,
  editUnits,
  setEditUnits,
}: CurriculumCourseTableProps) {
  return (
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
          <TableRow key={`${course.id}-${course.yearSemesterId}`}>
            {editingId === course.id ? (
              <>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>
                  <Select value={editCategory} onValueChange={setEditCategory}>
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
                    value={editUnits}
                    onChange={(e) => setEditUnits(e.target.value)}
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
                    (category) => category.id.toString() === course.categoryId
                  )?.name || "Unknown"}{" "}
                  (
                  {courseCategories.find(
                    (category) => category.id.toString() === course.categoryId
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
                      onClick={() => removeCurriculumCourse(course.id)}
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
  );
}
