import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgramOutcome } from "@/store/wizard-store";

interface ProgramOutcomesSectionProps {
  programOutcomes: ProgramOutcome[];
  goToStep: (step: number) => void;
}

export function ProgramOutcomesSection({
  programOutcomes,
  goToStep,
}: ProgramOutcomesSectionProps) {
  return (
    <Section
      id="program-outcomes"
      title="Program Outcomes (POs)"
      stepNumber={6}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PO Number</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Statement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">PO {po.id}</TableCell>
                <TableCell>{po.name}</TableCell>
                <TableCell>{po.statement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
