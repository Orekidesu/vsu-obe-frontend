import { Button } from "@/components/ui/button";
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
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";
interface PEOsStepProps {
  peos: ProgramEducationalObjective[];
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
}

export function PEOsStep({
  peos,
  addPEO,
  updatePEO,
  removePEO,
}: PEOsStepProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Program Educational Objectives (PEOs)
      </h2>

      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PEO Number</TableHead>
              <TableHead>Statement</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peos.map((peo) => (
              <TableRow key={peo.id}>
                <TableCell className="font-medium">PEO {peo.id}</TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Enter PEO statement"
                    value={peo.statement}
                    onChange={(e) => updatePEO(peo.id, e.target.value)}
                    className="min-h-[80px]"
                  />
                </TableCell>
                <TableCell>
                  {peos.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePEO(peo.id)}
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
          onClick={addPEO}
          variant="outline"
          className="flex items-center gap-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
        >
          <Plus className="h-4 w-4" /> Add Another PEO
        </Button>
      </div>
    </>
  );
}
