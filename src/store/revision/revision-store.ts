import { create } from "zustand";
import { transformProposalData } from "./sample-data/data";
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

// Define the sections that can be revised
export type RevisionSection =
  | "program"
  | "peos"
  | "peo_mission_mappings"
  | "ga_peo_mappings"
  | "pos"
  | "po_peo_mappings"
  | "po_ga_mappings"
  | "curriculum"
  | "course_categories"
  | "curriculum_courses"
  | "course_po_mappings";

export interface PEO {
  id: number | string;
  statement: string;
}
// Define the Mission type
export interface Mission {
  id: number;
  mission_no: number;
  description: string;
}
// Define the Graduate Attribute type
export interface GraduateAttribute {
  id: number;
  ga_no: number;
  name: string;
  description: string;
}

// Define the PEO to Mission mapping type
export interface PEOMissionMapping {
  peo_id: number | string;
  mission_id: number;
}

// Define the GA to PEO mapping type
export interface GAPEOMapping {
  ga_id: number;
  peo_id: number | string;
}

// Define the Program Outcome type
export interface PO {
  id: number | string;
  name: string;
  statement: string;
}

// Define the PO to PEO mapping type
export interface POPEOMapping {
  po_id: number | string;
  peo_id: number | string;
}

// Define the PO to GA Mapping type

export interface POGAMapping {
  po_id: number | string;
  ga_id: number;
}

// Define the Course Category type
export interface CourseCategory {
  id: number | string;
  name: string;
  code: string;
}

// Define the Curriculum Course type
export interface CurriculumCourse {
  id: number | string;
  course_id: number;
  course_category_id: number | string;
  category_code: string;
  semester_id: number;
  unit: string;
  course_code?: string;
  course_title?: string;
}

export interface CoursePOMapping {
  curriculum_course_id: number | string;
  po_id: number | string;
  ied: string[];
}

// Define the store state
interface RevisionState {
  // Original data
  originalData: ProgramProposalResponse | null;

  // Transformed data
  program: {
    name: string;
    abbreviation: string;
  };

  peos: PEO[];

  peo_mission_mappings: PEOMissionMapping[];

  ga_peo_mappings: GAPEOMapping[];

  pos: PO[];

  po_peo_mappings: POPEOMapping[];

  po_ga_mappings: POGAMapping[];

  curriculum: {
    name: string;
  };
  course_categories: CourseCategory[];

  curriculum_courses: CurriculumCourse[];

  course_po_mappings: CoursePOMapping[];

  // Track which sections have been modified
  modifiedSections: Set<RevisionSection>;
  // Check if a section is modified
  isModified: (section: RevisionSection) => boolean;

  // Actions
  initializeData: (data: ProgramProposalResponse) => void;
  updateProgram: (program: { name: string; abbreviation: string }) => void;

  // PEO actions
  updatePEO: (id: number | string, statement: string) => void;
  addPEO: (statement: string) => void;
  removePEO: (id: number | string) => void;

  // PEO to Mission mapping actions
  togglePEOMissionMapping: (
    peo_id: number | string,
    mission_id: number
  ) => void;
  updatePEOMissionMappings: (mappings: PEOMissionMapping[]) => void;

  // GA to PEO mapping actions
  toggleGAPEOMapping: (ga_id: number, peo_id: number | string) => void;
  updateGAPEOMappings: (mappings: GAPEOMapping[]) => void;

  // PO actions
  updatePO: (
    id: number | string,
    po: { name: string; statement: string }
  ) => void;
  addPO: (po: { name: string; statement: string }) => void;
  removePO: (id: number | string) => void;

  // PO to PEO mapping actions
  togglePOPEOMapping: (po_id: number | string, peo_id: number | string) => void;
  updatePOPEOMappings: (mappings: POPEOMapping[]) => void;

  // PO to GA mapping  actions
  togglePOGAMapping: (po_id: number | string, ga_id: number) => void;
  updatePOGAMappings: (mappings: POGAMapping[]) => void;

  // Update curriculum
  updateCurriculum: (name: string) => void;

  // Course category actions
  addCourseCategory: (name: string, code: string) => void;
  updateCourseCategory: (
    id: number | string,
    name: string,
    code: string
  ) => void;
  removeCourseCategory: (id: number | string) => void;
  removeCategoryAndReassign: (
    categoryId: number | string,
    replacementCategoryId: number | string
  ) => void;

