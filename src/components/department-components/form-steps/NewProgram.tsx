import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgramResponse } from "@/types/model/Program";

interface NewProgramStepProps {
  programName: string;
  programAbbreviation: string;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  // activePrograms: Program[];
  departmentPrograms: ProgramResponse[];
}

export function NewProgramStep({
  programName,
  programAbbreviation,
  setProgramName,
  setProgramAbbreviation,
  // activePrograms,
  departmentPrograms,
}: NewProgramStepProps) {
  /* Active Programs */
  // const programNameExists = activePrograms.some(
  //   (program) => program.name.toLowerCase() === programName.toLowerCase()
  // );
  // const programAbbreviationExists = activePrograms.some(
  //   (program) =>
  //     program.abbreviation.toLowerCase() === programAbbreviation.toLowerCase()
  // );
  const programNameExists = departmentPrograms.some(
    (program) => program.name.toLowerCase() === programName.toLowerCase()
  );
  const programAbbreviationExists = departmentPrograms.some(
    (program) =>
      program.abbreviation.toLowerCase() === programAbbreviation.toLowerCase()
  );
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Enter program details
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="programName">Program Name</Label>
          <Input
            id="programName"
            placeholder="Enter program name"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className={programNameExists ? "border-red-500 mb-0" : ""}
          />
          {programNameExists && (
            <p className="text-sm text-red-500 ">
              A program with this name already exists.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="programAbbreviation">Program Abbreviation</Label>
          <Input
            id="programAbbreviation"
            placeholder="Enter abbreviation"
            value={programAbbreviation}
            onChange={(e) => setProgramAbbreviation(e.target.value)}
            className={programAbbreviationExists ? "border-red-500" : ""}
          />
          {programAbbreviationExists && (
            <p className="text-sm text-red-500 ">
              A program with this abbreviation already exists.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
