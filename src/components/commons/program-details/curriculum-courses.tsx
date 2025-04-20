import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  code: string;
  descriptive_title: string;
}

interface CourseCategory {
  name: string;
  code: string;
}

interface CurriculumCourse extends Course {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
}

interface GroupedCourses {
  [key: string]: CurriculumCourse[];
}

interface CurriculumCoursesProps {
  groupedCourses: GroupedCourses;
  courses?: Course[];
  categories: CourseCategory[];
  getSemesterName: (semesterCode: string) => string;
}

export function CurriculumCourses({
  groupedCourses,
  // courses,
  categories,
  getSemesterName,
}: CurriculumCoursesProps) {
  return (
    <Accordion
      type="multiple"
      value={Object.keys(groupedCourses)}
      onValueChange={() => {}}
      className="space-y-4"
    >
      {Object.entries(groupedCourses).map(([key, courses]) => {
        const [year, sem] = key.split("-");
        return (
          <AccordionItem
            key={key}
            value={key}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium">
                  Year {year} - {getSemesterName(sem)}
                </h3>
                <Badge className="ml-2">{courses.length} courses</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course, index) => {
                    const courseDetails = courses.find(
                      (c) => c.code === course.course_code
                    );
                    const category = categories.find(
                      (c) => c.code === course.category_code
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {course.course_code}
                        </TableCell>
                        <TableCell>
                          {courseDetails?.descriptive_title || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category?.name || course.category_code}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.units}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
