import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurriculumStepProps {
  programAbbreviation: string;
  curriculumName: string;
  academicYear: string;
  setCurriculumName: (name: string) => void;
  setAcademicYear: (year: string) => void;
}

export function CurriculumStep({
  programAbbreviation,
  curriculumName,
  academicYear,
  setCurriculumName,
  setAcademicYear,
}: CurriculumStepProps) {
  // Use a ref to track whether we've set the curriculum name
  const hasSetCurriculumName = useRef(false);

  useEffect(() => {
    // Only set the curriculum name if:
    // 1. We have a program abbreviation
    // 2. We haven't already set the curriculum name for this component instance
    // 3. The current curriculum name is empty
    if (
      programAbbreviation &&
      !hasSetCurriculumName.current &&
      (!curriculumName || curriculumName === "")
    ) {
      setCurriculumName(programAbbreviation);
      hasSetCurriculumName.current = true;
    }
  }, [programAbbreviation, curriculumName, setCurriculumName]);

  // Helper function to validate and format academic year
  const handleAcademicYearChange = (value: string) => {
    // Allow only numbers and hyphen
    const filtered = value.replace(/[^\d-]/g, "");

    // Format as YYYY-YYYY if possible
    if (/^\d{4}-\d{0,4}$/.test(filtered)) {
      setAcademicYear(filtered);
    } else if (/^\d{0,4}$/.test(filtered)) {
      setAcademicYear(filtered);
    } else if (/^\d{0,4}-$/.test(filtered)) {
      setAcademicYear(filtered);
    }
  };

  // Generate current and next year for placeholder
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearPlaceholder = `${currentYear}-${nextYear}`;

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Curriculum Details
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="curriculumName">Curriculum Name</Label>
          <Input
            id="curriculumName"
            placeholder="Enter curriculum name"
            value={curriculumName}
            onChange={(e) => setCurriculumName(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Default is the program abbreviation, but you can modify it if
            needed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academicYear">Academic Year</Label>
          <Input
            id="academicYear"
            placeholder={yearPlaceholder}
            value={academicYear}
            onChange={(e) => handleAcademicYearChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Format: YYYY-YYYY (e.g., {yearPlaceholder})
          </p>
        </div>
      </div>
    </>
  );
}
