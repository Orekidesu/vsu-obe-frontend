import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XCircle } from "lucide-react";

interface RevisionRequest {
  section: string;
  details: string;
}

interface ReviseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  currentDetails: string;
  setCurrentDetails: (details: string) => void;
  revisionRequests: RevisionRequest[];
  addRevisionRequest: () => void;
  removeRevisionRequest: (index: number) => void;
  onConfirm: () => void;
}

export function ReviseDialog({
  open,
  onOpenChange,
  currentSection,
  setCurrentSection,
  currentDetails,
  setCurrentDetails,
  revisionRequests,
  addRevisionRequest,
  removeRevisionRequest,
  onConfirm,
}: ReviseDialogProps) {
  // Helper function to get section display name
  const getSectionDisplayName = (sectionKey: string) => {
    const sectionNames: Record<string, string> = {
      "program-details": "Program Details",
      peos: "Program Educational Objectives",
      "peo-mission-mapping": "PEO to Mission Mapping",
      "ga-peo-mapping": "GA to PEO Mapping",
      "program-outcomes": "Program Outcomes",
      "po-peo-mapping": "PO to PEO Mapping",
      "po-ga-mapping": "PO to GA Mapping",
      curriculum: "Curriculum Structure",
      "course-categories": "Course Categories",
      "curriculum-courses": "Curriculum Courses",
      "course-po-mapping": "Course to PO Mapping",
    };
    return sectionNames[sectionKey] || sectionKey;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Request Revisions</DialogTitle>
          <DialogDescription>
            Specify the sections that need revision and provide detailed
            feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={currentSection} onValueChange={setCurrentSection}>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="program-details">
                    Program Details
                  </SelectItem>
                  <SelectItem value="peos">
                    Program Educational Objectives
                  </SelectItem>
                  <SelectItem value="peo-mission-mapping">
                    PEO to Mission Mapping
                  </SelectItem>
                  <SelectItem value="ga-peo-mapping">
                    GA to PEO Mapping
                  </SelectItem>
                  <SelectItem value="program-outcomes">
                    Program Outcomes
                  </SelectItem>
                  <SelectItem value="po-peo-mapping">
                    PO to PEO Mapping
                  </SelectItem>
                  <SelectItem value="po-ga-mapping">
                    PO to GA Mapping
                  </SelectItem>
                  <SelectItem value="curriculum">
                    Curriculum Structure
                  </SelectItem>
                  <SelectItem value="course-categories">
                    Course Categories
                  </SelectItem>
                  <SelectItem value="curriculum-courses">
                    Curriculum Courses
                  </SelectItem>
                  <SelectItem value="course-po-mapping">
                    Course to PO Mapping
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Revision Details</Label>
              <Textarea
                id="details"
                placeholder="Describe what needs to be revised..."
                value={currentDetails}
                onChange={(e) => setCurrentDetails(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <Button
            onClick={addRevisionRequest}
            className="w-full"
            disabled={!currentSection || !currentDetails.trim()}
          >
            Add Revision Request
          </Button>

          {revisionRequests.length > 0 && (
            <div className="space-y-4 mt-4">
              <h3 className="font-medium">Current Revision Requests</h3>
              <div className="space-y-3">
                {revisionRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {getSectionDisplayName(request.section)}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.details}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRevisionRequest(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
            disabled={revisionRequests.length === 0}
          >
            Submit Revision Requests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
