import { toast } from "@/hooks/use-toast";
import { ProgramProposal } from "@/types/model/ProgramProposal";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";
import {
  FullProgramProposalPayload,
  WizardFormData,
} from "./programProposalPayload"; // Import from shared file
// Define types for the full proposal payload

// create
export const createProgramPrposalHandler = async (
  createProgramProposalMutation: UseMutationResult<
    void,
    APIError,
    Partial<ProgramProposal>,
    unknown
  >,
  data: Partial<ProgramProposal>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    createProgramProposalMutation.mutate(data, {
      onError: (error) =>
        reject(
          handleMutationError(error, "Failed to create program", setFormError)
        ),
      onSuccess: () => {
        setFormError(null);
        resolve();
      },
    });
  });
};
// get
export const getProgramProposalHandler = async (
  getProgramProposal: (id: number) => Promise<ProgramProposal>,
  id: number
): Promise<ProgramProposal | null> => {
  try {
    const programProposalDetails = await getProgramProposal(id);
    return programProposalDetails;
  } catch (error) {
    toast({
      description: "Failed to get Program proposal details",
      variant: "destructive",
    });
    console.error("Error fetching Program proposal details:", error);
    return null;
  }
};
//update
export const updateProgramProposalHandler = async (
  updateProgramProposalMutation: UseMutationResult<
    void,
    APIError,
    { id: number; updatedData: Partial<ProgramProposal> },
    unknown
  >,
  data: Partial<ProgramProposal>,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (data.id) {
      updateProgramProposalMutation.mutate(
        { id: data.id, updatedData: data },
        {
          onError: (error) =>
            reject(
              handleMutationError(
                error,
                "Failed to update program",
                setFormError
              )
            ),
          onSuccess: () => {
            setFormError(null);
            resolve();
          },
        }
      );
    }
  });
};

//delete
export const deleteProgramProposalHandler = async (
  deleteProgramProposal: UseMutationResult<void, APIError, number, unknown>,
  id: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    deleteProgramProposal.mutate(id, {
      onError: (error) => {
        const errorMessage =
          error?.message || "Failed to delete program proposal";
        toast({ description: error.message, variant: "destructive" });
        reject(new Error(errorMessage));
      },
      onSuccess: () => {
        toast({
          description: "Program proposal Deleted Successfully",
          variant: "success",
        });
        resolve();
      },
    });
  });
};

// Submit full program proposal
export const submitFullProgramProposalHandler = async (
  submitFullProposalMutation: UseMutationResult<
    void,
    APIError,
    FullProgramProposalPayload,
    unknown
  >,
  data: FullProgramProposalPayload,
  setFormError: (error: Record<string, string[]> | string | null) => void
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    submitFullProposalMutation.mutate(data, {
      onError: (error) => {
        toast({
          description: "Failed to submit program proposal",
          variant: "destructive",
        });
        reject(
          handleMutationError(
            error,
            "Failed to submit full program proposal",
            setFormError
          )
        );
      },
      onSuccess: () => {
        toast({
          description: "Program proposal submitted successfully",
          variant: "success",
        });
        setFormError(null);
        resolve();
      },
    });
  });
};

// Create full program proposal payload
export const createFullProgramProposalPayload = (
  formData: WizardFormData
): FullProgramProposalPayload => {
  const {
    programName,
    programAbbreviation,
    peos,
    programOutcomes,
    peoToMissionMappings,
    gaToPEOMappings,
    poToPEOMappings,
    poToGAMappings,
    curriculumName,
    yearSemesters,
    courseCategories,
    curriculumCourses,
    courseToPOMappings,
    selectedCommittees,
    committeeCourseAssignments,
  } = formData;

  const committeeAssignmentMap = new Map<number, string[]>();

  // Initialize maps for each selected committee
  selectedCommittees.forEach((committeeId) => {
    committeeAssignmentMap.set(committeeId, []);
  });

  // Group courses by committee ID
  committeeCourseAssignments.forEach((assignment) => {
    const courseCode =
      curriculumCourses.find((course) => course.id === assignment.courseId)
        ?.code || "";

    if (courseCode) {
      const existingCodes =
        committeeAssignmentMap.get(assignment.committeeId) || [];
      committeeAssignmentMap.set(assignment.committeeId, [
        ...existingCodes,
        courseCode,
      ]);
    }
  });

  // Convert the map to the required format
  const committeeAssignments = Array.from(committeeAssignmentMap.entries())
    .map(([committeeId, courseCodes]) => ({
      user_id: committeeId,
      course_codes: courseCodes,
    }))
    .filter((assignment) => assignment.course_codes.length > 0);

  return {
    program: {
      name: programName,
      abbreviation: programAbbreviation,
    },
    peos: peos.map((peo) => ({
      statement: peo.statement,
    })),
    peo_mission_mappings: peoToMissionMappings.map((mapping) => ({
      peo_index: peos.findIndex((peo) => peo.id === mapping.peoId),
      mission_id: mapping.missionId,
    })),
    ga_peo_mappings: gaToPEOMappings.map((mapping) => ({
      peo_index: peos.findIndex((peo) => peo.id === mapping.peoId),
      ga_id: mapping.gaId,
    })),
    pos: programOutcomes.map((po) => ({
      name: po.name,
      statement: po.statement,
    })),
    po_peo_mappings: poToPEOMappings.map((mapping) => ({
      po_index: programOutcomes.findIndex((po) => po.id === mapping.poId),
      peo_index: peos.findIndex((peo) => peo.id === mapping.peoId),
    })),
    po_ga_mappings: poToGAMappings.map((mapping) => ({
      po_index: programOutcomes.findIndex((po) => po.id === mapping.poId),
      ga_id: mapping.gaId,
    })),
    curriculum: {
      name: curriculumName,
    },
    semesters: yearSemesters.map((ys) => ({
      year: ys.year,
      sem: ys.semester,
    })),
    course_categories: courseCategories.map((category) => ({
      name: category.name,
      code: category.code,
    })),
    courses: curriculumCourses.map((course) => ({
      code: course.code,
      descriptive_title: course.title,
    })),
    curriculum_courses: curriculumCourses.map((course) => {
      const yearSemester = yearSemesters.find(
        (ys) => ys.id === course.yearSemesterId
      );
      const category = courseCategories.find(
        (cat) => cat.id === course.categoryId
      );

      return {
        course_code: course.code,
        category_code: category?.code || "",
        semester_year: yearSemester?.year || 0,
        semester_name: yearSemester?.semester || "",
        units: course.units,
      };
    }),
    course_po_mappings: courseToPOMappings.map((mapping) => {
      const course = curriculumCourses.find((c) => c.id === mapping.courseId);
      const po = programOutcomes.find((p) => p.id === mapping.poId);

      return {
        course_code: course?.code || "",
        po_code: po?.name || "",
        ird: mapping.contributionLevels,
      };
    }),
    committees: selectedCommittees.map((committeeId) => ({
      user_id: committeeId,
    })),
    committee_course_assignments: committeeAssignments,
  };
};
