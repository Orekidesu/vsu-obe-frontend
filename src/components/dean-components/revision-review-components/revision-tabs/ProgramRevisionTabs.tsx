import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  GraduationCap,
} from "lucide-react";
import {
  formatDate,
  getSectionDisplayName,
} from "@/store/revision/sample-data/proposalData";
import { DepartmentRevision, RevisionData } from "./revisionType";

interface ProgramRevisionTabsProps {
  revisionData: RevisionData;
  openSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
  renderSectionContent: (sectionKey: string) => React.ReactNode;
}

export function ProgramRevisionTabs({
  revisionData,
  openSections,
  toggleSection,
  renderSectionContent,
}: ProgramRevisionTabsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Department Revision Requests
        </CardTitle>
        <p className="text-sm text-gray-600">
          Review the sections that require revision at the program level
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {revisionData.department_revisions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No program-level revisions requested</p>
          </div>
        ) : (
          revisionData.department_revisions.map(
            (revision: DepartmentRevision) => (
              <Collapsible
                key={revision.id}
                open={openSections[`dept-${revision.id}`]}
                onOpenChange={() => toggleSection(`dept-${revision.id}`)}
              >
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {openSections[`dept-${revision.id}`] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <div>
                            <h4 className="font-medium">
                              {getSectionDisplayName(revision.section)}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(revision.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-orange-700 border-orange-200"
                        >
                          Revised Section
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 ml-7 space-y-4">
                    {/* Revision Details */}
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">
                            Revision Details:
                          </h5>
                          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                            <p className="text-sm text-orange-800">
                              {revision.details}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Section Content */}
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-2">
                        Updated Data:
                      </h5>
                      {renderSectionContent(revision.section)}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          )
        )}
      </CardContent>
    </Card>
  );
}
