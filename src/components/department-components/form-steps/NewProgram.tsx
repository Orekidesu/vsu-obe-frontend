import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewProgramStepProps {
  programName: string;
  programAbbreviation: string;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
}

export function NewProgramStep({
  programName,
  programAbbreviation,
  setProgramName,
  setProgramAbbreviation,
}: NewProgramStepProps) {
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="programAbbreviation">Program Abbreviation</Label>
          <Input
            id="programAbbreviation"
            placeholder="Enter abbreviation"
            value={programAbbreviation}
            onChange={(e) => setProgramAbbreviation(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
