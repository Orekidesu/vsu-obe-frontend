"use client";
import { useRevisionStore } from "@/store/revision/revision-store";
import { sampleGraduateAttributes } from "@/store/revision/sample-data/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AlertCircle, RotateCcw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function GAPEOMappingRevision() {
  const {
    peos,
    ga_peo_mappings,
    toggleGAPEOMapping,
    resetSection,
    isModified,
  } = useRevisionStore();
  const graduateAttributes = sampleGraduateAttributes;
  const sectionModified = isModified("ga_peo_mappings");

  // Check if a GA is mapped to a PEO
  const isMapped = (gaId: number, peoId: number) => {
    return ga_peo_mappings.some(
      (mapping) => mapping.ga_id === gaId && mapping.peo_id === peoId
    );
  };

  // Handle toggling a mapping
  const handleToggleMapping = (gaId: number, peoId: number) => {
    toggleGAPEOMapping(gaId, peoId);
  };

  // Reset all mappings to original state
  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all mappings to their original state? All changes will be lost."
      )
    ) {
      resetSection("ga_peo_mappings");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Graduate Attribute to PEO Mapping
              {sectionModified && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Modified
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!sectionModified}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {peos.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">
                No Program Educational Objectives defined yet.
              </p>
              <p className="text-gray-500 mt-2">
                Please define PEOs before creating mappings.
              </p>
            </div>
          ) : (
            <>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Map each Graduate Attribute (GA) to the Program Educational
                  Objectives (PEOs) it supports.
                </AlertDescription>
              </Alert>

              <ScrollArea className="max-h-[500px]">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-gray-100 p-3 text-left font-medium text-gray-700 border-b">
                          Graduate Attributes
                        </th>
                        {peos.map((peo, index) => (
                          <th
                            key={peo.id}
                            className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-l"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    PEO {index + 1}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>{peo.statement}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {graduateAttributes.map((ga) => (
                        <tr key={ga.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    <span className="font-medium">
                                      GA {ga.ga_no}:
                                    </span>{" "}
                                    {ga.name}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>{ga.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          {peos.map((peo) => (
                            <td
                              key={`${ga.id}-${peo.id}`}
                              className="p-3 border-b border-l text-center"
                            >
                              <div className="flex justify-center">
                                <Checkbox
                                  id={`ga-peo-${ga.id}-${peo.id}`}
                                  checked={isMapped(ga.id, peo.id)}
                                  onCheckedChange={() =>
                                    handleToggleMapping(ga.id, peo.id)
                                  }
                                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>

              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-700">
                  Graduate Attributes Reference
                </h4>
                <div className="grid gap-3">
                  {graduateAttributes.map((ga) => (
                    <div
                      key={ga.id}
                      className="p-3 border rounded-md bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-700">
                          GA {ga.ga_no}:
                        </div>
                        <div className="font-medium text-gray-700">
                          {ga.name}
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm">
                        {ga.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
