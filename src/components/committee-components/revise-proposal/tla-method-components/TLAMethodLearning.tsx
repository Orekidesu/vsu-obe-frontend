import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { BookOpen, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TLAMethodLearningProps {
  coIndex: number;
  resources: string[];
  selectedResources: string[];
  handleResourceChange: (resource: string, checked: boolean) => void;
  newResource: string;
  setNewResource: (value: string) => void;
  handleAddResource: () => void;
}

export function TLAMethodLearning({
  coIndex,
  resources,
  selectedResources,
  handleResourceChange,
  newResource,
  setNewResource,
  handleAddResource,
}: TLAMethodLearningProps) {
  const [isAdding, setIsAdding] = useState(false);
  const hasResources = selectedResources.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <h3 className="text-sm font-medium">Learning Resources</h3>
        </div>
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
          {resources.map((resource) => (
            <div key={resource} className="flex items-center space-x-2">
              <Checkbox
                id={`resource-${coIndex}-${resource}`}
                checked={selectedResources.includes(resource)}
                onCheckedChange={(checked) =>
                  handleResourceChange(resource, checked as boolean)
                }
              />
              <label
                htmlFor={`resource-${coIndex}-${resource}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {resource}
              </label>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="mt-4 flex items-center space-x-2">
            <Input
              placeholder="Add new learning resource..."
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddResource();
                  setIsAdding(false);
                } else if (e.key === "Escape") {
                  setIsAdding(false);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => {
                handleAddResource();
                setIsAdding(false);
              }}
              className="h-8 px-2"
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="h-8 px-2"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new learning resource...
          </Button>
        )}
      </div>
    </div>
  );
}
