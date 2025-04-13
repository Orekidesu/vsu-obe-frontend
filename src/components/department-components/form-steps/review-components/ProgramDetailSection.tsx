import { Section } from "./Section";

interface ProgramDetailsSectionProps {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  curriculumName: string;
  academicYear: string;
  goToStep: (step: number) => void;
}

export function ProgramDetailsSection({
  formType,
  programName,
  programAbbreviation,
  selectedProgram,
  curriculumName,
  academicYear,
  goToStep,
}: ProgramDetailsSectionProps) {
  return (
    <Section
      id="program-details"
      title="Program Details"
      stepNumber={2}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-muted-foreground">Form Type</h4>
            <p className="text-lg">
              {formType === "new"
                ? "Create New Program"
                : "Update Existing Program"}
            </p>
          </div>

          {formType === "new" ? (
            <>
              <div>
                <h4 className="font-medium text-muted-foreground">
                  Program Name
                </h4>
                <p className="text-lg">{programName}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">
                  Program Abbreviation
                </h4>
                <p className="text-lg">{programAbbreviation}</p>
              </div>
            </>
          ) : (
            <div>
              <h4 className="font-medium text-muted-foreground">
                Selected Program
              </h4>
              <p className="text-lg">{selectedProgram}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-muted-foreground">
              Curriculum Name
            </h4>
            <p className="text-lg">{curriculumName}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Academic Year</h4>
            <p className="text-lg">{academicYear}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
