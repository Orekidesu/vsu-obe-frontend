import { useEffect } from "react";
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
import useMissions from "@/hooks/shared/useMission";

export function PEOMissionMappingRevision() {
  const {
    peos,
    peo_mission_mappings,
    togglePEOMissionMapping,
    resetSection,
    isModified,
  } = useRevisionStore();

  // Fetch missions from API instead of using sample data
  const { missions, getMissions, isFetching, error } = useMissions();

  // Fetch missions on component mount
  useEffect(() => {
    getMissions();
  }, [getMissions]);

  const sectionModified = isModified("peo_mission_mappings");

  // Check if a PEO is mapped to a mission
  const isMapped = (peoId: number, missionId: number) => {
    return peo_mission_mappings.some(
      (mapping) => mapping.peo_id === peoId && mapping.mission_id === missionId
    );
  };

  // Handle toggling a mapping
  const handleToggleMapping = (peoId: number, missionId: number) => {
    togglePEOMissionMapping(peoId, missionId);
  };

  // Reset all mappings to original state
  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all mappings to their original state? All changes will be lost."
      )
    ) {
      resetSection("peo_mission_mappings");
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading mission statements...</p>
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try refreshing the page.
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
              PEO to Mission Mapping
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
          ) : !missions || missions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">No mission statements found.</p>
            </div>
          ) : (
            <>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Map each Program Educational Objective (PEO) to the University
                  Mission Statements it supports.
                </AlertDescription>
              </Alert>

              <ScrollArea className="max-h-[500px]">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-gray-100 p-3 text-left font-medium text-gray-700 border-b">
                          Program Educational Objectives
                        </th>
                        {missions.map((mission) => (
                          <th
                            key={mission.id}
                            className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-l"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    M{mission.mission_no}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p>{mission.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {peos.map((peo, index) => (
                        <tr key={peo.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    <span className="font-medium">
                                      PEO {index + 1}:
                                    </span>{" "}
                                    {peo.statement.length > 60
                                      ? `${peo.statement.substring(0, 60)}...`
                                      : peo.statement}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="max-w-xs"
                                >
                                  <p>{peo.statement}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          {missions.map((mission) => (
                            <td
                              key={`${peo.id}-${mission.id}`}
                              className="p-3 border-b border-l text-center"
                            >
                              <div className="flex justify-center">
                                <Checkbox
                                  id={`peo-mission-${peo.id}-${mission.id}`}
                                  checked={isMapped(peo.id, mission.id)}
                                  onCheckedChange={() =>
                                    handleToggleMapping(peo.id, mission.id)
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
                  Mission Statements Reference
                </h4>
                <div className="grid gap-3">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex gap-2 p-3 border rounded-md bg-gray-50"
                    >
                      <div className="flex-shrink-0 font-semibold text-gray-700 w-16">
                        M{mission.mission_no}:
                      </div>
                      <div className="text-gray-700">{mission.description}</div>
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