  // Curriculum course actions
  addCurriculumCourse: (course: Omit<CurriculumCourse, "id">) => void;
  updateCurriculumCourse: (
    id: number | string,
    updates: Partial<Omit<CurriculumCourse, "id">>
  ) => void;
  removeCurriculumCourse: (id: number | string) => void;

  // Course to PO mapping actions
  addCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string,
    levels: string[]
  ) => void;
  updateCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string,
    levels: string[]
  ) => void;
  removeCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string
  ) => void;

  //Other actions
  resetSection: (section: RevisionSection) => void;
  submitRevisions: () => Promise<boolean>;
}

// Create the store
export const useRevisionStore = create<RevisionState>((set, get) => ({
  // Initialize with empty data
  originalData: null,
  program: { name: "", abbreviation: "" },
  peos: [],
  peo_mission_mappings: [],
  ga_peo_mappings: [],
  pos: [],
  po_peo_mappings: [],
  po_ga_mappings: [],
  curriculum: { name: "" },
  course_categories: [],
  curriculum_courses: [],
  course_po_mappings: [],
  modifiedSections: new Set<RevisionSection>(),
  // Check if a section is modified
  isModified: (section) => {
    return get().modifiedSections.has(section);
  },

  // Initialize data from API response
  initializeData: (data: ProgramProposalResponse) => {
    const transformedData = transformProposalData(data);
    set({
      originalData: data,
      ...transformedData,
      modifiedSections: new Set<RevisionSection>(),
    });
  },

  // Update program details
  updateProgram: (program) => {
    set((state) => {
      // Create a new Set to avoid mutation
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("program");

      return {
        program,
        modifiedSections,
      };
    });
  },
  // Update a PEO
  updatePEO: (id, statement) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      const updatedPEOs = state.peos.map((peo) =>
        peo.id === id ? { ...peo, statement } : peo
      );

      return {
        peos: updatedPEOs,
        modifiedSections,
      };
    });
  },

  // Add a new PEO
  addPEO: (statement) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      // Generate a temporary ID for the new PEO
      // In a real app, the server would assign a permanent ID
      const newId = `${Date.now()}${Math.floor(Math.random() * 500)}`;

      return {
        peos: [...state.peos, { id: newId, statement }],
        modifiedSections,
      };
    });
  },

  // Remove a PEO
  removePEO: (id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peos");

      // Remove the PEO
      const updatedPEOs = state.peos.filter((peo) => peo.id !== id);

      // Also remove any mappings that reference this PEO
      const updatedPEOMissionMappings = state.peo_mission_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      const updatedGAPEOMappings = state.ga_peo_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      const updatedPOPEOMappings = state.po_peo_mappings.filter(
        (mapping) => mapping.peo_id !== id
      );

      // Update related sections if they've been modified
      if (
        state.peo_mission_mappings.length !== updatedPEOMissionMappings.length
      ) {
        modifiedSections.add("peo_mission_mappings");
      }

      if (state.ga_peo_mappings.length !== updatedGAPEOMappings.length) {
        modifiedSections.add("ga_peo_mappings");
      }

      if (state.po_peo_mappings.length !== updatedPOPEOMappings.length) {
        modifiedSections.add("po_peo_mappings");
      }

      return {
        peos: updatedPEOs,
        peo_mission_mappings: updatedPEOMissionMappings,
        ga_peo_mappings: updatedGAPEOMappings,
        po_peo_mappings: updatedPOPEOMappings,
        modifiedSections,
      };
    });
  },
  // Toggle a PEO to Mission mapping
  togglePEOMissionMapping: (peo_id, mission_id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peo_mission_mappings");

      // Check if the mapping already exists
      const existingMapping = state.peo_mission_mappings.find(
        (mapping) =>
          mapping.peo_id === peo_id && mapping.mission_id === mission_id
      );

      let updatedMappings;

      if (existingMapping) {
        // Remove the mapping if it exists
        updatedMappings = state.peo_mission_mappings.filter(
          (mapping) =>
            !(mapping.peo_id === peo_id && mapping.mission_id === mission_id)
        );
      } else {
        // Add the mapping if it doesn't exist
        updatedMappings = [
          ...state.peo_mission_mappings,
          { peo_id, mission_id },
        ];
      }

      return {
        peo_mission_mappings: updatedMappings,
        modifiedSections,
      };
    });
  },

  // Update all PEO to Mission mappings at once
  updatePEOMissionMappings: (mappings) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("peo_mission_mappings");

      return {
        peo_mission_mappings: mappings,
        modifiedSections,
      };
    });
  },

  // Toggle a GA to PEO mapping
  toggleGAPEOMapping: (ga_id, peo_id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("ga_peo_mappings");

      // Check if the mapping already exists
      const existingMapping = state.ga_peo_mappings.find(
        (mapping) => mapping.ga_id === ga_id && mapping.peo_id === peo_id
      );

      let updatedMappings;

      if (existingMapping) {
        // Remove the mapping if it exists
        updatedMappings = state.ga_peo_mappings.filter(
          (mapping) => !(mapping.ga_id === ga_id && mapping.peo_id === peo_id)
        );
      } else {
        // Add the mapping if it doesn't exist
        updatedMappings = [...state.ga_peo_mappings, { ga_id, peo_id }];
      }

      return {
        ga_peo_mappings: updatedMappings,
        modifiedSections,
      };
    });
  },

  // Update all GA to PEO mappings at once
  updateGAPEOMappings: (mappings) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("ga_peo_mappings");

      return {
        ga_peo_mappings: mappings,
        modifiedSections,
      };
    });
  },
  // Update a PO
  updatePO: (id, po) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("pos");

      const updatedPOs = state.pos.map((existingPO) =>
        existingPO.id === id ? { ...existingPO, ...po } : existingPO
      );

      return {
        pos: updatedPOs,
        modifiedSections,
      };
    });
  },

  // Add a new PO
  addPO: (po) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("pos");

      // Generate a temporary ID for the new PO
      const newId = `${Date.now()}${Math.floor(Math.random() * 5000)}`;

      return {
        pos: [...state.pos, { id: newId, ...po }],
        modifiedSections,
      };
    });
  },

  // Remove a PO
  removePO: (id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("pos");

      // Remove the PO
      const updatedPOs = state.pos.filter((po) => po.id !== id);

      // Also remove any mappings that reference this PO
      const updatedPOPEOMappings = state.po_peo_mappings.filter(
        (mapping) => mapping.po_id !== id
      );
      const updatedPOGAMappings = state.po_ga_mappings.filter(
        (mapping) => mapping.po_id !== id
      );
      const updatedCoursePOMappings = state.course_po_mappings.filter(
        (mapping) => mapping.po_id !== id
      );

      // Update related sections if they've been modified
      if (state.po_peo_mappings.length !== updatedPOPEOMappings.length) {
        modifiedSections.add("po_peo_mappings");
      }

      if (state.po_ga_mappings.length !== updatedPOGAMappings.length) {
        modifiedSections.add("po_ga_mappings");
      }

      if (state.course_po_mappings.length !== updatedCoursePOMappings.length) {
        modifiedSections.add("course_po_mappings");
      }

      return {
        pos: updatedPOs,
        po_peo_mappings: updatedPOPEOMappings,
        po_ga_mappings: updatedPOGAMappings,
        course_po_mappings: updatedCoursePOMappings,
        modifiedSections,
      };
    });
  },
  // Toggle a PO to PEO mapping
  togglePOPEOMapping: (po_id, peo_id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("po_peo_mappings");

      // Check if the mapping already exists
      const existingMapping = state.po_peo_mappings.find(
        (mapping) => mapping.po_id === po_id && mapping.peo_id === peo_id
      );

      let updatedMappings;

      if (existingMapping) {
        // Remove the mapping if it exists
        updatedMappings = state.po_peo_mappings.filter(
          (mapping) => !(mapping.po_id === po_id && mapping.peo_id === peo_id)
        );
      } else {
        // Add the mapping if it doesn't exist
        updatedMappings = [...state.po_peo_mappings, { po_id, peo_id }];
      }

      return {
        po_peo_mappings: updatedMappings,
        modifiedSections,
      };
    });
  },

  // Update all PO to PEO mappings at once
  updatePOPEOMappings: (mappings) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("po_peo_mappings");

      return {
        po_peo_mappings: mappings,
        modifiedSections,
      };
    });
  },
  // Toggle a PO to GA mapping
  togglePOGAMapping: (po_id, ga_id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("po_ga_mappings");

      // Check if the mapping already exists
      const existingMapping = state.po_ga_mappings.find(
        (mapping) => mapping.po_id === po_id && mapping.ga_id === ga_id
      );

      let updatedMappings;

      if (existingMapping) {
        // Remove the mapping if it exists
        updatedMappings = state.po_ga_mappings.filter(
          (mapping) => !(mapping.po_id === po_id && mapping.ga_id === ga_id)
        );
      } else {
        // Add the mapping if it doesn't exist
        updatedMappings = [...state.po_ga_mappings, { po_id, ga_id }];
      }

      return {
        po_ga_mappings: updatedMappings,
        modifiedSections,
      };
    });
  },

  // Update all PO to GA mappings at once
  updatePOGAMappings: (mappings) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("po_ga_mappings");

      return {
        po_ga_mappings: mappings,
        modifiedSections,
      };
    });
  },
  // Update curriculum
  updateCurriculum: (name: string) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("curriculum");

      return {
        curriculum: { name },
        modifiedSections,
      };
    });
  },
  // Add a new course category
  addCourseCategory: (name: string, code: string) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_categories");

      // Generate a temporary ID for the new category
      const newId = `${Date.now()}${Math.floor(Math.random() * 2500)}`;

      return {
        course_categories: [
          ...state.course_categories,
          { id: newId, name, code },
        ],
        modifiedSections,
      };
    });
  },

  // Update a course category
  updateCourseCategory: (id: number | string, name: string, code: string) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_categories");

      const updatedCategories = state.course_categories.map((cat) =>
        cat.id === id ? { ...cat, name, code } : cat
      );

      // Also update the category code in curriculum courses
      const updatedCurriculumCourses = state.curriculum_courses.map((course) =>
        course.course_category_id === id
          ? { ...course, category_code: code }
          : course
      );

      // If curriculum courses were updated, mark that section as modified too
      if (
        JSON.stringify(state.curriculum_courses) !==
        JSON.stringify(updatedCurriculumCourses)
      ) {
        modifiedSections.add("curriculum_courses");
      }

      return {
        course_categories: updatedCategories,
        curriculum_courses: updatedCurriculumCourses,
        modifiedSections,
      };
    });
  },

  // Remove a course category
  removeCourseCategory: (id: number | string) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_categories");

      // Remove the category
      const updatedCategories = state.course_categories.filter(
        (cat) => cat.id !== id
      );

      // Check if any curriculum courses use this category
      const affectedCourses = state.curriculum_courses.filter(
        (course) => course.course_category_id === id
      );

      if (affectedCourses.length > 0) {
        // In a real app, you might want to handle this differently
        // For now, we'll just mark the curriculum_courses section as modified
        modifiedSections.add("curriculum_courses");
      }

      return {
        course_categories: updatedCategories,
        modifiedSections,
      };
    });
  },

  // Remove category and reassign
  removeCategoryAndReassign: (
    categoryId: number | string,
    replacementCategoryId: number | string
  ) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_categories");
      modifiedSections.add("curriculum_courses");

      // Remove the category
      const updatedCategories = state.course_categories.filter(
        (cat) => cat.id !== categoryId
      );

      // Get the replacement category's code
      const replacementCategory = state.course_categories.find(
        (cat) => cat.id === replacementCategoryId
      );

      if (!replacementCategory) return state;

      // Update all affected courses with the new category
      const updatedCourses = state.curriculum_courses.map((course) =>
        course.course_category_id === categoryId
          ? {
              ...course,
              course_category_id: replacementCategoryId,
              category_code: replacementCategory.code,
            }
          : course
      );

      return {
        course_categories: updatedCategories,
        curriculum_courses: updatedCourses,
        modifiedSections,
      };
    });
  },
  // Add a new curriculum course
  addCurriculumCourse: (course: Omit<CurriculumCourse, "id">) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("curriculum_courses");

      // Generate a temporary ID for the new course
      const newId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

      return {
        curriculum_courses: [
          ...state.curriculum_courses,
          { id: newId, ...course },
        ],
        modifiedSections,
      };
    });
  },

  // Update a curriculum course
  updateCurriculumCourse: (id, updates) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("curriculum_courses");

      const updatedCourses = state.curriculum_courses.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      );

      return {
        curriculum_courses: updatedCourses,
        modifiedSections,
      };
    });
  },

  // Remove a curriculum course
  removeCurriculumCourse: (id) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("curriculum_courses");

      // Remove the course
      const updatedCourses = state.curriculum_courses.filter(
        (course) => course.id !== id
      );

      // Also remove any course to PO mappings that reference this course
      const updatedCoursePOMappings = state.course_po_mappings.filter(
        (mapping) => mapping.curriculum_course_id !== id
      );

      // If course to PO mappings were updated, mark that section as modified too
      if (state.course_po_mappings.length !== updatedCoursePOMappings.length) {
        modifiedSections.add("course_po_mappings");
      }

      return {
        curriculum_courses: updatedCourses,
        course_po_mappings: updatedCoursePOMappings,
        modifiedSections,
      };
    });
  },
  // Add a new course to PO mapping
  addCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string,
    levels: string[]
  ) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_po_mappings");

      return {
        course_po_mappings: [
          ...state.course_po_mappings,
          {
            curriculum_course_id: curriculumCourseId,
            po_id: poId,
            ied: levels,
          },
        ],
        modifiedSections,
      };
    });
  },

  // Update an existing course to PO mapping
  updateCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string,
    levels: string[]
  ) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_po_mappings");

      return {
        course_po_mappings: state.course_po_mappings.map((mapping) =>
          mapping.curriculum_course_id === curriculumCourseId &&
          mapping.po_id === poId
            ? { ...mapping, ied: levels }
            : mapping
        ),
        modifiedSections,
      };
    });
  },

  // Remove a course to PO mapping
  removeCourseToPOMapping: (
    curriculumCourseId: number | string,
    poId: number | string
  ) => {
    set((state) => {
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.add("course_po_mappings");

      return {
        course_po_mappings: state.course_po_mappings.filter(
          (mapping) =>
            !(
              mapping.curriculum_course_id === curriculumCourseId &&
              mapping.po_id === poId
            )
        ),
        modifiedSections,
      };
    });
  },

  // Reset a section to its original state
  resetSection: (section) => {
    set((state) => {
      if (!state.originalData) return state;

      const transformedData = transformProposalData(state.originalData);
      const modifiedSections = new Set(state.modifiedSections);
      modifiedSections.delete(section);

      // Create a new state object with the reset section
      const newState: Partial<RevisionState> = {
        modifiedSections,
      };

      // Type-safe way to set the correct section data
      switch (section) {
        case "program":
          newState.program = transformedData.program;
          break;
        case "peos":
          newState.peos = transformedData.peos;
          break;
        case "peo_mission_mappings":
          newState.peo_mission_mappings = transformedData.peo_mission_mappings;
          break;
        case "ga_peo_mappings":
          newState.ga_peo_mappings = transformedData.ga_peo_mappings;
          break;
        case "pos":
          newState.pos = transformedData.pos;
          break;
        case "po_peo_mappings":
          newState.po_peo_mappings = transformedData.po_peo_mappings;
          break;
        case "po_ga_mappings":
          newState.po_ga_mappings = transformedData.po_ga_mappings;
          break;
        case "curriculum":
          newState.curriculum = transformedData.curriculum;
          break;
        case "course_categories":
          newState.course_categories = transformedData.course_categories;
          break;
        case "curriculum_courses":
          newState.curriculum_courses = transformedData.curriculum_courses;
          break;
        case "course_po_mappings":
          newState.course_po_mappings = transformedData.course_po_mappings;
          break;
      }

      // If resetting PEOs, also reset related mappings
      if (section === "peos") {
        newState.peo_mission_mappings = transformedData.peo_mission_mappings;
        newState.ga_peo_mappings = transformedData.ga_peo_mappings;
        newState.po_peo_mappings = transformedData.po_peo_mappings;

        // Remove these sections from modified sections
        modifiedSections.delete("peo_mission_mappings");
        modifiedSections.delete("ga_peo_mappings");
        modifiedSections.delete("po_peo_mappings");
      }
      // If resetting POs, also reset related mappings
      if (section === "pos") {
        newState.po_peo_mappings = transformedData.po_peo_mappings;
        newState.po_ga_mappings = transformedData.po_ga_mappings;
        newState.course_po_mappings = transformedData.course_po_mappings;

        // Remove these sections from modified sections
        modifiedSections.delete("po_peo_mappings");
        modifiedSections.delete("po_ga_mappings");
        modifiedSections.delete("course_po_mappings");
      }

      return newState as RevisionState;
    });
  },

  // Submit revisions to the API
  submitRevisions: async () => {
    const state = get();
    const { modifiedSections } = state;

    if (modifiedSections.size === 0) {
      console.log("No changes to submit");
      return true;
    }

    // Prepare the data to submit
    const dataToSubmit: Record<string, unknown> = {};
    modifiedSections.forEach((section) => {
      dataToSubmit[section] = state[section];
    });

    console.log("Submitting revisions:", dataToSubmit);

    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  },
}));
