"use client";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AlertCircle, RotateCcw, Info, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import useGraduateAttributes from "@/hooks/shared/useGraduateAttribute";

export function POGAMappingRevision() {
  const { pos, po_ga_mappings, togglePOGAMapping, resetSection, isModified } =
    useRevisionStore();

  const { graduateAttributes, isFetching, error } = useGraduateAttributes();

  const sectionModified = isModified("po_ga_mappings");

  // Check if a PO is mapped to a GA
  const isMapped = (poId: number | string, gaId: number) => {
    return po_ga_mappings.some(
      (mapping) => mapping.po_id === poId && mapping.ga_id === gaId
    );
  };

  // Handle toggling a mapping
  const handleToggleMapping = (poId: number | string, gaId: number) => {
    togglePOGAMapping(poId, gaId);
  };

  // Reset all mappings to original state
  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all mappings to their original state? All changes will be lost."
      )
    ) {
      resetSection("po_ga_mappings");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading graduate attributes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load graduate attributes. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (!graduateAttributes || graduateAttributes.length === 0) {
    return (
      <Alert className="my-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          No graduate attributes found. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Program Outcome to Graduate Attribute Mapping
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
          {pos.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">No Program Outcomes defined yet.</p>
              <p className="text-gray-500 mt-2">
                Please define Program Outcomes before creating mappings.
              </p>
            </div>
          ) : (
            <>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Map each Program Outcome (PO) to the Graduate Attributes (GAs)
                  it supports.
                </AlertDescription>
              </Alert>

              <ScrollArea className="max-h-[500px]">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-gray-100 p-3 text-left font-medium text-gray-700 border-b">
                          Program Outcomes
                        </th>
                        {graduateAttributes.map((ga) => (
                          <th
                            key={ga.id}
                            className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-l"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    GA {ga.ga_no}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="font-medium">{ga.name}</p>
                                  <p className="text-sm">{ga.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pos.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    <span className="font-medium">
                                      {po.name}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>{po.statement}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          {graduateAttributes.map((ga) => (
                            <td
                              key={`${po.id}-${ga.id}`}
                              className="p-3 border-b border-l text-center"
                            >
                              <div className="flex justify-center">
                                <Checkbox
                                  id={`po-ga-${po.id}-${ga.id}`}
                                  checked={isMapped(po.id, ga.id)}
                                  onCheckedChange={() =>
                                    handleToggleMapping(po.id, ga.id)
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
