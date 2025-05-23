import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MappingTableProps {
  title: string;
  rowHeaders: { id: string | number; label: string; tooltip: string }[];
  columnHeaders: { id: string | number; label: string; tooltip: string }[];
  mappings: { rowId: string | number; colId: string | number }[];
  contributionLevels?: {
    rowId: string | number;
    colId: string | number;
    levels: string[];
  }[];
  getLevelBadgeColor?: (level: string) => string;
}

export function MappingTable({
  title,
  rowHeaders,
  columnHeaders,
  mappings,
  contributionLevels,
  getLevelBadgeColor,
}: MappingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="border">
                    {/* Empty cell for the top-left corner */}
                  </TableHead>
                  {columnHeaders.map((header) => (
                    <TableHead key={header.id} className="text-center border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">{header.label}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-md">
                          <p>{header.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowHeaders.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">{row.label}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-md">
                          <p>{row.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {columnHeaders.map((col) => {
                      const isMapped = mappings.some(
                        (m) => m.rowId === row.id && m.colId === col.id
                      );

                      // For contribution levels (IED)
                      const contribution = contributionLevels?.find(
                        (c) => c.rowId === row.id && c.colId === col.id
                      );

                      return (
                        <TableCell key={col.id} className="text-center border">
                          {contribution && getLevelBadgeColor ? (
                            <div className="flex justify-center gap-1">
                              {contribution.levels.map((level, levelIndex) => (
                                <Badge
                                  key={levelIndex}
                                  className={getLevelBadgeColor(level)}
                                >
                                  {level}
                                </Badge>
                              ))}
                            </div>
                          ) : isMapped ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
