import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PO {
  name: string;
  statement: string;
}

interface POSectionProps {
  pos: PO[];
}

export function POSection({ pos }: POSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Outcomes (POs)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PO Number</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Statement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pos.map((po, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">PO {index + 1}</TableCell>
                <TableCell>{po.name}</TableCell>
                <TableCell>{po.statement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
