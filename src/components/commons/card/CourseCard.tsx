"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type CourseStatus = "pending" | "revision";

export interface CourseCardProps {
  id: string;
  code: string;
  title: string;
  category: string;
  yearSemester: string;
  units: number;
  status: CourseStatus;
  revisionReason?: string;
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
  revisionReason,
  actionText,
  actionVariant = "default",
  onAction,
}: CourseCardProps) {
  // Determine border color based on status
  const borderClass =
    status === "pending" ? "border-amber-200" : "border-red-200";

  // Determine status badge style
  const statusBadgeClass =
    status === "pending"
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";

  // Determine status text
  const statusText =
    status === "pending" ? "Pending Details" : "Needs Revision";

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
              {revisionReason && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Reason:</span> {revisionReason}
                </p>
              )}
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
