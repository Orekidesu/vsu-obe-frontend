import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  CourseOutcome,
  ProgramOutcome,
} from "@/store/course/course-store";

interface POContributionRadioGroupProps {
  courseOutcome: CourseOutcome;
  programOutcome: ProgramOutcome;
  contributionLevel: "I" | "E" | "D" | null;
  onUpdatePO: (
    courseOutcomeId: number,
    programOutcomeId: number,
    contributionLevel: "I" | "E" | "D" | null
  ) => void;
}

export function POContributionRadioGroup({
  courseOutcome,
  programOutcome,
  contributionLevel,
  onUpdatePO,
}: POContributionRadioGroupProps) {
  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: "I" | "E" | "D") => {
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

  // Check if a contribution level is available for a specific PO
  const isContributionLevelAvailable = (
    programOutcome: ProgramOutcome,
    level: "I" | "E" | "D"
  ): boolean => {
    // Safety check in case availableContributionLevels is not defined
    return programOutcome.availableContributionLevels?.includes(level) ?? true;
  };

  return (
    <RadioGroup
      value={contributionLevel || ""}
      onValueChange={(value) => {
        if (value === "") {
          onUpdatePO(courseOutcome.id, programOutcome.id, null);
        } else {
          onUpdatePO(
            courseOutcome.id,
            programOutcome.id,
            value as "I" | "E" | "D"
          );
        }
      }}
      className="flex space-x-2"
    >
      <div className="flex items-center space-x-1">
        <RadioGroupItem
          value="I"
          id={`i-${courseOutcome.id}-${programOutcome.id}`}
          disabled={!isContributionLevelAvailable(programOutcome, "I")}
        />
        <Label
          htmlFor={`i-${courseOutcome.id}-${programOutcome.id}`}
          className={`flex items-center ${
            !isContributionLevelAvailable(programOutcome, "I")
              ? "opacity-50"
              : ""
          }`}
        >
          <Badge className={getLevelBadgeColor("I")}>I</Badge>
        </Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem
          value="E"
          id={`e-${courseOutcome.id}-${programOutcome.id}`}
          disabled={!isContributionLevelAvailable(programOutcome, "E")}
        />
        <Label
          htmlFor={`e-${courseOutcome.id}-${programOutcome.id}`}
          className={`flex items-center ${
            !isContributionLevelAvailable(programOutcome, "E")
              ? "opacity-50"
              : ""
          }`}
        >
          <Badge className={getLevelBadgeColor("E")}>E</Badge>
        </Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem
          value="D"
          id={`d-${courseOutcome.id}-${programOutcome.id}`}
          disabled={!isContributionLevelAvailable(programOutcome, "D")}
        />
        <Label
          htmlFor={`d-${courseOutcome.id}-${programOutcome.id}`}
          className={`flex items-center ${
            !isContributionLevelAvailable(programOutcome, "D")
              ? "opacity-50"
              : ""
          }`}
        >
          <Badge className={getLevelBadgeColor("D")}>D</Badge>
        </Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem
          value=""
          id={`none-${courseOutcome.id}-${programOutcome.id}`}
        />
        <Label
          htmlFor={`none-${courseOutcome.id}-${programOutcome.id}`}
          className="text-sm text-muted-foreground"
        >
          None
        </Label>
      </div>
    </RadioGroup>
  );
}
