import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function CourseOutcomeInstructions() {
  return (
    // <div className="bg-amber-500 from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <div className="flex items-start space-x-4">
        <div className="rounded-full">
          {/* <Info className="h-5 w-5 text-blue-600" /> */}
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-amber-800">
            CO-PO Mapping Instructions
          </h3>
          <p className="text-sm text-amber-700">
            Map each Course Outcome (CO) to one or more Program Outcomes (POs)
            by selecting a contribution level. Each CO must be mapped to at
            least one PO.
          </p>
          <p className="text-sm text-amber-700">
            Note: Not all contribution levels are available for every Program
            Outcome. Unavailable options will be disabled.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                I
              </Badge>
              <span className="text-xs text-amber-700">Introductory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                E
              </Badge>
              <span className="text-xs text-amber-700">Enabling</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                D
              </Badge>
              <span className="text-xs text-amber-700">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
