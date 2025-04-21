import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CurriculumDetailsEditProps {
  curriculumName: string;
  updateCurriculumDetails: (name: string) => void;
}

export function CurriculumDetailsEdit({
  curriculumName,
  updateCurriculumDetails,
}: CurriculumDetailsEditProps) {
  const [name, setName] = useState(curriculumName);

  const handleSave = () => {
    updateCurriculumDetails(name);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="curriculumName">Curriculum Name</Label>
        <Input
          id="curriculumName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter curriculum name"
        />
      </div>
      <Button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Update Curriculum Details
      </Button>
    </div>
  );
}
