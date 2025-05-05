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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-blue-800">
            Teaching Methods and Learning Resources
          </h3>
          <p className="text-sm text-blue-700">
            Select teaching methods and learning resources for each Course
            Outcome.
          </p>
          <p className="text-sm text-blue-700">
            Each CO must have at least one teaching method and one learning
            resource.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
              <Presentation className="h-3 w-3 mr-1" />
              Teaching Methods: {teachingMethodsCount}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Resources: {learningResourcesCount}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
