import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PEO {
  statement: string;
}

interface PEOSectionProps {
  peos: PEO[];
}

export function PEOSection({ peos }: PEOSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Educational Objectives (PEOs)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PEO Number</TableHead>
              <TableHead>Statement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peos.map((peo, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">PEO {index + 1}</TableCell>
                <TableCell>{peo.statement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
