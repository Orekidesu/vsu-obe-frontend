import { useState } from "react";
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
import type {
  Course,
  CourseCategory,
  YearSemester,
} from "@/store/wizard-store";

interface CourseSearchFormProps {
  premadeCourses: Course[];
  courseCategories: CourseCategory[];
  yearSemesters: YearSemester[];
  handleAddFromSearch: () => void;
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedYearSemester: string;
  setSelectedYearSemester: (value: string) => void;
  units: string;
  setUnits: (value: string) => void;
  isLoading?: boolean;
}

export function CourseSearchForm({
  premadeCourses,
  courseCategories,
  yearSemesters,
  handleAddFromSearch,
  selectedCourse,
  setSelectedCourse,
  selectedCategory,
  setSelectedCategory,
  selectedYearSemester,
  setSelectedYearSemester,
  units,
  setUnits,
  isLoading = false,
}: CourseSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="selectedCourse">Select Course</Label>
        {isLoading ? (
          <div className="flex items-center justify-center p-2 border rounded-md border-input bg-background text-muted-foreground">
            <div className="animate-pulse flex space-x-2 items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-2">Loading courses...</span>
          </div>
        ) : (
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
              {premadeCourses.length === 0 ? (
                <SelectItem value="" disabled>
                  No courses available
                </SelectItem>
              ) : (
                (searchTerm.trim() === ""
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
                )
                  .filter((course) => course.id !== undefined)
                  .map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        )}
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
                  <SelectItem key={category.id} value={category.id.toString()}>
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
          !selectedYearSemester ||
          isLoading
        }
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
      >
        <Plus className="h-4 w-4" /> Add to Curriculum
      </Button>
    </div>
  );
}
