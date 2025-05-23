import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle, Plus, Presentation } from "lucide-react";
import type {
  CourseOutcome,
  TeachingMethod,
} from "@/store/course/course-store";

interface TeachingMethodsSectionProps {
  courseOutcome: CourseOutcome;
  teachingMethods: TeachingMethod[];
  selectedMethods: string[];
  toggleTeachingMethod: (courseOutcomeId: number, methodId: string) => void;
  newTeachingMethod: string;
  setNewTeachingMethod: (value: string) => void;
  handleAddTeachingMethod: () => void;
}

export function TeachingMethodsSection({
  courseOutcome,
  teachingMethods,
  selectedMethods,
  toggleTeachingMethod,
  newTeachingMethod,
  setNewTeachingMethod,
  handleAddTeachingMethod,
}: TeachingMethodsSectionProps) {
  const hasMethods = selectedMethods.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Presentation className="h-4 w-4 mr-2" />
          Teaching Methods
        </h3>
        <div className="flex items-center space-x-2">
          {hasMethods ? (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {selectedMethods.length} selected
            </span>
          ) : (
            <span className="text-xs text-amber-600 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              None selected
            </span>
          )}
        </div>
      </div>

      <div className="border rounded-md p-4 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {teachingMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tm-${courseOutcome.id}-${method.id}`}
                checked={selectedMethods.includes(method.id)}
                onCheckedChange={() =>
                  toggleTeachingMethod(courseOutcome.id, method.id)
                }
              />
              <label
                htmlFor={`tm-${courseOutcome.id}-${method.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {method.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Input
            placeholder="Add new teaching method..."
            value={newTeachingMethod}
            onChange={(e) => setNewTeachingMethod(e.target.value)}
            className="h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTeachingMethod();
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddTeachingMethod}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
