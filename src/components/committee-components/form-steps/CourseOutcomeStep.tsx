"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useCourseDetailsStore } from "@/store/course/course-store";

export function CourseOutcomesStep() {
  const {
    courseOutcomes,
    addCourseOutcome,
    updateCourseOutcome,
    removeCourseOutcome,
  } = useCourseDetailsStore();

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Course Outcomes (COs)
      </h2>

      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">CO Number</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Statement</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseOutcomes.map((co) => (
              <TableRow key={co.id}>
                <TableCell className="font-medium">CO {co.id}</TableCell>
                <TableCell>
                  <Input
                    placeholder="Enter name"
                    value={co.name}
                    onChange={(e) =>
                      updateCourseOutcome(co.id, e.target.value, co.statement)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    placeholder="Enter CO statement"
                    value={co.statement}
                    onChange={(e) =>
                      updateCourseOutcome(co.id, co.name, e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </TableCell>
                <TableCell>
                  {courseOutcomes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourseOutcome(co.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          onClick={addCourseOutcome}
          variant="outline"
          className="flex items-center gap-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
        >
          <Plus className="h-4 w-4" /> Add Another Course Outcome
        </Button>
      </div>
    </>
  );
}
