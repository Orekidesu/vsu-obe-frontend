import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

interface Program {
  name: string;
  abbreviation: string;
}

interface ProgramDetailsProps {
  program: Program;
}

export function ProgramDetails({ program }: ProgramDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          Program Details
        </CardTitle>
        <p className="text-sm text-gray-600">
          Basic information about the academic program
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Program Name
            </label>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-indigo-900 font-medium">{program.name}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Program Abbreviation
            </label>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
              <p className="text-indigo-900 font-medium">
                {program.abbreviation}
              </p>
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-700 border-indigo-300"
              >
                {program.abbreviation}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
