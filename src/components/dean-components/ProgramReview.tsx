"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseDetailsFormat } from "./program-review-components/types/CourseDetails";

import { Loader2 } from "lucide-react";

// Import components
import { ProgramHeader } from "@/components/commons/program-details/program-header";
import { ProgramSummary } from "@/components/commons/program-details/program-summary";
import { PEOSection } from "@/components/commons/program-details/peo-section";
import { POSection } from "@/components/commons/program-details/po-section";
import { CourseCategories } from "@/components/commons/program-details/course-category";
import { ProgramStructure } from "@/components/commons/program-details/program-structure";
import { CurriculumCourses } from "@/components/commons/program-details/curriculum-courses";
import { MappingTable } from "@/components/commons/program-details/mapping-table";
import { ApproveDialog } from "@/components/commons/program-details/approve-dialog";
// import { RejectDialog } from "@/components/commons/program-details/reject-dialog";
import { ReviseDialog } from "@/components/commons/program-details/revise-dialog";
import { CoursePOMapping } from "@/components/commons/program-details/course-po-mapping";
import { CourseDetailsTabs } from "./program-review-components/CourseDetailsTabs";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import type { ProgramProposalResponse } from "@/types/model/ProgramProposal";
import useCurriculumCourses from "@/hooks/faculty-member/useCourseCurriculum";
import { useToast } from "@/hooks/use-toast";
interface RevisionRequest {
  section: string;
  details: string;
  type: "section" | "course";
  courseId?: string;
  courseName?: string;
}

interface CurriculumCourse {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
  code: string;
  descriptive_title: string;
}

interface ProgramReviewPageProps {
  proposalId: number;
}

