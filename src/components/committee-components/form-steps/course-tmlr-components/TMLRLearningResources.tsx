import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle, Plus, BookOpen } from "lucide-react";
import type {
  CourseOutcome,
  LearningResource,
} from "@/store/course/course-store";

interface LearningResourcesSectionProps {
  courseOutcome: CourseOutcome;
  learningResources: LearningResource[];
  selectedResources: string[];
  toggleLearningResource: (courseOutcomeId: number, resourceId: string) => void;
  newLearningResource: string;
  setNewLearningResource: (value: string) => void;
  handleAddLearningResource: () => void;
}

export function LearningResourcesSection({
  courseOutcome,
  learningResources,
  selectedResources,
  toggleLearningResource,
  newLearningResource,
  setNewLearningResource,
  handleAddLearningResource,
}: LearningResourcesSectionProps) {
  const hasResources = selectedResources.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Learning Resources
        </h3>
        <div className="flex items-center space-x-2">
          {hasResources ? (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {selectedResources.length} selected
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
          {learningResources.map((resource) => (
            <div key={resource.id} className="flex items-center space-x-2">
              <Checkbox
                id={`lr-${courseOutcome.id}-${resource.id}`}
                checked={selectedResources.includes(resource.id)}
                onCheckedChange={() =>
                  toggleLearningResource(courseOutcome.id, resource.id)
                }
              />
              <label
                htmlFor={`lr-${courseOutcome.id}-${resource.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {resource.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Input
            placeholder="Add new learning resource..."
            value={newLearningResource}
            onChange={(e) => setNewLearningResource(e.target.value)}
            className="h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLearningResource();
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddLearningResource}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
