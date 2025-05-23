import { ChevronDown, ChevronRight, Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  toggleSection: () => void;
  onEditStep: () => void;
}

export function SectionHeader({
  title,
  isExpanded,
  toggleSection,
  onEditStep,
}: SectionHeaderProps) {
  return (
    <div
      className="flex items-center justify-between p-4 cursor-pointer"
      onClick={toggleSection}
    >
      <div className="flex items-center gap-2">
        <Check className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onEditStep();
          }}
        >
          <PenLine className="h-4 w-4" />
          <span>Edit</span>
        </Button>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </div>
    </div>
  );
}
