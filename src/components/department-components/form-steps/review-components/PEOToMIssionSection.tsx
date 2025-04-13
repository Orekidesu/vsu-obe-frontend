import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";
import { Mission } from "@/types/model/Mission";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface PEOMissionMappingSectionProps {
  peos: ProgramEducationalObjective[];
  missions: Mission[];
  peoToMissionMappings: { peoId: number; missionId: number }[];
  goToStep: (step: number) => void;
}

export function PEOMissionMappingSection({
  peos,
  missions,
  peoToMissionMappings,
  goToStep,
}: PEOMissionMappingSectionProps) {
  // Helper function
  const isPEOToMissionMapped = (peoId: number, missionId: number) => {
    return peoToMissionMappings.some(
      (m) => m.peoId === peoId && m.missionId === missionId
    );
  };

  return (
    <Section
      id="peo-mission-mapping"
      title="PEO to Mission Mapping"
      stepNumber={4}
      goToStep={goToStep}
    >
      <div className="space-y-4 overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="border">PEOs</TableHead>
              {missions.map((mission) => (
                <TableHead key={mission.id} className="text-center border">
                  {mission.id}
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
                {missions.map((mission) => (
                  <TableCell key={mission.id} className="text-center border">
                    {isPEOToMissionMapped(peo.id, mission.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
