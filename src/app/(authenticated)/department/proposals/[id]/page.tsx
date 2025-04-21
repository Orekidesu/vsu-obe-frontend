"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ProgramHeader } from "@/components/commons/program-details/program-header";
import { ProgramSummary } from "@/components/commons/program-details/program-summary";
import { PEOSection } from "@/components/commons/program-details/peo-section";
import { POSection } from "@/components/commons/program-details/po-section";
import { CourseCategories } from "@/components/commons/program-details/course-category";
import { ProgramStructure } from "@/components/commons/program-details/program-structure";
import { CurriculumCourses } from "@/components/commons/program-details/curriculum-courses";
import { MappingTable } from "@/components/commons/program-details/mapping-table";
import { ApproveDialog } from "@/components/commons/program-details/approve-dialog";
import { RejectDialog } from "@/components/commons/program-details/reject-dialog";
import { ReviseDialog } from "@/components/commons/program-details/revise-dialog";
import { CoursePOMapping } from "@/components/commons/program-details/course-po-mapping";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import { useAuth } from "@/hooks/useAuth";

// Import custom hooks and types
import useProgramProposals from "@/hooks/department/useProgramProposal";
import type { ProgramProposalResponse } from "@/types/model/ProgramProposal";

interface CurriculumCourse {
  course_code: string;
  category_code: string;
  semester_year: number;
  semester_name: string;
  units: number;
  code: string;
  descriptive_title: string;
}

export default function PendingProgramReviewPage() {
  const params = useParams();
  const proposalId = Number(params.id);
  const { session } = useAuth();
  const role = (session as Session)?.Role;

  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviseDialogOpen, setReviseDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [revisionRequests, setRevisionRequests] = useState<
    { section: string; details: string }[]
  >([]);
  const [currentSection, setCurrentSection] = useState("");
  const [currentDetails, setCurrentDetails] = useState("");
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  // Get program proposal hooks
  const { getProgramProposal, updateProgramProposal } = useProgramProposals();

  // Fetch program proposal data
  const {
    data: programData,
    error,
    isLoading,
  } = useQuery({
    ...getProgramProposal(proposalId),
    enabled: !!proposalId,
  });

  console.log("the fetched data:", programData);

  // Transformed data for components
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
      ird: string[];
    }[],
    missions: [] as { id: number; statement: string }[],
  });

  // Transform API data when it's loaded
  useEffect(() => {
    if (
      programData &&
      programData.curriculum &&
      programData.peos &&
      programData.pos
    ) {
      transformApiData(programData);
    }
  }, [programData]);

  // Transform API data to the format expected by our components
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
      ird: string[];
    }[] = [];
    data.curriculum.courses.forEach((course) => {
      course.po_mappings.forEach((mapping) => {
        // Find the PO by ID
        const po = data.pos.find((p) => p.id === mapping.po_id);
        if (po) {
          coursePOMappings.push({
            course_code: course.course.code,
            po_code: po.name,
            ird: [mapping.ird], // Convert single IRD to array format
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

  // Group curriculum courses by year-semester
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

  // Handle approve action
  const handleApprove = () => {
    setConfirmDialogOpen(true);
  };

  // Confirm approval
  const confirmApprove = async () => {
    try {
      await updateProgramProposal.mutateAsync({
        id: proposalId,
        updatedData: { status: "approved" },
      });
      setConfirmDialogOpen(false);
      setActionTaken("approved");
    } catch (error) {
      console.error("Error approving program:", error);
    }
  };

  // Handle reject action
  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  // Confirm rejection
  const confirmReject = async () => {
    try {
      await updateProgramProposal.mutateAsync({
        id: proposalId,
        updatedData: { status: "rejected", comment: feedback },
      });
      setRejectDialogOpen(false);
      setActionTaken("rejected");
    } catch (error) {
      console.error("Error rejecting program:", error);
    }
  };

  // Handle revise action
  const handleRevise = () => {
    setReviseDialogOpen(true);
  };

  // Add revision request
  const addRevisionRequest = () => {
    if (currentSection && currentDetails) {
      setRevisionRequests([
        ...revisionRequests,
        { section: currentSection, details: currentDetails },
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

  // Confirm revision request
  const confirmRevise = async () => {
    try {
      // Format the revision requests into a comment
      const revisionComment = revisionRequests
        .map((req) => `${req.section}: ${req.details}`)
        .join("\n\n");

      await updateProgramProposal.mutateAsync({
        id: proposalId,
        updatedData: { status: "revision", comment: revisionComment },
      });
      setReviseDialogOpen(false);
      setActionTaken("revision");
    } catch (error) {
      console.error("Error requesting revisions:", error);
    }
  };

  // Prepare data for mapping tables
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

  // Get mapping data
  const peoToMissionMapping = preparePEOToMissionMapping();
  const gaToPEOMapping = prepareGAToPEOMapping();
  const poToPEOMapping = preparePOToPEOMapping();
  const poToGAMapping = preparePOToGAMapping();
  // const courseToPOMapping = prepareCourseToPOMapping();

  // Show loading state
  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
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
      <ProgramHeader
        programName={transformedData.program.name}
        programAbbreviation={transformedData.program.abbreviation}
        actionTaken={actionTaken || programData?.status || null}
        onApprove={handleApprove}
        onRevise={handleRevise}
        onReject={handleReject}
        role={role}
      />

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
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PEOSection peos={transformedData.peos} />
          <POSection pos={transformedData.pos} />
          <CourseCategories categories={transformedData.course_categories} />
        </TabsContent>

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
            title="PO to Graduate Attributes Mapping"
            rowHeaders={poToGAMapping.rowHeaders}
            columnHeaders={poToGAMapping.columnHeaders}
            mappings={poToGAMapping.mappings}
          />

          <MappingTable
            title="PO to PEO Mapping"
            rowHeaders={poToPEOMapping.rowHeaders}
            columnHeaders={poToPEOMapping.columnHeaders}
            mappings={poToPEOMapping.mappings}
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
      </Tabs>

      {/* Dialogs */}
      <ApproveDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmApprove}
      />

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        feedback={feedback}
        setFeedback={setFeedback}
        onConfirm={confirmReject}
      />

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
      />
    </main>
  );
}
