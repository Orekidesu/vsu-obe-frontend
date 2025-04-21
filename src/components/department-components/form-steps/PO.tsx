import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
}

interface ProgramOutcomeStepProps {
  programOutcomes: ProgramOutcome[];
  addProgramOutcome: () => void;
  updateProgramOutcome: (id: number, name: string, statement: string) => void;
  removeProgramOutcome: (id: number) => void;
}

export function ProgramOutcomeStep({
  programOutcomes,
  addProgramOutcome,
  updateProgramOutcome,
  removeProgramOutcome,
}: ProgramOutcomeStepProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Program Outcomes (POs)
      </h2>

      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PO Number</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Statement</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">PO {po.id}</TableCell>
                <TableCell>
                  <Input
                    placeholder="Enter name"
                    value={po.name}
                    onChange={(e) =>
                      updateProgramOutcome(po.id, e.target.value, po.statement)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Enter PO statement"
                    value={po.statement}
                    onChange={(e) =>
                      updateProgramOutcome(po.id, po.name, e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </TableCell>
                <TableCell>
                  {programOutcomes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProgramOutcome(po.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          onClick={addProgramOutcome}
          variant="outline"
          className="flex items-center gap-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
        >
          <Plus className="h-4 w-4" /> Add Another Program Outcome
        </Button>
      </div>
    </>
  );
}
