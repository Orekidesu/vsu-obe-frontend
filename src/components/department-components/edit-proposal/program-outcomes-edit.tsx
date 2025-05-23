import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  name: string;
  statement: string;
}

interface ProgramOutcomesEditProps {
  programOutcomes: ProgramOutcome[];
  updateProgramOutcomes: (programOutcomes: ProgramOutcome[]) => void;
}

export function ProgramOutcomesEdit({
  programOutcomes,
  updateProgramOutcomes,
}: ProgramOutcomesEditProps) {
  const [localPOs, setLocalPOs] = useState<ProgramOutcome[]>(programOutcomes);

  const handleUpdatePO = (index: number, name: string, statement: string) => {
    const updatedPOs = [...localPOs];
    updatedPOs[index] = { name, statement };
    setLocalPOs(updatedPOs);
    updateProgramOutcomes(updatedPOs);
  };

  const handleAddPO = () => {
    const updatedPOs = [...localPOs, { name: "", statement: "" }];
    setLocalPOs(updatedPOs);
    updateProgramOutcomes(updatedPOs);
  };

  const handleRemovePO = (index: number) => {
    if (localPOs.length <= 1) return; // Don't remove the last PO

    const updatedPOs = localPOs.filter((_, i) => i !== index);
    setLocalPOs(updatedPOs);
    updateProgramOutcomes(updatedPOs);
  };

  return (
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
          {localPOs.map((po, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">PO {index + 1}</TableCell>
              <TableCell>
                <Input
                  placeholder="Enter name"
                  value={po.name}
                  onChange={(e) =>
                    handleUpdatePO(index, e.target.value, po.statement)
                  }
                />
              </TableCell>
              <TableCell>
                <Textarea
                  placeholder="Enter PO statement"
                  value={po.statement}
                  onChange={(e) =>
                    handleUpdatePO(index, po.name, e.target.value)
                  }
                  className="min-h-[80px]"
                />
              </TableCell>
              <TableCell>
                {localPOs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePO(index)}
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
        onClick={handleAddPO}
        variant="outline"
        className="flex items-center gap-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
      >
        <Plus className="h-4 w-4" /> Add Another Program Outcome
      </Button>
    </div>
  );
}
