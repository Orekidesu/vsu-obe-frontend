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
import { GraduateAttribute } from "@/types/model/GraduateAttributes";

interface PEO {
  id: number;
  statement: string;
}

interface GAToPEOMapping {
  gaId: string;
  peoId: number;
}

interface GAToPEOMappingStepProps {
  peos: PEO[];
  graduateAttributes: GraduateAttribute[];
  gaToPEOMappings: GAToPEOMapping[];
  toggleGAToPEOMapping: (gaId: string, peoId: number) => void;
  isLoading?: boolean;
}

export function GAToPEOMappingStep({
  peos,
  graduateAttributes,
  gaToPEOMappings,
  toggleGAToPEOMapping,
  isLoading = false,
}: GAToPEOMappingStepProps) {
  // Helper function to check if a GA is mapped to a PEO
  const isGAToPEOMapped = (gaId: string, peoId: number) => {
    return gaToPEOMappings.some((m) => m.gaId === gaId && m.peoId === peoId);
  };

  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Graduate Attributes to PEOs Mapping
        </h2>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </>
    );
  }

  if (!graduateAttributes || graduateAttributes.length === 0) {
    return (
      <>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Graduate Attributes to PEOs Mapping
        </h2>
        <div className="text-center p-8 border rounded-md">
          <p>
            No graduate attributes available. Please contact the administrator.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Graduate Attributes to PEOs Mapping
      </h2>

      <TooltipProvider>
        <div className="mb-4 flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="mr-1 h-4 w-4" />
                <span>Check boxes to map Graduate Attributes to PEOs</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Each Graduate Attribute should map to at least one PEO</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] border">GAs</TableHead>
              <TableHead className="w-[250px] border">
                GRADUATE ATTRIBUTES (GA) STATEMENTS
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
            {graduateAttributes.map((ga) => (
              <TableRow key={ga.id}>
                <TableCell className="font-medium border">{ga.id}</TableCell>
                <TableCell className="border">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{truncateText(ga.description || "")}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>{ga.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {peos.map((peo) => (
                  <TableCell key={peo.id} className="text-center border">
                    <Checkbox
                      checked={isGAToPEOMapped(ga.id.toString(), peo.id)}
                      onCheckedChange={() =>
                        toggleGAToPEOMapping(ga.id.toString(), peo.id)
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
        <p>Hover over PEO IDs or GA statements to view full text</p>
      </div>
    </>
  );
}
