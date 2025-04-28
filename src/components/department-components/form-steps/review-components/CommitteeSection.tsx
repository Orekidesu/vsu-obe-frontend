import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Committee } from "@/store/wizard-store";

interface CommitteeSectionProps {
  committees: Committee[];
  selectedCommittees: number[];
  goToStep: (step: number) => void;
}

export function CommitteeSection({
  committees,
  selectedCommittees,
  goToStep,
}: CommitteeSectionProps) {
  // Get the selected committee objects based on IDs
  const selectedCommitteeObjects = committees.filter((committee) =>
    selectedCommittees.includes(committee.id)
  );

  return (
    <Section
      id="committees"
      title="Committee Assignment"
      stepNumber={14}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedCommitteeObjects.length > 0 ? (
              selectedCommitteeObjects.map((committee) => (
                <TableRow key={committee.id}>
                  <TableCell>{committee.id}</TableCell>
                  <TableCell>{committee.first_name}</TableCell>
                  <TableCell>{committee.last_name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No committees selected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
