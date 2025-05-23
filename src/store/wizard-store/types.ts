import { GraduateAttribute } from "@/types/model/GraduateAttributes";
import { ProgramEducationalObjective } from "@/types/model/ProgramEducationalObjective";

export interface ProgramOutcome {
  id: number;
  name: string;
  statement: string;
}

// Mapping interfaces
export interface PEOToMissionMapping {
  peoId: number;
  missionId: number;
}

export interface GAToPEOMapping {
  gaId: number;
  peoId: number;
}

export interface POToPEOMapping {
  poId: number;
  peoId: number;
}

export interface POToGAMapping {
  poId: number;
  gaId: number;
}

export interface YearSemester {
  id: string;
  year: number;
  semester: string;
}

export interface PredefinedYearSemester {
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
  id: number;
  name: string;
  code: string;
}

export interface Course {
  id: number;
  code: string;
  descriptive_title: string;
}

export type ContributionLevel = "I" | "E" | "D";

export interface CourseToPOMapping {
  courseId: number;
  poId: number;
  contributionLevels: ContributionLevel[];
}

export interface CurriculumCourse extends Course {
  categoryId: string;
  yearSemesterId: string;
  units: number;
}

export interface Committee {
  id: number;
  first_name: string;
  last_name: string;
}

export interface CommitteeCourseAssignment {
  committeeId: number;
  courseId: number;
}

export interface WizardState {
  // Program info
  formType: string;
  programName: string;
  programAbbreviation: string;
  selectedProgram: string;

  // Curriculum info
  curriculumName: string;
  academicYear: string;
  yearSemesters: YearSemester[];
  courseCategories: CourseCategory[];

  // Courses
  premadeCourses: Course[];
  curriculumCourses: CurriculumCourse[];
  courseToPOMappings: CourseToPOMapping[];
  committees: Committee[];
  selectedCommittees: number[];
  committeeCourseAssignments: CommitteeCourseAssignment[];

  // Educational objectives
  peos: ProgramEducationalObjective[];
  programOutcomes: ProgramOutcome[];
  graduateAttributes: GraduateAttribute[];

  // Mappings
  peoToMissionMappings: PEOToMissionMapping[];
  gaToPEOMappings: GAToPEOMapping[];
  poToPEOMappings: POToPEOMapping[];
  poToGAMappings: POToGAMapping[];

  // Templates
  programTemplates: ProgramTemplate[];
  predefinedYearSemesters: PredefinedYearSemester[];
  premadeCourseCategories: CourseCategory[];

  // Actions - Program related
  setFormType: (type: string) => void;
  setProgramName: (name: string) => void;
  setProgramAbbreviation: (abbreviation: string) => void;
  setSelectedProgram: (program: string) => void;

  // Actions - Curriculum related
  setCurriculumName: (name: string) => void;
  setAcademicYear: (year: string) => void;
  setYearSemesters: (yearSemesters: YearSemester[]) => void;
  addYearSemester: (year: number, semester: string) => void;
  removeYearSemester: (id: string) => void;

  // Actions - Course related
  addCourseCategory: (name: string, code: string) => void;
  updateCourseCategory: (id: number, name: string, code: string) => void;
  removeCourseCategory: (id: number) => void;
  addCourse: (code: string, title: string) => number;
  addCurriculumCourse: (
    courseId: number,
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  updateCurriculumCourse: (
    id: number, //??
    categoryId: string,
    yearSemesterId: string,
    units: number
  ) => void;
  removeCurriculumCourse: (id: number) => void;
  updateCourseToPOMapping: (
    courseId: number,
    poId: number,
    contributionLevels: ContributionLevel[]
  ) => void;
  removeCourseToPOMapping: (courseId: number, poId: number) => void;
  setPremadeCourses: (courses: Course[]) => void;
  setSelectedCommittees: (committeeIds: number[]) => void;
  addCommittee: (committeeId: number) => void;
  removeCommittee: (committeeId: number) => void;
  setCommittees: (committees: Committee[]) => void;

  assignCourseToCommittee: (committeeId: number, courseId: number) => void;
  removeCourseAssignment: (courseId: number) => void;
  getCommitteeForCourse: (courseId: number) => number | null;

  // Actions - PEO related
  addPEO: () => void;
  updatePEO: (id: number, statement: string) => void;
  removePEO: (id: number) => void;

  // Actions - Program Outcomes related
  addProgramOutcome: () => void;
  updateProgramOutcome: (id: number, name: string, statement: string) => void;
  removeProgramOutcome: (id: number) => void;

  // Actions - Mapping related
  toggleMapping: (peoId: number, missionId: number) => void;
  toggleGAToPEOMapping: (gaId: number, peoId: number) => void;
  togglePOToPEOMapping: (poId: number, peoId: number) => void;
  togglePOToGAMapping: (poId: number, gaId: number) => void;

  // Actions - Other
  setGraduateAttributes: (graduateAttributes: GraduateAttribute[]) => void;
  setPremadeCourseCategories: (categories: CourseCategory[]) => void;
}
