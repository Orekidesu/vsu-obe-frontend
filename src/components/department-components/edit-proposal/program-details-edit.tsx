import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProgramDetailsEditProps {
  programName: string;
  programAbbreviation: string;
  updateProgramDetails: (name: string, abbreviation: string) => void;
}

export function ProgramDetailsEdit({
  programName,
  programAbbreviation,
  updateProgramDetails,
}: ProgramDetailsEditProps) {
  const [name, setName] = useState(programName);
  const [abbreviation, setAbbreviation] = useState(programAbbreviation);

  const handleSave = () => {
    updateProgramDetails(name, abbreviation);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="programName">Program Name</Label>
          <Input
            id="programName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter program name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="programAbbreviation">Program Abbreviation</Label>
          <Input
            id="programAbbreviation"
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
            placeholder="Enter abbreviation"
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Update Program Details
      </Button>
    </div>
  );
}
