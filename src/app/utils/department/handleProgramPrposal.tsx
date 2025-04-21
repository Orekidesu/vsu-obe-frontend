import { toast } from "@/hooks/use-toast";
import { ProgramProposal } from "@/types/model/ProgramProposal";
import { UseMutationResult } from "@tanstack/react-query";
import { APIError, handleMutationError } from "../errorHandler";

// Define types for the full proposal payload

interface FullProgramProposalPayload {
  program: {
    name: string;
    abbreviation: string;
  };
  peos: Array<{ statement: string }>;
  peo_mission_mappings: Array<{ peo_index: number; mission_id: number }>;
  ga_peo_mappings: Array<{ peo_index: number; ga_id: number }>;
  pos: Array<{ name: string; statement: string }>;
  po_peo_mappings: Array<{ po_index: number; peo_index: number }>;
  po_ga_mappings: Array<{ po_index: number; ga_id: number }>;
  curriculum: { name: string };
  semesters: Array<{ year: number; sem: string }>;
  course_categories: Array<{ name: string; code: string }>;
  courses: Array<{ code: string; descriptive_title: string }>;
  curriculum_courses: Array<{
    course_code: string;
    category_code: string;
    semester_year: number;
    semester_name: string;
    units: number;
  }>;
  course_po_mappings: Array<{
    course_code: string;
    po_code: string;
    ird: string[];
  }>;
}
// Define form data interface for better type safety
interface WizardFormData {
  programName: string;
  programAbbreviation: string;
  peos: Array<{ id: string; statement: string }>;
  programOutcomes: Array<{ id: string; name: string; statement: string }>;
  peoToMissionMappings: Array<{ peoId: string; missionId: number }>;
  gaToPEOMappings: Array<{ peoId: string; gaId: number }>;
  poToPEOMappings: Array<{ poId: string; peoId: string }>;
  poToGAMappings: Array<{ poId: string; gaId: number }>;
  curriculumName: string;
  yearSemesters: Array<{ id: string; year: number; semester: string }>;
  courseCategories: Array<{ id: string; name: string; code: string }>;
  curriculumCourses: Array<{
    id: string;
    code: string;
    title: string;
    yearSemesterId: string;
    categoryId: string;
    units: number;
  }>;
  courseToPOMappings: Array<{
    courseId: string;
    poId: string;
    contributionLevels: string[];
  }>;
}

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

// Full program proposal
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
  } = formData;

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
  };
};
