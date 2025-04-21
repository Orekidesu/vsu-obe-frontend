import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Semester {
  year: number;
  sem: string;
}

interface ProgramStructureProps {
  semesters: Semester[];
  getSemesterName: (semesterCode: string) => string;
}

export function ProgramStructure({
  semesters,
  getSemesterName,
}: ProgramStructureProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {semesters.map((sem, index) => (
            <div key={index} className="border rounded-md p-4">
              <h3 className="font-medium">Year {sem.year}</h3>
              <Badge variant="outline" className="mt-1">
                {getSemesterName(sem.sem)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
