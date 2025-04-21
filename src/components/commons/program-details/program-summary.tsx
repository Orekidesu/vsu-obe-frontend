import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgramSummaryProps {
  programName: string;
  programAbbreviation: string;
  curriculumName: string;
  totalCourses: number;
}

export function ProgramSummary({
  programName,
  programAbbreviation,
  curriculumName,
  totalCourses,
}: ProgramSummaryProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          {programName} ({programAbbreviation})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Program Name</h3>
            <p className="text-lg">{programName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Abbreviation</h3>
            <p className="text-lg">{programAbbreviation}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Curriculum Name
            </h3>
            <p className="text-lg">{curriculumName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
            <p className="text-lg">{totalCourses}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
