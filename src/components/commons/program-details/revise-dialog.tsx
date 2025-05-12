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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XCircle } from "lucide-react";
import { useState } from "react";

interface RevisionRequest {
  section: string;
  details: string;
  type: "section" | "course";
  courseId?: string;
  courseName?: string;
}

interface ReviseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  currentDetails: string;
  setCurrentDetails: (details: string) => void;
  revisionRequests: RevisionRequest[];
  addRevisionRequest?: () => void;
  removeRevisionRequest: (index: number) => void;
  onConfirm: () => void;
  // Add new props for course-specific revisions
  courses?: { id: string; code: string; descriptive_title: string }[];
  currentCourse?: string;
  setCurrentCourse?: (courseId: string) => void;
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
  // Add default values for new props
  courses = [],
  currentCourse = "",
  setCurrentCourse = () => {},
}: ReviseDialogProps) {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("section");

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

  // Helper function to add a revision request based on active tab
  const handleAddRevisionRequest = () => {
    if (activeTab === "section") {
      if (currentSection && currentDetails.trim()) {
        const newRequest: RevisionRequest = {
          section: currentSection,
          details: currentDetails,
          type: "section",
        };
        revisionRequests.push(newRequest);
        setCurrentSection("");
        setCurrentDetails("");
      }
    } else if (activeTab === "course") {
      if (currentCourse && currentDetails.trim()) {
        const selectedCourse = courses.find((c) => c.id === currentCourse);
        if (selectedCourse) {
          const newRequest: RevisionRequest = {
            section: "course",
            details: currentDetails,
            type: "course",
            courseId: currentCourse,
            courseName: `${selectedCourse.code} - ${selectedCourse.descriptive_title}`,
          };
          revisionRequests.push(newRequest);
          setCurrentCourse("");
          setCurrentDetails("");
        }
      }
    }
  };

  // Filter revision requests by type
  const programRevisions = revisionRequests.filter(
    (request) => request.type === "section"
  );
  const courseRevisions = revisionRequests.filter(
    (request) => request.type === "course"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Request Revisions</DialogTitle>
          <DialogDescription>
            Specify the sections or courses that need revision and provide
            detailed feedback.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="section">Section Revisions</TabsTrigger>
            <TabsTrigger value="course">Course Revisions</TabsTrigger>
          </TabsList>

          <TabsContent value="section" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={currentSection}
                  onValueChange={setCurrentSection}
                >
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
                <Label htmlFor="section-details">Revision Details</Label>
                <Textarea
                  id="section-details"
                  placeholder="Describe what needs to be revised..."
                  value={currentDetails}
                  onChange={(e) => setCurrentDetails(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <Button
              onClick={handleAddRevisionRequest}
              className="w-full"
              disabled={!currentSection || !currentDetails.trim()}
            >
              Add Section Revision Request
            </Button>
          </TabsContent>

          <TabsContent value="course" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={currentCourse} onValueChange={setCurrentCourse}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.descriptive_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-details">Revision Details</Label>
                <Textarea
                  id="course-details"
                  placeholder="Describe what needs to be revised in this course..."
                  value={currentDetails}
                  onChange={(e) => setCurrentDetails(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <Button
              onClick={handleAddRevisionRequest}
              className="w-full"
              disabled={!currentCourse || !currentDetails.trim()}
            >
              Add Course Revision Request
            </Button>
          </TabsContent>
        </Tabs>

        {revisionRequests.length > 0 && (
          <div className="space-y-6 mt-6">
            <h3 className="font-medium text-lg">Current Revision Requests</h3>

            {programRevisions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
                  Program-Level Revisions
                </h4>
                <div className="space-y-3">
                  {programRevisions.map((request) => {
                    const originalIndex = revisionRequests.findIndex(
                      (r) => r === request
                    );
                    return (
                      <div
                        key={originalIndex}
                        className="flex items-start gap-2 p-3 border rounded-md bg-gray-50"
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
                          onClick={() => removeRevisionRequest(originalIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {courseRevisions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
                  Course-Level Revisions
                </h4>
                <div className="space-y-3">
                  {courseRevisions.map((request) => {
                    const originalIndex = revisionRequests.findIndex(
                      (r) => r === request
                    );
                    return (
                      <div
                        key={originalIndex}
                        className="flex items-start gap-2 p-3 border rounded-md bg-blue-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{request.courseName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.details}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRevisionRequest(originalIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
