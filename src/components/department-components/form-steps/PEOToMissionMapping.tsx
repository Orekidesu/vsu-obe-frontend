import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Mission } from "@/types/model/Mission";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface Mapping {
  peoId: number;
  missionId: number;
}

interface MappingStepProps {
  peos: ProgramEducationalObjective[];
  missions: Mission[];
  mappings: Mapping[];
  toggleMapping: (peoId: number, missionId: number) => void;
  isLoading?: boolean;
}

export function PEOToMission({
  peos,
  missions,
  mappings,
  toggleMapping,
  isLoading = false,
}: MappingStepProps) {
  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Check if a PEO is mapped to a mission
  const isMapped = (peoId: number, missionId: number) => {
    return mappings.some((m) => m.peoId === peoId && m.missionId === missionId);
  };

  if (isLoading) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-center mb-8">
          PEOs to Mission Mapping
        </h2>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </>
    );
  }

  if (!missions || missions.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-center mb-8">
          PEOs to Mission Mapping
        </h2>
        <div className="text-center p-8 border rounded-md">
          <p>No missions available. Please contact the administrator.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        PEOs to Mission Mapping
      </h2>

      <TooltipProvider>
        <div className="mb-4 flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="mr-1 h-4 w-4" />
                <span>Check boxes to map PEOs to Mission Statements</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Each PEO should map to at least one Mission Statement</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] border">PEOs</TableHead>
              <TableHead className="w-[250px] border">
                KEYWORDS/PEO STATEMENTS
              </TableHead>
              {missions.map((mission) => (
                <TableHead key={mission.id} className="text-center border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="font-semibold">M{mission.mission_no}</div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{mission.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {peos.map((peo) => (
              <TableRow key={peo.id}>
                <TableCell className="font-medium border">
                  PEO{peo.id}
                </TableCell>
                <TableCell className="border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateText(peo.statement)}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{peo.statement}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {missions.map((mission) => (
                  <TableCell key={mission.id} className="text-center border">
                    <Checkbox
                      checked={isMapped(peo.id, mission.id)}
                      onCheckedChange={() => toggleMapping(peo.id, mission.id)}
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
        <p>Hover over mission IDs or PEO statements to view full text</p>
      </div>
    </>
  );
}
