import { Section } from "./Section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { YearSemester } from "@/store/wizard-store";

interface CurriculumStructureSectionProps {
  yearSemesters: YearSemester[];
  goToStep: (step: number) => void;
}

export function CurriculumStructureSection({
  yearSemesters,
  goToStep,
}: CurriculumStructureSectionProps) {
  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  return (
    <Section
      id="curriculum"
      title="Curriculum Structure"
      stepNumber={10}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <h4 className="font-medium">Year-Semester Combinations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yearSemesters.map((ys) => (
            <Card key={ys.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Year {ys.year}</span>
                  <Badge variant="outline">
                    {getSemesterName(ys.semester)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
