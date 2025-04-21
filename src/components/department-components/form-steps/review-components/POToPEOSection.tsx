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
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";
import { ProgramOutcome } from "@/store/wizard-store";

interface POPEOMappingSectionProps {
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  poToPEOMappings: { poId: number; peoId: number }[];
  goToStep: (step: number) => void;
}

export function POPEOMappingSection({
  peos,
  programOutcomes,
  poToPEOMappings,
  goToStep,
}: POPEOMappingSectionProps) {
  // Helper function
  const isPOToPEOMapped = (poId: number, peoId: number) => {
    return poToPEOMappings.some((m) => m.poId === poId && m.peoId === peoId);
  };

  return (
    <Section
      id="po-peo-mapping"
      title="PO to PEO Mapping"
      stepNumber={7}
      goToStep={goToStep}
    >
      <div className="space-y-4 overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="border">POs</TableHead>
              {peos.map((peo) => (
                <TableHead key={peo.id} className="text-center border">
                  PEO{peo.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium border">PO{po.id}</TableCell>
                {peos.map((peo) => (
                  <TableCell key={peo.id} className="text-center border">
                    {isPOToPEOMapped(po.id, peo.id) ? (
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
