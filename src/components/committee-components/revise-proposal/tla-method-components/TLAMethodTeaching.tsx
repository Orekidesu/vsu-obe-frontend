import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { BookOpen, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface TLAMethodTeachingProps {
  coIndex: number;
  methods: string[];
  selectedMethods: string[];
  handleMethodChange: (method: string, checked: boolean) => void;
  newMethod: string;
  setNewMethod: (value: string) => void;
  handleAddMethod: () => void;
}

export function TLAMethodTeaching({
  coIndex,
  methods,
  selectedMethods,
  handleMethodChange,
  newMethod,
  setNewMethod,
  handleAddMethod,
}: TLAMethodTeachingProps) {
  const [isAdding, setIsAdding] = useState(false);
  const hasMethods = selectedMethods.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium">Teaching Methods</h3>
        </div>
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
          {methods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`teaching-${coIndex}-${method}`}
                checked={selectedMethods.includes(method)}
                onCheckedChange={(checked) =>
                  handleMethodChange(method, checked as boolean)
                }
              />
              <label
                htmlFor={`teaching-${coIndex}-${method}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {method}
              </label>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="mt-4 flex items-center space-x-2">
            <Input
              placeholder="Add new teaching method..."
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddMethod();
                  setIsAdding(false);
                } else if (e.key === "Escape") {
                  setIsAdding(false);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => {
                handleAddMethod();
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
            className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new teaching method...
          </Button>
        )}
      </div>
    </div>
  );
}
