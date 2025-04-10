import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ProgramOutcome } from "@/types/model/ProgramOutcome";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";

interface POToGAMapping {
  poId: number;
  gaId: number;
}

interface POToGAMappingStepProps {
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];
  poToGAMappings: POToGAMapping[];
  togglePOToGAMapping: (poId: number, gaId: number) => void;
  isLoading?: boolean;
}

export function POToGAMappingStep({
  programOutcomes,
  graduateAttributes,
  poToGAMappings,
  togglePOToGAMapping,
  isLoading = false,
}: POToGAMappingStepProps) {
  // Helper function to check if a PO to GA mapping exists
  const isPOToGAMapped = (poId: number, gaId: number) => {
    return poToGAMappings.some((m) => m.poId === poId && m.gaId === gaId);
  };

  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Program Outcomes to Graduate Attributes Mapping
      </h2>

      <TooltipProvider>
        <div className="mb-4 flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="mr-1 h-4 w-4" />
                <span>
                  Check boxes to map Program Outcomes to Graduate Attributes
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Each Program Outcome should map to at least one Graduate
                Attribute
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] border">POs</TableHead>
              <TableHead className="w-[150px] border">Name</TableHead>
              <TableHead className="w-[250px] border">
                PROGRAM OUTCOMES STATEMENTS
              </TableHead>
              {graduateAttributes.map((ga) => (
                <TableHead key={ga.id} className="text-center border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-semibold">{ga.id}</div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{ga.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium border">PO{po.id}</TableCell>
                <TableCell className="border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateText(po.name)}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{po.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateText(po.statement)}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{po.statement}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {graduateAttributes.map((ga) => (
                  <TableCell key={ga.id} className="text-center border">
                    <Checkbox
                      checked={isPOToGAMapped(po.id, ga.id)}
                      onCheckedChange={() => togglePOToGAMapping(po.id, ga.id)}
                      className="mx-auto"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Hover over GA IDs, PO names, or PO statements to view full text</p>
      </div>
    </>
  );
}
