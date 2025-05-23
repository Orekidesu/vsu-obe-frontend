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
import { ProgramOutcome } from "@/store/wizard-store";

interface POGAMappingSectionProps {
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];
  poToGAMappings: { poId: number; gaId: number }[];
  goToStep: (step: number) => void;
}

export function POGAMappingSection({
  programOutcomes,
  graduateAttributes,
  poToGAMappings,
  goToStep,
}: POGAMappingSectionProps) {
  // Helper function
  const isPOToGAMapped = (poId: number, gaId: number) => {
    return poToGAMappings.some((m) => m.poId === poId && m.gaId === gaId);
  };

  return (
    <Section
      id="po-ga-mapping"
      title="PO to GA Mapping"
      stepNumber={8}
      goToStep={goToStep}
    >
      <div className="space-y-4 overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="border">POs</TableHead>
              {graduateAttributes.map((ga) => (
                <TableHead key={ga.id} className="text-center border">
                  {ga.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium border">PO{po.id}</TableCell>
                {graduateAttributes.map((ga) => (
                  <TableCell key={ga.id} className="text-center border">
                    {isPOToGAMapped(po.id, ga.id) ? (
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
