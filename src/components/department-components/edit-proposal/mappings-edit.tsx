"use client";

import { useState } from "react";
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

interface PEO {
  statement: string;
}

interface Mission {
  id: number;
  statement: string;
}

interface GraduateAttribute {
  id: number;
  statement: string;
}

interface ProgramOutcome {
  name: string;
  statement: string;
}

interface MappingsEditProps {
  peos?: PEO[];
  missions?: Mission[];
  peoMissionMappings?: { peo_index: number; mission_id: number }[];
  graduateAttributes?: GraduateAttribute[];
  gaPeoMappings?: { peo_index: number; ga_id: number }[];
  pos?: ProgramOutcome[];
  poPeoMappings?: { po_index: number; peo_index: number }[];
  poGaMappings?: { po_index: number; ga_id: number }[];
  updatePEOMissionMappings?: (
    mappings: { peo_index: number; mission_id: number }[]
  ) => void;
  updateGAPEOMappings?: (
    mappings: { peo_index: number; ga_id: number }[]
  ) => void;
  updatePOPEOMappings?: (
    mappings: { po_index: number; peo_index: number }[]
  ) => void;
  updatePOGAMappings?: (
    mappings: { po_index: number; ga_id: number }[]
  ) => void;
  isPOMapping?: boolean;
  isPOGAMapping?: boolean;
}

