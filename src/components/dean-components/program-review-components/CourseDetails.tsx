import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseDetailsProps {
  course: {
    id: number;
    code: string;
    descriptive_title: string;
  };
  course_category: {
    id: number;
    name: string;
    code: string;
    description?: string;
  };
  semester: {
    id: number;
    year: number;
    sem: number | string;
    description?: string;
  };
  units: string;
}

export function CourseDetails({
  course,
  course_category,
  semester,
  units,
}: CourseDetailsProps) {
  if (!course || !course_category || !semester) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Course details not available</p>
      </div>
    );
  }

  // Format semester description if not provided
  const semesterDescription =
    semester.description ||
    `Year ${semester.year} - ${
      typeof semester.sem === "string"
        ? semester.sem.charAt(0).toUpperCase() + semester.sem.slice(1)
        : semester.sem === 1
          ? "First"
          : semester.sem === 2
            ? "Second"
            : "Midyear"
    } Semester`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Course Code
              </h4>
              <p className="font-medium">{course.code}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Course Title
              </h4>
              <p className="font-medium">{course.descriptive_title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Category
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{course_category.code}</Badge>
                <span>{course_category.name}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Semester
              </h4>
              <p className="font-medium">{semesterDescription}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Units
              </h4>
              <p className="font-medium">{units}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Category Name
              </h4>
              <p className="font-medium">{course_category.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Category Code
              </h4>
              <Badge>{course_category.code}</Badge>
            </div>
            {course_category.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Category Description
                </h4>
                <p>{course_category.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
