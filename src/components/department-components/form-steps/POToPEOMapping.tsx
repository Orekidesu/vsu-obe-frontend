"use client";

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
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
}

interface POToPEOMapping {
  poId: number;
  peoId: number;
}

interface POToPEOMappingStepProps {
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  poToPEOMappings: POToPEOMapping[];
  togglePOToPEOMapping: (poId: number, peoId: number) => void;
  isLoading?: boolean;
}

export function POToPEOMappingStep({
  peos,
  programOutcomes,
  poToPEOMappings,
  togglePOToPEOMapping,
  isLoading = false,
}: POToPEOMappingStepProps) {
  // Helper function to check if a PO to PEO mapping exists
  const isPOToPEOMapped = (poId: number, peoId: number) => {
    return poToPEOMappings.some((m) => m.poId === poId && m.peoId === peoId);
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
        Program Outcomes to PEOs Mapping
      </h2>

      <TooltipProvider>
        <div className="mb-4 flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="mr-1 h-4 w-4" />
                <span>Check boxes to map Program Outcomes to PEOs</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Each Program Outcome should map to at least one PEO</p>
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
              {peos.map((peo) => (
                <TableHead key={peo.id} className="text-center border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-semibold">PEO{peo.id}</div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{peo.statement}</p>
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
                {peos.map((peo) => (
                  <TableCell key={peo.id} className="text-center border">
                    <Checkbox
                      checked={isPOToPEOMapped(po.id, peo.id)}
                      onCheckedChange={() =>
                        togglePOToPEOMapping(po.id, peo.id)
                      }
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
        <p>Hover over PEO IDs, PO names, or PO statements to view full text</p>
      </div>
    </>
  );
}
