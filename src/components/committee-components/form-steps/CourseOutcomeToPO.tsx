import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CourseOutcome,
  ProgramOutcome,
  CO_PO_Mapping,
} from "@/store/course/course-store";

interface CourseOutcomesPOStepProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  poMappings: CO_PO_Mapping[];
  onUpdatePO: (
    courseOutcomeId: number,
    programOutcomeId: number,
    contributionLevel: "I" | "E" | "D" | null
  ) => void;
}

export function CourseOutcomesPOStep({
  courseOutcomes,
  programOutcomes,
  poMappings,
  onUpdatePO,
}: CourseOutcomesPOStepProps) {
  const [activeTab, setActiveTab] = useState<string>(
    courseOutcomes[0]?.id.toString() || "1"
  );

  // Helper function to get mappings for a specific CO
  // const getMappingsForCO = (courseOutcomeId: number): CO_PO_Mapping[] => {
  //   return poMappings.filter(
  //     (mapping) => mapping.courseOutcomeId === courseOutcomeId
  //   );
  // };

  // Helper function to get contribution level for a specific CO-PO pair
  const getContributionLevel = (
    courseOutcomeId: number,
    programOutcomeId: number
  ): "I" | "E" | "D" | null => {
    const mapping = poMappings.find(
      (m) =>
        m.courseOutcomeId === courseOutcomeId &&
        m.programOutcomeId === programOutcomeId
    );
    return mapping ? mapping.contributionLevel : null;
  };

  // Check if a CO has at least one PO mapping
  const hasAtLeastOnePOMapping = (courseOutcomeId: number): boolean => {
    return poMappings.some(
      (mapping) => mapping.courseOutcomeId === courseOutcomeId
    );
  };

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

  // Get the full name for a contribution level
  // const getLevelFullName = (level: "I" | "E" | "D") => {
  //   switch (level) {
  //     case "I":
  //       return "Introductory";
  //     case "E":
  //       return "Enabling";
  //     case "D":
  //       return "Development";
  //   }
  // };

  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="space-y-6">
      {/* Instructions and Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-blue-800">
              CO-PO Mapping Instructions
            </h3>
            <p className="text-sm text-blue-700">
              Map each Course Outcome (CO) to one or more Program Outcomes (POs)
              by selecting a contribution level. Each CO must be mapped to at
              least one PO.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  I
                </Badge>
                <span className="text-xs text-blue-700">Introductory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  E
                </Badge>
                <span className="text-xs text-blue-700">Enabling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  D
                </Badge>
                <span className="text-xs text-blue-700">Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Course Outcomes */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {courseOutcomes.map((co) => (
            <TabsTrigger
              key={co.id}
              value={co.id.toString()}
              className="relative"
            >
              CO{co.id}
              {hasAtLeastOnePOMapping(co.id) ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {courseOutcomes.map((co) => (
          <TabsContent
            key={co.id}
            value={co.id.toString()}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Course Outcome {co.id}
                </CardTitle>
                <CardDescription>{co.statement}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Map to Program Outcomes
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {hasAtLeastOnePOMapping(co.id) ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mapped
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Not mapped
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <Table className="border">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] border">PO</TableHead>
                        <TableHead className="border">Statement</TableHead>
                        <TableHead className="w-[250px] border text-center">
                          Contribution Level
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programOutcomes.map((po) => {
                        const contributionLevel = getContributionLevel(
                          co.id,
                          po.id
                        );

                        return (
                          <TableRow key={po.id}>
                            <TableCell className="font-medium border">
                              PO{po.id}
                            </TableCell>
                            <TableCell className="border">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>{truncateText(po.statement)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-md">
                                    <p>{po.statement}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="border">
                              <RadioGroup
                                value={contributionLevel || ""}
                                onValueChange={(value) => {
                                  if (value === "") {
                                    onUpdatePO(co.id, po.id, null);
                                  } else {
                                    onUpdatePO(
                                      co.id,
                                      po.id,
                                      value as "I" | "E" | "D"
                                    );
                                  }
                                }}
                                className="flex space-x-2"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem
                                    value="I"
                                    id={`i-${co.id}-${po.id}`}
                                  />
                                  <Label
                                    htmlFor={`i-${co.id}-${po.id}`}
                                    className="flex items-center"
                                  >
                                    <Badge className={getLevelBadgeColor("I")}>
                                      I
                                    </Badge>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem
                                    value="E"
                                    id={`e-${co.id}-${po.id}`}
                                  />
                                  <Label
                                    htmlFor={`e-${co.id}-${po.id}`}
                                    className="flex items-center"
                                  >
                                    <Badge className={getLevelBadgeColor("E")}>
                                      E
                                    </Badge>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem
                                    value="D"
                                    id={`d-${co.id}-${po.id}`}
                                  />
                                  <Label
                                    htmlFor={`d-${co.id}-${po.id}`}
                                    className="flex items-center"
                                  >
                                    <Badge className={getLevelBadgeColor("D")}>
                                      D
                                    </Badge>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem
                                    value=""
                                    id={`none-${co.id}-${po.id}`}
                                  />
                                  <Label
                                    htmlFor={`none-${co.id}-${po.id}`}
                                    className="text-sm text-muted-foreground"
                                  >
                                    None
                                  </Label>
                                </div>
                              </RadioGroup>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>CO-PO Mapping Summary</CardTitle>
          <CardDescription>
            Overview of all Course Outcomes mapped to Program Outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="border">CO</TableHead>
                  {programOutcomes.map((po) => (
                    <TableHead key={po.id} className="border text-center">
                      PO{po.id}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseOutcomes.map((co) => (
                  <TableRow key={co.id}>
                    <TableCell className="border font-medium">
                      CO{co.id}
                    </TableCell>
                    {programOutcomes.map((po) => {
                      const level = getContributionLevel(co.id, po.id);
                      return (
                        <TableCell key={po.id} className="border text-center">
                          {level ? (
                            <Badge className={getLevelBadgeColor(level)}>
                              {level}
                            </Badge>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
