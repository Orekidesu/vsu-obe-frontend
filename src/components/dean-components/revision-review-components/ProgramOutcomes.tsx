import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface PO {
  name: string;
  statement: string;
}

interface ProgramOutcomesProps {
  pos: PO[];
}

export function ProgramOutcomes({ pos }: ProgramOutcomesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Program Outcomes (POs)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Specific statements that describe what students are expected to know
          and be able to do by graduation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Program Outcomes defined</p>
          </div>
        ) : (
          pos.map((po, index) => (
            <Card key={index} className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-300 shrink-0"
                  >
                    {po.name}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm text-green-900 leading-relaxed">
                      {po.statement}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Total POs:</strong> {pos.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
