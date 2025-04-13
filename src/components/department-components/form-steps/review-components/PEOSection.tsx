import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface PEOSectionProps {
  peos: ProgramEducationalObjective[];
  goToStep: (step: number) => void;
}

export function PEOSection({ peos, goToStep }: PEOSectionProps) {
  return (
    <Section
      id="peos"
      title="Program Educational Objectives (PEOs)"
      stepNumber={3}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PEO Number</TableHead>
              <TableHead>Statement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peos.map((peo) => (
              <TableRow key={peo.id}>
                <TableCell className="font-medium">PEO {peo.id}</TableCell>
                <TableCell>{peo.statement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
