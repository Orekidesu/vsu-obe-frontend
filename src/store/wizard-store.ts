import { create } from "zustand";
import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
}

// Define the Mapping interface
interface PEOToMissionMapping {
  peoId: number;
  missionId: number;
}

interface GAToPEOMapping {
  gaId: number; // Keep as string for compatibility with existing mappings
  peoId: number;
}

interface POToPEOMapping {
  poId: number;
  peoId: number;
}

interface POToGAMapping {
  poId: number;
  gaId: number;
}

export interface YearSemester {
  id: string;
  year: number;
  semester: string;
}
interface PredefinedYearSemester {
  year: number;
  semester: string;
  label: string;
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  yearSemesters: YearSemester[];
}

export interface CourseCategory {
  id: string;
  name: string;
  code: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
}
// Define the Contribution Level type
export type ContributionLevel = "I" | "R" | "D";

// Define the Course to PO Mapping interface
export interface CourseToPOMapping {
  courseId: string;
  poId: number;
  contributionLevels: ContributionLevel[];
}

// Define the Curriculum Course interface (extends Course with additional properties)
export interface CurriculumCourse extends Course {
  categoryId: string;
  yearSemesterId: string;
  units: number;
}

interface WizardState {
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;
  curriculumName: string;
  academicYear: string;
  yearSemesters: YearSemester[];
  courseCategories: CourseCategory[];
  premadeCourses: Course[];
  curriculumCourses: CurriculumCourse[];
  courseToPOMappings: CourseToPOMapping[];

  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];
  peoToMissionMappings: PEOToMissionMapping[];
  gaToPEOMappings: GAToPEOMapping[];
  poToPEOMappings: POToPEOMapping[];
  poToGAMappings: POToGAMapping[];
  programTemplates: ProgramTemplate[];

  predefinedYearSemesters: PredefinedYearSemester[];

  // Add setters for the GAs
  setGraduateAttributes: (graduateAttributes: GraduateAttribute[]) => void;

  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;
  setCurriculumName: (name: string) => void;
  setAcademicYear: (year: string) => void;
  setYearSemesters: (yearSemesters: YearSemester[]) => void;
  addYearSemester: (year: number, semester: string) => void;
  removeYearSemester: (id: string) => void;
  addCourseCategory: (name: string, code: string) => void;
  updateCourseCategory: (id: string, name: string, code: string) => void;
  removeCourseCategory: (id: string) => void;
  addCourse: (code: string, title: string) => string;
  addCurriculumCourse: (
    courseId: string,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  updateCurriculumCourse: (
    id: string,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  removeCurriculumCourse: (id: string) => void;
  updateCourseToPOMapping: (
    courseId: string,
    poId: number,
    contributionLevels: ContributionLevel[]
  ) => void;
  removeCourseToPOMapping: (courseId: string, poId: number) => void;

  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;
  addProgramOutcome: () => void;
  updateProgramOutcome: (id: number, name: string, statement: string) => void;
  removeProgramOutcome: (id: number) => void;
  toggleMapping: (peoId: number, missionId: number) => void;
  toggleGAToPEOMapping: (gaId: number, peoId: number) => void;
  togglePOToPEOMapping: (poId: number, peoId: number) => void;
  togglePOToGAMapping: (poId: number, gaId: number) => void;
}

// Default empty array for graduate attributes (will be replaced by fetched data)
const defaultGraduateAttributes: GraduateAttribute[] = [];
const initialYearSemesters: YearSemester[] = [];
const initialCourseCategories: CourseCategory[] = [
  { id: "cc", name: "Common Courses", code: "CC" },
];

// Initial premade courses
const initialPremadeCourses: Course[] = [
  { id: "csit101", code: "CSIT 101", title: "Introduction to Computing" },
  { id: "csit102", code: "CSIT 102", title: "Computer Programming 1" },
  { id: "csit103", code: "CSIT 103", title: "Computer Programming 2" },
  { id: "math101", code: "MATH 101", title: "College Algebra" },
  { id: "math102", code: "MATH 102", title: "Trigonometry" },
  { id: "engl101", code: "ENGL 101", title: "Communication Skills 1" },
  { id: "engl102", code: "ENGL 102", title: "Communication Skills 2" },
  { id: "phys101", code: "PHYS 101", title: "General Physics 1" },
  { id: "phys102", code: "PHYS 102", title: "General Physics 2" },
  { id: "chem101", code: "CHEM 101", title: "General Chemistry" },
];
// Initial curriculum courses
const initialCurriculumCourses: CurriculumCourse[] = [];
// Initial course to PO mappings
const initialCourseToPOMappings: CourseToPOMapping[] = [];

// Program Templates
const createProgramTemplates = (): ProgramTemplate[] => {
  // Helper function to create year-semester combinations
  const createYearSemesters = (
    years: number,
    includeMidyear: boolean
  ): YearSemester[] => {
    const result: YearSemester[] = [];

    for (let year = 1; year <= years; year++) {
      // Add first semester
      result.push({
        id: `${year}-first`,
        year,
        semester: "first",
      });

      // Add second semester
      result.push({
        id: `${year}-second`,
        year,
        semester: "second",
      });

      // Add midyear if needed
      if (includeMidyear) {
        result.push({
          id: `${year}-midyear`,
          year,
          semester: "midyear",
        });
      }
    }

    return result;
  };

  return [
    {
      id: "2yr-standard",
      name: "2-Year Program (Standard)",
      description:
        "A standard 2-year program with first and second semesters only",
      yearSemesters: createYearSemesters(2, false),
    },
    {
      id: "2yr-midyear",
      name: "2-Year Program with Midyear",
      description: "A 2-year program that includes midyear semesters",
      yearSemesters: createYearSemesters(2, true),
    },
    {
      id: "3yr-standard",
      name: "3-Year Program (Standard)",
      description:
        "A standard 3-year program with first and second semesters only",
      yearSemesters: createYearSemesters(3, false),
    },
    {
      id: "3yr-midyear",
      name: "3-Year Program with Midyear",
      description: "A 3-year program that includes midyear semesters",
      yearSemesters: createYearSemesters(3, true),
    },
    {
      id: "4yr-standard",
      name: "4-Year Program (Standard)",
      description:
        "A standard 4-year program with first and second semesters only",
      yearSemesters: createYearSemesters(4, false),
    },
    {
      id: "4yr-midyear",
      name: "4-Year Program with Midyear",
      description: "A 4-year program that includes midyear semesters",
      yearSemesters: createYearSemesters(4, true),
    },
    {
      id: "5yr-standard",
      name: "5-Year Program (Standard)",
      description:
        "A standard 5-year program with first and second semesters only",
      yearSemesters: createYearSemesters(5, false),
    },
    {
      id: "5yr-midyear",
      name: "5-Year Program with Midyear",
      description: "A 5-year program that includes midyear semesters",
      yearSemesters: createYearSemesters(5, true),
    },
    {
      id: "6yr-standard",
      name: "6-Year Program (Standard)",
      description:
        "A standard 6-year program with first and second semesters only",
      yearSemesters: createYearSemesters(6, false),
    },
    {
      id: "6yr-midyear",
      name: "6-Year Program with Midyear",
      description: "A 6-year program that includes midyear semesters",
      yearSemesters: createYearSemesters(6, true),
    },
  ];
};

export const useWizardStore = create<WizardState>((set) => ({
  formType: "",
  programName: "",
  programAbbreviation: "",
  selectedProgram: "",
  curriculumName: "",
  academicYear: "",
  yearSemesters: initialYearSemesters,
  courseCategories: initialCourseCategories,
  premadeCourses: initialPremadeCourses,
  curriculumCourses: initialCurriculumCourses,
  courseToPOMappings: initialCourseToPOMappings,
  peos: [{ id: 1, statement: "" }], // Start with one empty PEO
  programOutcomes: [{ id: 1, name: "", statement: "" }], // Start with one empty Program Outcome
  graduateAttributes: defaultGraduateAttributes, // Start with empty array
  // mappings: [],
  peoToMissionMappings: [],
  gaToPEOMappings: [],
  poToPEOMappings: [],
  poToGAMappings: [],

  predefinedYearSemesters: [
    { year: 1, semester: "first", label: "Year 1 - First Semester" },
    { year: 1, semester: "second", label: "Year 1 - Second Semester" },
    { year: 1, semester: "midyear", label: "Year 1 - Midyear" },
    { year: 2, semester: "first", label: "Year 2 - First Semester" },
    { year: 2, semester: "second", label: "Year 2 - Second Semester" },
    { year: 2, semester: "midyear", label: "Year 2 - Midyear" },
    { year: 3, semester: "first", label: "Year 3 - First Semester" },
    { year: 3, semester: "second", label: "Year 3 - Second Semester" },
    { year: 3, semester: "midyear", label: "Year 3 - Midyear" },
    { year: 4, semester: "first", label: "Year 4 - First Semester" },
    { year: 4, semester: "second", label: "Year 4 - Second Semester" },
    { year: 4, semester: "midyear", label: "Year 4 - Midyear" },
  ],

  programTemplates: createProgramTemplates(),

  setGraduateAttributes: (graduateAttributes) => set({ graduateAttributes }),

  setFormType: (type) => set({ formType: type }),
  setProgramName: (name) => set({ programName: name }),
  setProgramAbbreviation: (abbreviation) =>
    set({ programAbbreviation: abbreviation }),
  setSelectedProgram: (program) => set({ selectedProgram: program }),
  setCurriculumName: (name) => set({ curriculumName: name }),
  setAcademicYear: (year) => set({ academicYear: year }),

  setYearSemesters: (yearSemesters) => set({ yearSemesters }),

  addYearSemester: (year, semester) =>
    set((state) => {
      // Create a unique ID for this year-semester combination
      const id = `${year}-${semester}`;

      // Check if this combination already exists
      const exists = state.yearSemesters.some((ys) => ys.id === id);
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new year-semester combination
      return {
        yearSemesters: [...state.yearSemesters, { id, year, semester }].sort(
          (a, b) => {
            // Sort by year first
            if (a.year !== b.year) {
              return a.year - b.year;
            }

            // Then sort by semester (first, second, midyear)
            const semesterOrder = { first: 0, second: 1, midyear: 2 };
            return (
              semesterOrder[a.semester as keyof typeof semesterOrder] -
              semesterOrder[b.semester as keyof typeof semesterOrder]
            );
          }
        ),
      };
    }),

  removeYearSemester: (id) =>
    set((state) => {
      // Remove any curriculum courses associated with this year-semester
      const updatedCurriculumCourses = state.curriculumCourses.filter(
        (cc) => cc.yearSemesterId !== id
      );

      // Get the IDs of removed curriculum courses
      const removedCourseIds = state.curriculumCourses
        .filter((cc) => cc.yearSemesterId === id)
        .map((cc) => cc.id);

      // Remove any course to PO mappings associated with removed courses
      const updatedCourseToPOMappings = state.courseToPOMappings.filter(
        (mapping) => !removedCourseIds.includes(mapping.courseId)
      );

      return {
        yearSemesters: state.yearSemesters.filter((ys) => ys.id !== id),
        curriculumCourses: updatedCurriculumCourses,
        courseToPOMappings: updatedCourseToPOMappings,
      };
    }),

  addCourseCategory: (name, code) =>
    set((state) => {
      // Create a unique ID based on the code (lowercase for consistency)
      const id = code.toLowerCase();

      // Check if this code already exists
      const exists = state.courseCategories.some((cc) => cc.id === id);
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new course category
      return {
        courseCategories: [...state.courseCategories, { id, name, code }].sort(
          (a, b) => a.name.localeCompare(b.name)
        ),
      };
    }),

  updateCourseCategory: (id, name, code) =>
    set((state) => {
      // Check if the new code already exists (except for the current category)
      const newId = code.toLowerCase();
      const codeExists = state.courseCategories.some(
        (cc) => cc.id !== id && cc.code.toLowerCase() === newId
      );
      if (codeExists) {
        return state; // Don't update if code already exists
      }

      // Update curriculum courses that use this category
      const updatedCurriculumCourses = state.curriculumCourses.map((cc) =>
        cc.categoryId === id ? { ...cc, categoryId: newId } : cc
      );

      // Update the course category
      return {
        courseCategories: state.courseCategories
          .map((cc) => (cc.id === id ? { id: newId, name, code } : cc))
          .sort((a, b) => a.name.localeCompare(b.name)),
        curriculumCourses: updatedCurriculumCourses,
      };
    }),

  removeCourseCategory: (id) =>
    set((state) => {
      // Remove any curriculum courses associated with this category
      const updatedCurriculumCourses = state.curriculumCourses.filter(
        (cc) => cc.categoryId !== id
      );

      // Get the IDs of removed curriculum courses
      const removedCourseIds = state.curriculumCourses
        .filter((cc) => cc.categoryId === id)
        .map((cc) => cc.id);

      // Remove any course to PO mappings associated with removed courses
      const updatedCourseToPOMappings = state.courseToPOMappings.filter(
        (mapping) => !removedCourseIds.includes(mapping.courseId)
      );

      return {
        courseCategories: state.courseCategories.filter((cc) => cc.id !== id),
        curriculumCourses: updatedCurriculumCourses,
        courseToPOMappings: updatedCourseToPOMappings,
      };
    }),

  addCourse: (code, title) => {
    const id = code.toLowerCase().replace(/\s+/g, ""); // Create a unique ID based on the code

    set((state) => {
      // Check if this course already exists in premade courses
      const existingPremadeCourse = state.premadeCourses.find(
        (c) => c.id === id
      );
      if (existingPremadeCourse) {
        return state; // Don't add duplicates
      }

      // Add the new course to premade courses
      const updatedPremadeCourses = [
        ...state.premadeCourses,
        { id, code, title },
      ].sort((a, b) => a.code.localeCompare(b.code));

      return {
        premadeCourses: updatedPremadeCourses,
      };
    });

    return id; // Return the ID of the newly added course
  },

  addCurriculumCourse: (courseId, categoryId, yearSemesterId, units) =>
    set((state) => {
      // Find the course from premade courses
      const course = state.premadeCourses.find((c) => c.id === courseId);
      if (!course) {
        return state; // Course not found
      }

      // Check if this course is already in the curriculum for this year-semester
      const exists = state.curriculumCourses.some(
        (cc) => cc.id === courseId && cc.yearSemesterId === yearSemesterId
      );
      if (exists) {
        return state; // Don't add duplicates
      }

      // Add the new curriculum course
      const newCurriculumCourse: CurriculumCourse = {
        ...course,
        categoryId,
        yearSemesterId,
        units,
      };

      return {
        curriculumCourses: [
          ...state.curriculumCourses,
          newCurriculumCourse,
        ].sort((a, b) => {
          // Sort by year-semester first
          const yearSemesterA = state.yearSemesters.find(
            (ys) => ys.id === a.yearSemesterId
          );
          const yearSemesterB = state.yearSemesters.find(
            (ys) => ys.id === b.yearSemesterId
          );

          if (yearSemesterA && yearSemesterB) {
            if (yearSemesterA.year !== yearSemesterB.year) {
              return yearSemesterA.year - yearSemesterB.year;
            }

            const semesterOrder = { first: 0, second: 1, midyear: 2 };
            const semesterCompare =
              semesterOrder[
                yearSemesterA.semester as keyof typeof semesterOrder
              ] -
              semesterOrder[
                yearSemesterB.semester as keyof typeof semesterOrder
              ];

            if (semesterCompare !== 0) {
              return semesterCompare;
            }
          }

          // Then sort by course code
          return a.code.localeCompare(b.code);
        }),
      };
    }),

  updateCurriculumCourse: (id, categoryId, yearSemesterId, units) =>
    set((state) => ({
      curriculumCourses: state.curriculumCourses.map((cc) =>
        cc.id === id ? { ...cc, categoryId, yearSemesterId, units } : cc
      ),
    })),

  removeCurriculumCourse: (id) =>
    set((state) => ({
      curriculumCourses: state.curriculumCourses.filter((cc) => cc.id !== id),
      // Also remove any course to PO mappings for this course
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => mapping.courseId !== id
      ),
    })),
  updateCourseToPOMapping: (courseId, poId, contributionLevels) =>
    set((state) => {
      // Check if this mapping already exists
      const existingMapping = state.courseToPOMappings.find(
        (mapping) => mapping.courseId === courseId && mapping.poId === poId
      );

      if (existingMapping) {
        // If the contribution levels array is empty, remove the mapping
        if (contributionLevels.length === 0) {
          return {
            courseToPOMappings: state.courseToPOMappings.filter(
              (mapping) =>
                !(mapping.courseId === courseId && mapping.poId === poId)
            ),
          };
        }

        // Update the existing mapping
        return {
          courseToPOMappings: state.courseToPOMappings.map((mapping) =>
            mapping.courseId === courseId && mapping.poId === poId
              ? { ...mapping, contributionLevels }
              : mapping
          ),
        };
      } else {
        // Only add the mapping if there are contribution levels
        if (contributionLevels.length === 0) {
          return state;
        }

        // Add a new mapping
        return {
          courseToPOMappings: [
            ...state.courseToPOMappings,
            { courseId, poId, contributionLevels },
          ],
        };
      }
    }),
  removeCourseToPOMapping: (courseId, poId) =>
    set((state) => ({
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => !(mapping.courseId === courseId && mapping.poId === poId)
      ),
    })),

  addPEO: () =>
    set((state) => {
      const newId =
        state.peos.length > 0
          ? Math.max(...state.peos.map((peo) => peo.id)) + 1
          : 1;
      return { peos: [...state.peos, { id: newId, statement: "" }] };
    }),

  updatePEO: (id, statement) =>
    set((state) => ({
      peos: state.peos.map((peo) =>
        peo.id === id ? { ...peo, statement } : peo
      ),
    })),

  removePEO: (id) =>
    set((state) => ({
      peos: state.peos.filter((peo) => peo.id !== id),
      peoToMissionMappings: state.peoToMissionMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
      gaToPEOMappings: state.gaToPEOMappings.filter(
        (mapping) => mapping.peoId !== id
      ),
    })),
  addProgramOutcome: () =>
    set((state) => {
      const newId =
        state.programOutcomes.length > 0
          ? Math.max(...state.programOutcomes.map((po) => po.id)) + 1
          : 1;
      return {
        programOutcomes: [
          ...state.programOutcomes,
          { id: newId, name: "", statement: "" },
        ],
      };
    }),

  updateProgramOutcome: (id, name, statement) =>
    set((state) => ({
      programOutcomes: state.programOutcomes.map((po) =>
        po.id === id ? { ...po, name, statement } : po
      ),
    })),

  removeProgramOutcome: (id) =>
    set((state) => ({
      programOutcomes: state.programOutcomes.filter((po) => po.id !== id),
      poToPEOMappings: state.poToPEOMappings.filter(
        (mapping) => mapping.poId !== id
      ),
      poToGAMappings: state.poToGAMappings.filter(
        (mapping) => mapping.poId !== id
      ),
      // Also remove any course to PO mappings for this PO
      courseToPOMappings: state.courseToPOMappings.filter(
        (mapping) => mapping.poId !== id
      ),
    })),
  toggleMapping: (peoId, missionId) =>
    set((state) => {
      const existingMapping = state.peoToMissionMappings.find(
        (m) => m.peoId === peoId && m.missionId === missionId
      );

      if (existingMapping) {
        return {
          mappings: state.peoToMissionMappings.filter(
            (m) => !(m.peoId === peoId && m.missionId === missionId)
          ),
        };
      } else {
        return {
          peoToMissionMappings: [
            ...state.peoToMissionMappings,
            { peoId, missionId },
          ],
        };
      }
    }),

  toggleGAToPEOMapping: (gaId, peoId) =>
    set((state) => {
      const existingMapping = state.gaToPEOMappings.find(
        (m) => m.gaId === gaId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          gaToPEOMappings: state.gaToPEOMappings.filter(
            (m) => !(m.gaId === gaId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          gaToPEOMappings: [...state.gaToPEOMappings, { gaId, peoId }],
        };
      }
    }),
  togglePOToPEOMapping: (poId, peoId) =>
    set((state) => {
      const existingMapping = state.poToPEOMappings.find(
        (m) => m.poId === poId && m.peoId === peoId
      );

      if (existingMapping) {
        return {
          poToPEOMappings: state.poToPEOMappings.filter(
            (m) => !(m.poId === poId && m.peoId === peoId)
          ),
        };
      } else {
        return {
          poToPEOMappings: [...state.poToPEOMappings, { poId, peoId }],
        };
      }
    }),
  togglePOToGAMapping: (poId, gaId) =>
    set((state) => {
      const existingMapping = state.poToGAMappings.find(
        (m) => m.poId === poId && m.gaId === gaId
      );

      if (existingMapping) {
        // Remove mapping if it exists
        return {
          poToGAMappings: state.poToGAMappings.filter(
            (m) => !(m.poId === poId && m.gaId === gaId)
          ),
        };
      } else {
        // Add mapping if it doesn't exist
        return {
          poToGAMappings: [...state.poToGAMappings, { poId, gaId }],
        };
      }
    }),
}));

export type { ProgramOutcome };
