import { Info, Presentation, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TMLRInstructionsProps {
  teachingMethodsCount: number;
  learningResourcesCount: number;
}

export function TMLRInstructions({
  teachingMethodsCount,
  learningResourcesCount,
}: TMLRInstructionsProps) {
  return (
    // <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <div className="flex items-start space-x-4">
        <div className=" rounded-full">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-amber-800">
            Teaching Methods and Learning Resources
          </h3>
          <p className="text-sm text-amber-700">
            Select teaching methods and learning resources for each Course
            Outcome.
          </p>
          <p className="text-sm text-amber-700">
            Each CO must have at least one teaching method and one learning
            resource.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center">
              <Presentation className="h-3 w-3 mr-1" />
              Teaching Methods: {teachingMethodsCount}
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Resources: {learningResourcesCount}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
