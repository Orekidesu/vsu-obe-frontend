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
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface GAPEOMappingSectionProps {
  peos: ProgramEducationalObjective[];
  graduateAttributes: GraduateAttribute[];
  gaToPEOMappings: { gaId: number; peoId: number }[];
  goToStep: (step: number) => void;
}

export function GAPEOMappingSection({
  peos,
  graduateAttributes,
  gaToPEOMappings,
  goToStep,
}: GAPEOMappingSectionProps) {
  // Helper function
  const isGAToPEOMapped = (gaId: number, peoId: number) => {
    return gaToPEOMappings.some((m) => m.gaId === gaId && m.peoId === peoId);
  };

  return (
    <Section
      id="ga-peo-mapping"
      title="Graduate Attributes to PEO Mapping"
      stepNumber={5}
      goToStep={goToStep}
    >
      <div className="space-y-4 overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="border">GAs</TableHead>
              {peos.map((peo) => (
                <TableHead key={peo.id} className="text-center border">
                  PEO{peo.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {graduateAttributes.map((ga) => (
              <TableRow key={ga.id}>
                <TableCell className="font-medium border">{ga.id}</TableCell>
                {peos.map((peo) => (
                  <TableCell key={peo.id} className="text-center border">
                    {isGAToPEOMapped(ga.id, peo.id) ? (
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
