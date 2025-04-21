import { useState } from "react";
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

interface PEO {
  statement: string;
}

interface PEOsEditProps {
  peos: PEO[];
  updatePEOs: (peos: PEO[]) => void;
}

export function PEOsEdit({ peos, updatePEOs }: PEOsEditProps) {
  const [localPEOs, setLocalPEOs] = useState<PEO[]>(peos);

  const handleUpdatePEO = (index: number, statement: string) => {
    const updatedPEOs = [...localPEOs];
    updatedPEOs[index] = { statement };
    setLocalPEOs(updatedPEOs);
    updatePEOs(updatedPEOs);
  };

  const handleAddPEO = () => {
    const updatedPEOs = [...localPEOs, { statement: "" }];
    setLocalPEOs(updatedPEOs);
    updatePEOs(updatedPEOs);
  };

  const handleRemovePEO = (index: number) => {
    if (localPEOs.length <= 1) return; // Don't remove the last PEO

    const updatedPEOs = localPEOs.filter((_, i) => i !== index);
    setLocalPEOs(updatedPEOs);
    updatePEOs(updatedPEOs);
  };

  return (
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
          {localPEOs.map((peo, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">PEO {index + 1}</TableCell>
              <TableCell>
                <Textarea
                  placeholder="Enter PEO statement"
                  value={peo.statement}
                  onChange={(e) => handleUpdatePEO(index, e.target.value)}
                  className="min-h-[80px]"
                />
              </TableCell>
              <TableCell>
                {localPEOs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePEO(index)}
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
        onClick={handleAddPEO}
        variant="outline"
        className="flex items-center gap-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
      >
        <Plus className="h-4 w-4" /> Add Another PEO
      </Button>
    </div>
  );
}
