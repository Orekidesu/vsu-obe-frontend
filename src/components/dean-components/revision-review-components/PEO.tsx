import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface PEO {
  statement: string;
}

interface ProgramEducationalObjectivesProps {
  peos: PEO[];
}

export function ProgramEducationalObjectives({
  peos,
}: ProgramEducationalObjectivesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Program Educational Objectives (PEOs)
        </CardTitle>
        <p className="text-sm text-gray-600">
          Broad statements that describe what graduates are expected to attain
          within a few years after graduation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {peos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Program Educational Objectives defined</p>
          </div>
        ) : (
          peos.map((peo, index) => (
            <Card key={index} className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300 shrink-0"
                  >
                    PEO {index + 1}
                  </Badge>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {peo.statement}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Total PEOs:</strong> {peos.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
