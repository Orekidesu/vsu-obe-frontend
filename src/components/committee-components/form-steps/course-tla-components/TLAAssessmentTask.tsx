import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { AssessmentTask } from "@/store/course/course-store";

interface AssessmentTaskRowProps {
  task: AssessmentTask;
  courseOutcomeId: number;
  assessmentTools: string[];
  onUpdateAssessmentTask: (
    id: string,
    courseOutcomeId: number,
    code: string,
    name: string,
    tool: string,
    weight: number
  ) => void;
  onRemoveAssessmentTask: (id: string) => void;
  handleAddCustomTool: (value: string) => string;
}

export function AssessmentTaskRow({
  task,
  courseOutcomeId,
  assessmentTools,
  onUpdateAssessmentTask,
  onRemoveAssessmentTask,
  handleAddCustomTool,
}: AssessmentTaskRowProps) {
  return (
    <TableRow>
      <TableCell className="border">
        <Input
          value={task.code}
          onChange={(e) =>
            onUpdateAssessmentTask(
              task.id,
              courseOutcomeId,
              e.target.value,
              task.name,
              task.tool,
              task.weight
            )
          }
          className="h-8"
          placeholder="e.g., Q1"
        />
      </TableCell>
      <TableCell className="border">
        <Input
          value={task.name}
          onChange={(e) =>
            onUpdateAssessmentTask(
              task.id,
              courseOutcomeId,
              task.code,
              e.target.value,
              task.tool,
              task.weight
            )
          }
          className="h-8"
          placeholder="e.g., Quiz 1"
        />
      </TableCell>
      <TableCell className="border">
        <div className="flex space-x-2">
          <Select
            value={task.tool}
            onValueChange={(value) =>
              onUpdateAssessmentTask(
                task.id,
                courseOutcomeId,
                task.code,
                task.name,
                value,
                task.weight
              )
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select a tool" />
            </SelectTrigger>
            <SelectContent>
              {assessmentTools.map((tool) => (
                <SelectItem key={tool} value={tool}>
                  {tool}
                </SelectItem>
              ))}
              <div className="p-2 border-t">
                <Input
                  placeholder="Add custom tool..."
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      if (value) {
                        const newTool = handleAddCustomTool(value);
                        onUpdateAssessmentTask(
                          task.id,
                          courseOutcomeId,
                          task.code,
                          task.name,
                          newTool,
                          task.weight
                        );
                        input.value = "";
                      }
                    }
                  }}
                />
              </div>
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className="border">
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={task.weight}
          onChange={(e) =>
            onUpdateAssessmentTask(
              task.id,
              courseOutcomeId,
              task.code,
              task.name,
              task.tool,
              Number.parseFloat(e.target.value) || 0
            )
          }
          className="h-8 text-center"
          placeholder="0.0"
        />
      </TableCell>
      <TableCell className="border text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemoveAssessmentTask(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
