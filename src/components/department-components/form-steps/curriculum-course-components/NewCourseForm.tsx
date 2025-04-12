import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getSemesterName } from "@/app/utils/department/getSemesterName";
import type { CourseCategory, YearSemester } from "@/store/wizard-store";

interface NewCourseFormProps {
  courseCategories: CourseCategory[];
  yearSemesters: YearSemester[];
  handleAddNewCourse: () => void;
  newCourseCode: string;
  setNewCourseCode: (value: string) => void;
  newCourseTitle: string;
  setNewCourseTitle: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedYearSemester: string;
  setSelectedYearSemester: (value: string) => void;
  units: string;
  setUnits: (value: string) => void;
}

export function NewCourseForm({
  courseCategories,
  yearSemesters,
  handleAddNewCourse,
  newCourseCode,
  setNewCourseCode,
  newCourseTitle,
  setNewCourseTitle,
  selectedCategory,
  setSelectedCategory,
  selectedYearSemester,
  setSelectedYearSemester,
  units,
  setUnits,
}: NewCourseFormProps) {
  return (
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
  );
}
