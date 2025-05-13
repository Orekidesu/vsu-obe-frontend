import { useEffect } from "react";
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
  // addRevisionRequest,
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

  // Get array of sections already in revision requests
  const existingSections = programRevisions.map((req) => req.section);

  // Get array of course IDs already in revision requests
  const existingCourseIds = courseRevisions.map((req) => req.courseId);

  // Create array of available sections (excluding ones already in requests)
  const availableSections = [
    { value: "program-details", label: "Program Details" },
    { value: "peos", label: "Program Educational Objectives" },
    { value: "peo-mission-mapping", label: "PEO to Mission Mapping" },
    { value: "ga-peo-mapping", label: "GA to PEO Mapping" },
    { value: "program-outcomes", label: "Program Outcomes" },
    { value: "po-peo-mapping", label: "PO to PEO Mapping" },
    { value: "po-ga-mapping", label: "PO to GA Mapping" },
    { value: "curriculum", label: "Curriculum Structure" },
    { value: "course-categories", label: "Course Categories" },
    { value: "curriculum-courses", label: "Curriculum Courses" },
    { value: "course-po-mapping", label: "Course to PO Mapping" },
  ].filter((section) => !existingSections.includes(section.value));

  // Filter available courses (excluding ones already in requests)
  const availableCourses = courses.filter(
    (course) => !existingCourseIds.includes(course.id)
  );

  // Reset selection if the current selection is no longer valid
  // (For example, when a revision with the selected section is added)
  useEffect(() => {
    if (currentSection && existingSections.includes(currentSection)) {
      setCurrentSection("");
    }

    if (currentCourse && existingCourseIds.includes(currentCourse)) {
      setCurrentCourse("");
    }
  }, [currentSection, currentCourse, existingSections, existingCourseIds]);

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
                  disabled={availableSections.length === 0}
                >
                  <SelectTrigger id="section">
                    <SelectValue
                      placeholder={
                        availableSections.length === 0
                          ? "All sections already added"
                          : "Select a section"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {availableSections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                    {availableSections.length === 0 && (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        All sections have been added to revision requests
                      </div>
                    )}
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
                  disabled={availableSections.length === 0}
                />
              </div>
            </div>
            <Button
              onClick={handleAddRevisionRequest}
              className="w-full"
              disabled={
                !currentSection ||
                !currentDetails.trim() ||
                availableSections.length === 0
              }
            >
              Add Section Revision Request
            </Button>
          </TabsContent>

          <TabsContent value="course" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={currentCourse}
                  onValueChange={setCurrentCourse}
                  disabled={availableCourses.length === 0}
                >
                  <SelectTrigger id="course">
                    <SelectValue
                      placeholder={
                        availableCourses.length === 0
                          ? "All courses already added"
                          : "Select a course"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.descriptive_title}
                      </SelectItem>
                    ))}
                    {availableCourses.length === 0 && (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        All courses have been added to revision requests
                      </div>
                    )}
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
                  disabled={availableCourses.length === 0}
                />
              </div>
            </div>
            <Button
              onClick={handleAddRevisionRequest}
              className="w-full"
              disabled={
                !currentCourse ||
                !currentDetails.trim() ||
                availableCourses.length === 0
              }
            >
              Add Course Revision Request
            </Button>
          </TabsContent>
        </Tabs>

        {revisionRequests.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-lg">Current Revision Requests</h3>

            {/* Make BOTH program and course revisions part of the same scrollable area */}
            {/* Make BOTH program and course revisions part of the same scrollable area */}
            <div className="overflow-y-auto max-h-[250px] pr-2 mt-4">
              {programRevisions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 border-b pb-1 sticky top-0 bg-white z-10">
                    Program-Level Revisions
                  </h4>
                  <div className="space-y-3 mt-3">
                    {programRevisions.map((request) => {
                      const originalIndex = revisionRequests.findIndex(
                        (r) => r === request
                      );
                      return (
                        <div
                          key={originalIndex}
                          className="flex items-start gap-2 p-3 border rounded-md bg-gray-50"
                        >
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-medium break-words">
                              {getSectionDisplayName(request.section)}
                            </h4>
                            <p
                              className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-all"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                              }}
                            >
                              {request.details}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRevisionRequest(originalIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
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
                <div>
                  <h4 className="font-medium text-sm text-gray-700 border-b pb-1 sticky top-0 bg-white z-10">
                    Course-Level Revisions
                  </h4>
                  <div className="space-y-3 mt-3">
                    {courseRevisions.map((request) => {
                      const originalIndex = revisionRequests.findIndex(
                        (r) => r === request
                      );
                      return (
                        <div
                          key={originalIndex}
                          className="flex items-start gap-2 p-3 border rounded-md bg-blue-50"
                        >
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-medium break-words">
                              {request.courseName}
                            </h4>
                            <p
                              className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-all"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                              }}
                            >
                              {request.details}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRevisionRequest(originalIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {programRevisions.length === 0 &&
                courseRevisions.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No revision requests added yet.
                  </div>
                )}
            </div>
          </div>
        )}
        <DialogFooter className="mt-4">
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
