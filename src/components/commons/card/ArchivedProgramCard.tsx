import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";
import moment from "moment";
import { ProgramResponse } from "@/types/model/Program";

interface ArchivedProgramCardProps {
  program: ProgramResponse;
}

const ArchivedProgramCard: React.FC<ArchivedProgramCardProps> = ({
  program,
}) => {
  const formattedDate = program.updated_at
    ? moment(program.updated_at).format("MMM DD, YYYY")
    : "";

  return (
    <Card className="relative bg-gray-50/50 border-gray-200">
      {/* Archived badge in top-right corner */}
      <div className="absolute top-3 right-3">
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <Archive className="h-3 w-3 mr-1" /> Archived
        </Badge>
      </div>

      <CardHeader className="pr-20">
        {" "}
        {/* Add right padding for badge */}
        <CardTitle className="text-gray-700">{program.name}</CardTitle>
        <CardDescription className="text-gray-500">
          {program.abbreviation}{" "}
          {program.version && `Version ${program.version}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Department:</span>{" "}
            {program.department.name}
          </p>
          <p>
            <span className="font-medium">Faculty:</span>{" "}
            {program.department.faculty.name}
          </p>
          {formattedDate && (
            <p>
              <span className="font-medium">Last Updated:</span> {formattedDate}
            </p>
          )}
        </div>

        {/* Optional: Add archived date if available */}
        {/* <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Archived on: {moment(program.archived_at).format("MMM DD, YYYY")}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ArchivedProgramCard;
