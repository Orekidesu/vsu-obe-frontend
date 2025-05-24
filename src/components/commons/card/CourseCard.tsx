"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type CourseStatus = "completed" | "pending" | "revision";

export interface CourseCardProps {
  id: string;
  code: string;
  title: string;
  category: string;
  yearSemester: string;
  units: number;
  status: CourseStatus;
  actionText: string;
  actionVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onAction?: () => void;
}

export function CourseCard({
  // id,
  code,
  title,
  category,
  yearSemester,
  units,
  status,
  actionText,
  actionVariant = "default",
  onAction,
}: CourseCardProps) {
  // Determine border color based on status
  const borderClass =
    status === "pending" ? "border-green-300" : "border-red-300";

  // Determine status badge style
  const statusBadgeClass =
    status === "pending"
      ? "bg-amber-100 text-amber-800"
      : status === "revision"
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800"; // for completed status

  // Determine status text
  const statusText =
    status === "pending"
      ? "Pending Details"
      : status === "revision"
        ? "Needs Revision"
        : "Completed";

  return (
    <Card className={`overflow-hidden ${borderClass}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">
                {code}: {title}
              </h3>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{yearSemester}</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Units: {units}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusBadgeClass}`}
                >
                  {statusText}
                </span>
              </div>
            </div>
          </div>
          <Button variant={actionVariant} onClick={onAction}>
            {actionText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
