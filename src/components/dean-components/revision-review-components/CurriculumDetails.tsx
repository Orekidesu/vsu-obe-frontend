import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface Curriculum {
  name: string;
}

interface Course {
  code: string;
  descriptive_title: string;
}

interface CurriculumDetailsProps {
  curriculum: Curriculum;
  courses: Course[];
}

export function CurriculumDetails({
  curriculum,
  courses,
}: CurriculumDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-600" />
          Curriculum Details
        </CardTitle>
        <p className="text-sm text-gray-600">
          Overview of the curriculum structure and course offerings
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Curriculum Name
          </label>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-900 font-medium">{curriculum.name}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Sample Courses
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {courses.slice(0, 5).map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{course.code}</p>
                  <p className="text-sm text-gray-600">
                    {course.descriptive_title}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-orange-700 border-orange-200"
                >
                  {course.code.split(" ")[0]}
                </Badge>
              </div>
            ))}
            {courses.length > 5 && (
              <div className="text-center py-2">
                <Badge variant="secondary">
                  +{courses.length - 5} more courses
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
