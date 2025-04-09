import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Program } from "@/types/model/Program";

interface UpdateProgramStepProps {
  selectedProgram: string;
  setSelectedProgram: (program: string) => void;
  activePrograms: Program[];
  programsLoading: boolean;
}

export function UpdateProgramStep({
  selectedProgram,
  setSelectedProgram,
  activePrograms,
  programsLoading,
}: UpdateProgramStepProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Select a program to update
      </h2>

      <div className="space-y-6">
        {programsLoading ? (
          <div className="text-center">Loading programs...</div>
        ) : (
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {activePrograms &&
                activePrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id.toString()}>
                    {program.name} ({program.abbreviation})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </>
  );
}