export function MappingsEdit({
  peos = [],
  missions = [],
  peoMissionMappings = [],
  graduateAttributes = [],
  gaPeoMappings = [],
  pos = [],
  poPeoMappings = [],
  poGaMappings = [],
  updatePEOMissionMappings,
  updateGAPEOMappings,
  updatePOPEOMappings,
  updatePOGAMappings,
  isPOMapping = false,
  isPOGAMapping = false,
}: MappingsEditProps) {
  const [localPEOMissionMappings, setLocalPEOMissionMappings] =
    useState(peoMissionMappings);
  const [localGAPEOMappings, setLocalGAPEOMappings] = useState(gaPeoMappings);
  const [localPOPEOMappings, setLocalPOPEOMappings] = useState(poPeoMappings);
  const [localPOGAMappings, setLocalPOGAMappings] = useState(poGaMappings);

  // Helper function to check if a mapping exists
  const isPEOToMissionMapped = (peoIndex: number, missionId: number) => {
    return localPEOMissionMappings.some(
      (m) => m.peo_index === peoIndex && m.mission_id === missionId
    );
  };

  const isGAToPEOMapped = (gaId: number, peoIndex: number) => {
    return localGAPEOMappings.some(
      (m) => m.ga_id === gaId && m.peo_index === peoIndex
    );
  };

  const isPOToPEOMapped = (poIndex: number, peoIndex: number) => {
    return localPOPEOMappings.some(
      (m) => m.po_index === poIndex && m.peo_index === peoIndex
    );
  };

  const isPOToGAMapped = (poIndex: number, gaId: number) => {
    return localPOGAMappings.some(
      (m) => m.po_index === poIndex && m.ga_id === gaId
    );
  };

  // Toggle mapping functions
  const togglePEOMissionMapping = (peoIndex: number, missionId: number) => {
    if (isPEOToMissionMapped(peoIndex, missionId)) {
      const updatedMappings = localPEOMissionMappings.filter(
        (m) => !(m.peo_index === peoIndex && m.mission_id === missionId)
      );
      setLocalPEOMissionMappings(updatedMappings);
      updatePEOMissionMappings?.(updatedMappings);
    } else {
      const updatedMappings = [
        ...localPEOMissionMappings,
        { peo_index: peoIndex, mission_id: missionId },
      ];
      setLocalPEOMissionMappings(updatedMappings);
      updatePEOMissionMappings?.(updatedMappings);
    }
  };

  const toggleGAPEOMapping = (gaId: number, peoIndex: number) => {
    if (isGAToPEOMapped(gaId, peoIndex)) {
      const updatedMappings = localGAPEOMappings.filter(
        (m) => !(m.ga_id === gaId && m.peo_index === peoIndex)
      );
      setLocalGAPEOMappings(updatedMappings);
      updateGAPEOMappings?.(updatedMappings);
    } else {
      const updatedMappings = [
        ...localGAPEOMappings,
        { ga_id: gaId, peo_index: peoIndex },
      ];
      setLocalGAPEOMappings(updatedMappings);
      updateGAPEOMappings?.(updatedMappings);
    }
  };

  const togglePOPEOMapping = (poIndex: number, peoIndex: number) => {
    if (isPOToPEOMapped(poIndex, peoIndex)) {
      const updatedMappings = localPOPEOMappings.filter(
        (m) => !(m.po_index === poIndex && m.peo_index === peoIndex)
      );
      setLocalPOPEOMappings(updatedMappings);
      updatePOPEOMappings?.(updatedMappings);
    } else {
      const updatedMappings = [
        ...localPOPEOMappings,
        { po_index: poIndex, peo_index: peoIndex },
      ];
      setLocalPOPEOMappings(updatedMappings);
      updatePOPEOMappings?.(updatedMappings);
    }
  };

  const togglePOGAMapping = (poIndex: number, gaId: number) => {
    if (isPOToGAMapped(poIndex, gaId)) {
      const updatedMappings = localPOGAMappings.filter(
        (m) => !(m.po_index === poIndex && m.ga_id === gaId)
      );
      setLocalPOGAMappings(updatedMappings);
      updatePOGAMappings?.(updatedMappings);
    } else {
      const updatedMappings = [
        ...localPOGAMappings,
        { po_index: poIndex, ga_id: gaId },
      ];
      setLocalPOGAMappings(updatedMappings);
      updatePOGAMappings?.(updatedMappings);
    }
  };

  // Truncate long text for display
  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Render PEO to Mission mapping table
  if (
    !isPOMapping &&
    !isPOGAMapping &&
    peos.length > 0 &&
    missions.length > 0
  ) {
    return (
      <div className="space-y-4">
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
                        <div className="font-semibold">{mission.id}</div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p>{mission.statement}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {peos.map((peo, peoIndex) => (
                <TableRow key={peoIndex}>
                  <TableCell className="font-medium border">
                    PEO{peoIndex + 1}
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
                        checked={isPEOToMissionMapped(peoIndex, mission.id)}
                        onCheckedChange={() =>
                          togglePEOMissionMapping(peoIndex, mission.id)
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

        <div className="mt-8">
          <h4 className="text-lg font-medium mb-4">
            Graduate Attributes to PEO Mapping
          </h4>

          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] border">GAs</TableHead>
                  <TableHead className="w-[250px] border">
                    GRADUATE ATTRIBUTES (GA) STATEMENTS
                  </TableHead>
                  {peos.map((peo, peoIndex) => (
                    <TableHead key={peoIndex} className="text-center border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-semibold">PEO{peoIndex + 1}</div>
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
                    <TableCell className="font-medium border">
                      GA{ga.id}
                    </TableCell>
                    <TableCell className="border">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{truncateText(ga.statement)}</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>{ga.statement}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {peos.map((peo, peoIndex) => (
                      <TableCell key={peoIndex} className="text-center border">
                        <Checkbox
                          checked={isGAToPEOMapped(ga.id, peoIndex)}
                          onCheckedChange={() =>
                            toggleGAPEOMapping(ga.id, peoIndex)
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
        </div>
      </div>
    );
  }

  // Render PO to PEO mapping table
  if (isPOMapping && pos.length > 0 && peos.length > 0) {
    return (
      <div className="space-y-4">
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
                {peos.map((peo, peoIndex) => (
                  <TableHead key={peoIndex} className="text-center border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-semibold">PEO{peoIndex + 1}</div>
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
              {pos.map((po, poIndex) => (
                <TableRow key={poIndex}>
                  <TableCell className="font-medium border">
                    PO{poIndex + 1}
                  </TableCell>
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
                  {peos.map((peo, peoIndex) => (
                    <TableCell key={peoIndex} className="text-center border">
                      <Checkbox
                        checked={isPOToPEOMapped(poIndex, peoIndex)}
                        onCheckedChange={() =>
                          togglePOPEOMapping(poIndex, peoIndex)
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
      </div>
    );
  }

  // Render PO to GA mapping table
  if (isPOGAMapping && pos.length > 0 && graduateAttributes.length > 0) {
    return (
      <div className="space-y-4">
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
                        <div className="font-semibold">GA{ga.id}</div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p>{ga.statement}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po, poIndex) => (
                <TableRow key={poIndex}>
                  <TableCell className="font-medium border">
                    PO{poIndex + 1}
                  </TableCell>
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
                        checked={isPOToGAMapped(poIndex, ga.id)}
                        onCheckedChange={() =>
                          togglePOGAMapping(poIndex, ga.id)
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
      </div>
    );
  }

  return <div>No mapping data available</div>;
}