export default function ProgramReviewPage({
  proposalId,
}: ProgramReviewPageProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  // const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviseDialogOpen, setReviseDialogOpen] = useState(false);
  // const [feedback, setFeedback] = useState("");
  const [revisionRequests, setRevisionRequests] = useState<RevisionRequest[]>(
    []
  );
  const [currentSection, setCurrentSection] = useState("");
  const [currentDetails, setCurrentDetails] = useState("");
  const [currentCourse, setCurrentCourse] = useState("");
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const [dynamicCourseDetailsMap, setDynamicCourseDetailsMap] = useState<
    Record<number, CourseDetailsFormat>
  >({});

  const {
    curriculumCourses,
    isLoading: isCoursesLoading,
    // error: courseError,
  } = useCurriculumCourses({ role: "dean", includeOutcomes: true });

  useEffect(() => {
    if (curriculumCourses) {
      const newMap: Record<number, CourseDetailsFormat> = {};

      curriculumCourses.forEach((course) => {
        // Transform API response to match the expected structure in CourseDetailsTabs
        newMap[course.id] = {
          id: course.id,
          curriculum: course.curriculum,
          course: course.course,
          course_category: course.course_category,
          semester: course.semester,
          units: course.units,
          course_outcomes: course.course_outcomes || [],
        };
      });

      setDynamicCourseDetailsMap(newMap);
    }
  }, [curriculumCourses]);

  const {
    programProposals,
    submitProposalReview,
    isLoading: proposalLoading,
    error: proposalError,
  } = useProgramProposals();

  const programData = programProposals?.find(
    (proposal) => proposal.id === proposalId
  );

  const [transformedData, setTransformedData] = useState({
    program: { name: "", abbreviation: "" },
    peos: [] as { statement: string }[],
    pos: [] as { name: string; statement: string }[],
    curriculum: { name: "" },
    semesters: [] as { year: number; sem: string }[],
    course_categories: [] as { name: string; code: string }[],
    courses: [] as { code: string; descriptive_title: string }[],
    curriculum_courses: [] as Array<{
      course_code: string;
      category_code: string;
      semester_year: number;
      semester_name: string;
      units: number;
    }>,
    peo_mission_mappings: [] as { peo_index: number; mission_id: number }[],
    ga_peo_mappings: [] as { peo_index: number; ga_id: number }[],
    po_peo_mappings: [] as { po_index: number; peo_index: number }[],
    po_ga_mappings: [] as { po_index: number; ga_id: number }[],
    course_po_mappings: [] as {
      course_code: string;
      po_code: string;
      ied: string[];
    }[],
    missions: [] as { id: number; statement: string }[],
    committees: [] as Array<{
      id: string;
      name: string;
      email: string;
      description: string;
    }>,
    committeeAssignments: [] as Array<{
      committeeId: string;
      courseId: string;
      isCompleted: boolean;
    }>,
  });

  useEffect(() => {
    if (
      programData &&
      programData.curriculum &&
      programData.peos &&
      programData.pos &&
      programData.committees
    ) {
      transformApiData(programData);
    }
  }, [programData]);

  const transformApiData = (data: ProgramProposalResponse) => {
    if (!data) return;
    // Extract unique semesters
    const uniqueSemesters = new Map();
    data?.curriculum.courses.forEach((course) => {
      const key = `${course.semester.year}-${course.semester.sem}`;
      if (!uniqueSemesters.has(key)) {
        uniqueSemesters.set(key, {
          year: course.semester.year,
          sem: course.semester.sem,
        });
      }
    });

    // Extract unique categories
    const uniqueCategories = new Map();
    data.curriculum.courses.forEach((course) => {
      const key = course.category.code;
      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, {
          name: course.category.name,
          code: course.category.code,
        });
      }
    });

    // Extract unique courses
    const uniqueCourses = new Map();
    data.curriculum.courses.forEach((course) => {
      const key = course.course.code;
      if (!uniqueCourses.has(key)) {
        uniqueCourses.set(key, {
          code: course.course.code,
          descriptive_title: course.course.descriptive_title,
        });
      }
    });

    // Extract unique missions
    const uniqueMissions = new Map();
    data.peos.forEach((peo) => {
      peo.missions.forEach((mission) => {
        if (!uniqueMissions.has(mission.mission_no)) {
          uniqueMissions.set(mission.mission_no, {
            id: mission.mission_no,
            statement: mission.description,
          });
        }
      });
    });

    // Create PEO to Mission mappings
    const peoMissionMappings: { peo_index: number; mission_id: number }[] = [];
    data.peos.forEach((peo, peoIndex) => {
      peo.missions.forEach((mission) => {
        peoMissionMappings.push({
          peo_index: peoIndex,
          mission_id: mission.mission_no,
        });
      });
    });

    // Create GA to PEO mappings
    const gaPeoMappings: { peo_index: number; ga_id: number }[] = [];
    data.peos.forEach((peo, peoIndex) => {
      peo.graduate_attributes.forEach((ga) => {
        gaPeoMappings.push({
          peo_index: peoIndex,
          ga_id: ga.ga_no,
        });
      });
    });

    // Create PO to PEO mappings
    const poPeoMappings: { po_index: number; peo_index: number }[] = [];
    data.pos.forEach((po, poIndex) => {
      po.peos.forEach((peo) => {
        // Find the index of this PEO in the peos array
        const peoIndex = data.peos.findIndex((p) => p.id === peo.id);
        if (peoIndex !== -1) {
          poPeoMappings.push({
            po_index: poIndex,
            peo_index: peoIndex,
          });
        }
      });
    });

    // Create PO to GA mappings
    const poGaMappings: { po_index: number; ga_id: number }[] = [];
    data.pos.forEach((po, poIndex) => {
      po.graduate_attributes.forEach((ga) => {
        poGaMappings.push({
          po_index: poIndex,
          ga_id: ga.ga_no,
        });
      });
    });

    // Create Course to PO mappings
    const coursePOMappings: {
      course_code: string;
      po_code: string;
      ied: string[];
    }[] = [];
    data.curriculum.courses.forEach((course) => {
      course.po_mappings.forEach((mapping) => {
        // Find the PO by ID
        const po = data.pos.find((p) => p.id === mapping.po_id);
        if (po) {
          coursePOMappings.push({
            course_code: course.course.code,
            po_code: po.name,
            ied: [mapping.ied], // Convert single IED to array format
          });
        }
      });
    });

    // Create curriculum courses
    const curriculumCourses = data.curriculum.courses.map((course) => ({
      course_code: course.course.code,
      category_code: course.category.code,
      semester_year: course.semester.year,
      semester_name: course.semester.sem,
      units: Number.parseFloat(course.units),
    }));

    const committees =
      data.committees?.map((committee) => ({
        id: committee.id.toString(),
        name: `${committee.user.first_name} ${committee.user.last_name}`,
        email: committee.user.email,
        description: `Assigned by ${committee.assigned_by.first_name} ${committee.assigned_by.last_name}`,
      })) || [];

    // Transform committee assignments
    const committeeAssignments: Array<{
      committeeId: string;
      courseId: string;
      isCompleted: boolean;
    }> = [];

    data.committees?.forEach((committee) => {
      committee.assigned_courses.forEach((course) => {
        committeeAssignments.push({
          committeeId: committee.id.toString(),
          courseId: course.course_code,
          isCompleted: course.is_completed || false, // Default to false if not provided
        });
      });
    });

    // Set the transformed data
    setTransformedData({
      program: {
        name: data.program.name,
        abbreviation: data.program.abbreviation,
      },
      peos: data.peos.map((peo) => ({ statement: peo.statement })),
      pos: data.pos.map((po) => ({
        name: po.name,
        statement: po.statement,
      })),
      curriculum: { name: data.curriculum.name },
      semesters: Array.from(uniqueSemesters.values()),
      course_categories: Array.from(uniqueCategories.values()),
      courses: Array.from(uniqueCourses.values()),
      curriculum_courses: curriculumCourses,
      peo_mission_mappings: peoMissionMappings,
      ga_peo_mappings: gaPeoMappings,
      po_peo_mappings: poPeoMappings,
      po_ga_mappings: poGaMappings,
      course_po_mappings: coursePOMappings,
      missions: Array.from(uniqueMissions.values()),
      committees,
      committeeAssignments,
    });
  };

  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  // Get the color for a contribution level badge
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800";
      case "R":
        return "bg-green-100 text-green-800";
      case "D":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const groupedCourses: Record<string, CurriculumCourse[]> = {};

  transformedData.semesters.forEach((sem) => {
    const key = `${sem.year}-${sem.sem}`;

    // Map each course to include both course_code and code properties
    groupedCourses[key] = transformedData.curriculum_courses
      .filter(
        (cc) => cc.semester_year === sem.year && cc.semester_name === sem.sem
      )
      .map((course) => {
        // Find the full course details to get the descriptive title
        const courseDetails = transformedData.courses.find(
          (c) => c.code === course.course_code
        );

        // Return a properly formatted CurriculumCourse object
        return {
          ...course,
          code: course.course_code, // Add the code property required by the interface
          descriptive_title: courseDetails?.descriptive_title || "Unknown", // Add descriptive_title
        };
      });
  });

  const preparePEOToMissionMapping = () => {
    const rowHeaders = transformedData.peos.map((peo, index) => ({
      id: index,
      label: `PEO${index + 1}`,
      tooltip: peo.statement,
    }));

    const columnHeaders = transformedData.missions.map((mission) => ({
      id: mission.id,
      label: `M${mission.id}`,
      tooltip: mission.statement,
    }));

    const mappings = transformedData.peo_mission_mappings.map((mapping) => ({
      rowId: mapping.peo_index,
      colId: mapping.mission_id,
    }));

    return { rowHeaders, columnHeaders, mappings };
  };

  const prepareGAToPEOMapping = () => {
    // Get all unique GA IDs from the mappings
    const gaIds = [
      ...new Set(transformedData.ga_peo_mappings.map((m) => m.ga_id)),
    ];

    const rowHeaders = gaIds.map((gaId) => ({
      id: gaId,
      label: `GA${gaId}`,
      tooltip: `Graduate Attribute ${gaId}`, // You might want to fetch actual GA descriptions
    }));

    const columnHeaders = transformedData.peos.map((peo, index) => ({
      id: index,
      label: `PEO${index + 1}`,
      tooltip: peo.statement,
    }));

    const mappings = transformedData.ga_peo_mappings.map((mapping) => ({
      rowId: mapping.ga_id,
      colId: mapping.peo_index,
    }));

    return { rowHeaders, columnHeaders, mappings };
  };

  // PO GA
  const preparePOToGAMapping = () => {
    // Get all unique GA IDs from the mappings
    const gaIds = [
      ...new Set(transformedData.po_ga_mappings.map((m) => m.ga_id)),
    ];

    const rowHeaders = transformedData.pos.map((po, index) => ({
      id: index,
      label: po.name,
      tooltip: po.statement,
    }));

    const columnHeaders = gaIds.map((gaId) => ({
      id: gaId,
      label: `GA${gaId}`,
      tooltip: `Graduate Attribute ${gaId}`,
    }));

    const mappings = transformedData.po_ga_mappings.map((mapping) => ({
      rowId: mapping.po_index,
      colId: mapping.ga_id,
    }));

    return { rowHeaders, columnHeaders, mappings };
  };

  // PO PEO
  const preparePOToPEOMapping = () => {
    const rowHeaders = transformedData.pos.map((po, index) => ({
      id: index,
      label: po.name,
      tooltip: po.statement,
    }));

    const columnHeaders = transformedData.peos.map((peo, index) => ({
      id: index,
      label: `PEO${index + 1}`,
      tooltip: peo.statement,
    }));

    const mappings = transformedData.po_peo_mappings.map((mapping) => ({
      rowId: mapping.po_index,
      colId: mapping.peo_index,
    }));

    return { rowHeaders, columnHeaders, mappings };
  };

  const peoToMissionMapping = preparePEOToMissionMapping();
  const gaToPEOMapping = prepareGAToPEOMapping();
  const poToPEOMapping = preparePOToPEOMapping();
  const poToGAMapping = preparePOToGAMapping();

  // ===============  WAY LABOT  ================

  // Handle approve action
  const handleApprove = () => {
    setConfirmDialogOpen(true);
  };

  // Confirm approval
  const confirmApprove = () => {
    try {
      const result: {
        status: string;
      } = {
        status: "approved",
      };

      submitProposalReview.mutate(
        {
          proposalId,
          reviewData: result,
        },
        {
          onSuccess: () => {
            // Show success toast
            toast({
              title: "Program Approved",
              description: `The program "${transformedData.program.name}" has been approved successfully.`,
              variant: "success",
            });

            setConfirmDialogOpen(false);
            setActionTaken("approved");
          },
          onError: (error) => {
            console.error("Failed to submit review:", error);

            // Show error toast
            toast({
              title: "Approval Failed",
              description: "Failed to approve the program. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error processing approval:", error);

      // Show error toast for unexpected errors
      toast({
        title: "Unexpected Error",
        description:
          "An unexpected error occurred while processing your request.",
        variant: "destructive",
      });

      setConfirmDialogOpen(false);
    }
  };

  // Handle reject action
  // const handleReject = () => {
  //   setRejectDialogOpen(true);
  // };

  // Confirm rejection
  // const confirmReject = () => {
  //   // Here you would typically send an API request to reject the program with feedback
  //   console.log("Program rejected with feedback:", feedback);
  //   setRejectDialogOpen(false);
  //   setActionTaken("rejected");
  // };

  // Handle revise action
  const handleRevise = () => {
    setReviseDialogOpen(true);
  };

  // Add revision request
  const addRevisionRequest = () => {
    if (currentSection && currentDetails.trim()) {
      setRevisionRequests([
        ...revisionRequests,
        {
          section: currentSection,
          details: currentDetails,
          type: "section",
        },
      ]);
      setCurrentSection("");
      setCurrentDetails("");
    }
  };

  // Remove revision request
  const removeRevisionRequest = (index: number) => {
    const updatedRequests = [...revisionRequests];
    updatedRequests.splice(index, 1);
    setRevisionRequests(updatedRequests);
  };

  // Transform revision requests to match the API format
  const transformRevisionData = (requests: RevisionRequest[]) => {
    // Add explicit type definition for the result object
    const result: {
      status: string;
      department_level: Array<{ section: string; details: string }>;
      committee_level: Array<{ curriculum_course_id: number; details: string }>;
    } = {
      status: "revision",
      department_level: [],
      committee_level: [],
    };

    requests.forEach((request) => {
      if (request.type === "section") {
        // Convert kebab-case to snake_case and handle pluralization
        let sectionName = request.section.replace(/-/g, "_");

        // Add 's' to the end if it doesn't already have one
        if (
          !sectionName.endsWith("s") &&
          !["curriculum", "program_details"].includes(sectionName)
        ) {
          sectionName += "s";
        }

        result.department_level.push({
          section: sectionName,
          details: request.details,
        });
      } else if (request.type === "course") {
        result.committee_level.push({
          curriculum_course_id: parseInt(request.courseId || "0"),
          details: request.details,
        });
      }
    });

    return result;
  };

  // Confirm revision request
  const confirmRevise = () => {
    try {
      // Transform the data before sending to the API
      const apiData = transformRevisionData(revisionRequests);

      submitProposalReview.mutate(
        {
          proposalId,
          reviewData: apiData,
        },
        {
          onSuccess: () => {
            // Show success toast
            toast({
              title: "Revision Requested",
              description: `Revision requests for "${transformedData.program.name}" have been submitted successfully.`,
              variant: "success",
            });

            setReviseDialogOpen(false);
            setActionTaken("revision");
          },
          onError: (error) => {
            console.error("Failed to submit revision:", error);

            // Show error toast
            toast({
              title: "Revision Request Failed",
              description:
                "Failed to submit revision requests. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error processing revision request:", error);

      // Show error toast for unexpected errors
      toast({
        title: "Unexpected Error",
        description:
          "An unexpected error occurred while processing your revision request.",
        variant: "destructive",
      });

      setReviseDialogOpen(false);
    }
  };

  // Prepare courses for the ReviseDialog
  const coursesForRevision =
    programData?.curriculum.courses.map((course) => ({
      id: course.id.toString(),
      code: course.course.code,
      descriptive_title: course.course.descriptive_title,
    })) || [];

  // Show loading state
  if (proposalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-lg">Loading program data...</p>
        </div>
      </div>
    );
  }

  // Show error state

  if (proposalError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">
            {proposalError instanceof Error
              ? proposalError.message
              : "Failed to load program data"}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      {/* Program Header */}
      <ProgramHeader
        programName={transformedData.program.name}
        programAbbreviation={transformedData.program.abbreviation}
        actionTaken={actionTaken}
        onApprove={handleApprove}
        onRevise={handleRevise}
        // onReject={handleReject}
        role="Dean"
      />

      {/* Program Summary */}
      <ProgramSummary
        programName={transformedData.program.name}
        programAbbreviation={transformedData.program.abbreviation}
        curriculumName={transformedData.curriculum.name}
        totalCourses={transformedData.curriculum_courses.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <PEOSection peos={transformedData.peos} />
          <POSection pos={transformedData.pos} />
          <CourseCategories categories={transformedData.course_categories} />
        </TabsContent>
        {/* Curriculum */}
        <TabsContent value="curriculum" className="space-y-6">
          <ProgramStructure
            semesters={transformedData.semesters}
            getSemesterName={getSemesterName}
          />
          <CurriculumCourses
            groupedCourses={groupedCourses}
            courses={transformedData.courses}
            categories={transformedData.course_categories}
            getSemesterName={getSemesterName}
          />
        </TabsContent>
        {/* Mappings */}
        <TabsContent value="mappings" className="space-y-6">
          <MappingTable
            title="PEO to Mission Mapping"
            rowHeaders={peoToMissionMapping.rowHeaders}
            columnHeaders={peoToMissionMapping.columnHeaders}
            mappings={peoToMissionMapping.mappings}
          />

          <MappingTable
            title="Graduate Attributes to PEO Mapping"
            rowHeaders={gaToPEOMapping.rowHeaders}
            columnHeaders={gaToPEOMapping.columnHeaders}
            mappings={gaToPEOMapping.mappings}
          />

          <MappingTable
            title="PO to PEO Mapping"
            rowHeaders={poToPEOMapping.rowHeaders}
            columnHeaders={poToPEOMapping.columnHeaders}
            mappings={poToPEOMapping.mappings}
          />

          <MappingTable
            title="PO to Graduate Attribute Mapping"
            rowHeaders={poToGAMapping.rowHeaders}
            columnHeaders={poToGAMapping.columnHeaders}
            mappings={poToGAMapping.mappings}
          />

          <CoursePOMapping
            courses={transformedData.courses}
            pos={transformedData.pos}
            semesters={transformedData.semesters}
            curriculumCourses={transformedData.curriculum_courses}
            coursePOMappings={transformedData.course_po_mappings}
            getSemesterName={getSemesterName}
            getLevelBadgeColor={getLevelBadgeColor}
          />
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {isCoursesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading course details...</span>
            </div>
          ) : (
            <CourseDetailsTabs
              courses={programData?.curriculum?.courses || []}
              courseDetailsMap={
                dynamicCourseDetailsMap // Fallback to sample data if API data not available
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ApproveDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmApprove}
      />

      {/* <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        feedback={feedback}
        setFeedback={setFeedback}
        onConfirm={confirmReject}
      /> */}

      <ReviseDialog
        open={reviseDialogOpen}
        onOpenChange={setReviseDialogOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        currentDetails={currentDetails}
        setCurrentDetails={setCurrentDetails}
        revisionRequests={revisionRequests}
        addRevisionRequest={addRevisionRequest}
        removeRevisionRequest={removeRevisionRequest}
        onConfirm={confirmRevise}
        // Add new props for course-specific revisions
        courses={coursesForRevision}
        currentCourse={currentCourse}
        setCurrentCourse={setCurrentCourse}
      />
    </main>
  );
}
