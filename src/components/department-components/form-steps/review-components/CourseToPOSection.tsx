import { Section } from "./Section";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ProgramOutcome,
  CurriculumCourse,
  CourseToPOMapping,
  ContributionLevel,
} from "@/store/wizard-store";

interface CoursePOMappingSectionProps {
  programOutcomes: ProgramOutcome[];
  curriculumCourses: CurriculumCourse[];
  courseToPOMappings: CourseToPOMapping[];
  goToStep: (step: number) => void;
}

export function CoursePOMappingSection({
  programOutcomes,
  curriculumCourses,
  courseToPOMappings,
  goToStep,
}: CoursePOMappingSectionProps) {
  // Get contribution levels for a specific course and PO
  const getContributionLevels = (
    courseId: number,
    poId: number
  ): ContributionLevel[] => {
    const mapping = courseToPOMappings.find(
      (m) => m.courseId === courseId && m.poId === poId
    );
    return mapping ? mapping.contributionLevels : [];
  };

  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: ContributionLevel) => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800";
      case "E":
        return "bg-green-100 text-green-800";
      case "D":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Section
      id="course-po-mapping"
      title="Course to PO Mapping"
      stepNumber={13}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">I</Badge>
            <span>Introductory</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">E</Badge>
            <span>Enabling</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800">D</Badge>
            <span>Development</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">Course</TableHead>
                {programOutcomes.map((po) => (
                  <TableHead key={po.id} className="border text-center">
                    PO{po.id}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculumCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="border font-medium">
                    {course.code}
                  </TableCell>
                  {programOutcomes.map((po) => {
                    const levels = getContributionLevels(course.id, po.id);
                    return (
                      <TableCell key={po.id} className="border text-center">
                        {levels.length > 0 ? (
                          <div className="flex justify-center gap-1">
                            {levels.map((level) => (
                              <Badge
                                key={level}
                                className={getLevelBadgeColor(level)}
                              >
                                {level}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Section>
  );
}
