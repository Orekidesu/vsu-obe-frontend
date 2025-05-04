import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function CourseOutcomeInstructions() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-blue-800">
            CO-PO Mapping Instructions
          </h3>
          <p className="text-sm text-blue-700">
            Map each Course Outcome (CO) to one or more Program Outcomes (POs)
            by selecting a contribution level. Each CO must be mapped to at
            least one PO.
          </p>
          <p className="text-sm text-blue-700">
            Note: Not all contribution levels are available for every Program
            Outcome. Unavailable options will be disabled.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                I
              </Badge>
              <span className="text-xs text-blue-700">Introductory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                E
              </Badge>
              <span className="text-xs text-blue-700">Enabling</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                D
              </Badge>
              <span className="text-xs text-blue-700">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
