import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, AlertCircle, Calculator } from "lucide-react";

interface TLAInstructionsProps {
  totalWeight: number;
  isTotalWeightValid: boolean;
}

export function TLAInstructions({
  totalWeight,
  isTotalWeightValid,
}: TLAInstructionsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-blue-800">
            Teaching, Learning, and Assessment (TLA) Plan
          </h3>
          <p className="text-sm text-blue-700">
            Define assessment tasks for each Course Outcome. Each CO must have
            at least one assessment task.
          </p>
          <p className="text-sm text-blue-700">
            The total assessment weight across all tasks must equal exactly
            100%.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Calculator className="h-3 w-3 mr-1" />
                Total Weight: {totalWeight.toFixed(1)}%
              </Badge>
            </div>
            {isTotalWeightValid ? (
              <span className="text-xs text-green-600 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Weight is valid
              </span>
            ) : (
              <span className="text-xs text-amber-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Total weight must be 100%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
