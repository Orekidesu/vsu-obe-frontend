import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";

interface CurriculumCourse {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
}

interface Course {
  code: string;
  descriptive_title: string;
}

interface Category {
  name: string;
  code: string;
}

interface CurriculumCoursesProps {
  curriculumCourses: CurriculumCourse[];
  courses: Course[];
  categories: Category[];
}

export function CurriculumCourses({
  curriculumCourses,
  courses,
  categories,
}: CurriculumCoursesProps) {
  // Helper function to get course details
  const getCourseDetails = (courseCode: string) => {
    return courses.find((course) => course.code === courseCode);
  };

  // Helper function to get category details
  const getCategoryDetails = (categoryCode: string) => {
    return categories.find((category) => category.code === categoryCode);
  };

  // Helper function to format semester
  const formatSemester = (year: number, sem: string) => {
    const semesterName = sem.charAt(0).toUpperCase() + sem.slice(1);
    return `Year ${year} - ${semesterName} Semester`;
  };

  // Group courses by year and semester
  const groupedCourses = curriculumCourses.reduce(
    (acc, currCourse) => {
      const key = `${currCourse.semester_year}-${currCourse.semester_name}`;
      if (!acc[key]) {
        acc[key] = {
          year: currCourse.semester_year,
          semester: currCourse.semester_name,
          courses: [],
        };
      }
      acc[key].courses.push(currCourse);
      return acc;
    },
    {} as Record<
      string,
      { year: number; semester: string; courses: CurriculumCourse[] }
    >
  );

  // Sort by year and semester
  const sortedSemesters = Object.values(groupedCourses).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    // Sort semesters: first, second, summer
    const semesterOrder = { first: 1, second: 2, summer: 3 };
    return (
      (semesterOrder[a.semester as keyof typeof semesterOrder] || 4) -
      (semesterOrder[b.semester as keyof typeof semesterOrder] || 4)
    );
  });

  // Calculate statistics
  const totalCourses = curriculumCourses.length;
  const totalUnits = curriculumCourses.reduce(
    (sum, course) => sum + course.units,
    0
  );
  const categoryCounts = curriculumCourses.reduce(
    (acc, course) => {
      acc[course.category_code] = (acc[course.category_code] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Get category color

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-prmary" />
          Curriculum Courses
        </CardTitle>
        <p className="text-sm text-gray-600">
          Complete course structure organized by academic year and semester
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-accent/10 border rounded-lg">
            <p className="text-2xl font-bold text-primary">{totalCourses}</p>
            <p className="text-sm text-primary">Total Courses</p>
          </div>
          <div className="text-center p-3 bg-accent/10 border  rounded-lg">
            <p className="text-2xl font-bold text-primary">{totalUnits}</p>
            <p className="text-sm text-primary">Total Units</p>
          </div>
          <div className="text-center p-3 bg-accent/10  border rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {sortedSemesters.length}
            </p>
            <p className="text-sm text-primary">Semesters</p>
          </div>
          <div className="text-center p-3 bg-accent/10 border  rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {Object.keys(categoryCounts).length}
            </p>
            <p className="text-sm text-primary">Categories</p>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary">
            Course Distribution by Category
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts).map(([categoryCode, count]) => {
              const category = getCategoryDetails(categoryCode);
              return (
                <Badge
                  key={categoryCode}
                  variant="default"
                  className={`px-3 py-1`}
                >
                  {category?.name || categoryCode}: {count} courses
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Courses by Semester */}
        <div className="space-y-4">
          <h4 className="font-medium text-primary-700">Course Schedule</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sortedSemesters.map((semesterGroup, index) => {
              const semesterUnits = semesterGroup.courses.reduce(
                (sum, course) => sum + course.units,
                0
              );

              return (
                <Card key={index} className="border border-primary-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-600" />
                        <h5 className="font-medium text-primary-900">
                          {formatSemester(
                            semesterGroup.year,
                            semesterGroup.semester
                          )}
                        </h5>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{semesterGroup.courses.length} courses</span>
                        <span>{semesterUnits} units</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-2">
                      {semesterGroup.courses.map((currCourse, courseIndex) => {
                        const courseDetails = getCourseDetails(
                          currCourse.course_code
                        );
                        const categoryDetails = getCategoryDetails(
                          currCourse.category_code
                        );

                        return (
                          <div
                            key={courseIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {currCourse.course_code}
                                </span>
                                <Badge variant="outline" className={`text-xs`}>
                                  {currCourse.category_code}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {courseDetails?.descriptive_title ||
                                  "Course title not available"}
                              </p>
                              {categoryDetails && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {categoryDetails.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {currCourse.units} units
                                </p>
                              </div>
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
