import {
  CourseCategory,
  Course,
  CurriculumCourse,
  CourseToPOMapping,
  YearSemester,
  ProgramTemplate,
} from "./types";

import { GraduateAttribute } from "@/types/model/GraduateAttributes";

// Default empty array for graduate attributes (will be replaced by fetched data)
export const defaultGraduateAttributes: GraduateAttribute[] = [];
export const initialYearSemesters: YearSemester[] = [];
export const initialCourseCategories: CourseCategory[] = [
  { id: 15, name: "Common Courses", code: "CC" },
];

export const initialPremadeCourseCategories: CourseCategory[] = [
  { id: 1, name: "Core Courses", code: "CORE" },
  { id: 2, name: "General Education", code: "GE" },
  { id: 3, name: "Physical Education", code: "PE" },
  { id: 4, name: "National Service Training Program", code: "NSTP" },
  { id: 5, name: "Major Courses", code: "MAJOR" },
  { id: 6, name: "Elective Courses", code: "ELECT" },
  { id: 7, name: "Thesis/Capstone", code: "THESIS" },
  { id: 8, name: "On-the-Job Training", code: "OJT" },
  { id: 9, name: "Laboratory Courses", code: "LAB" },
  { id: 10, name: "Mathematics Courses", code: "MATH" },
  { id: 11, name: "Science Courses", code: "SCI" },
  { id: 12, name: "Language Courses", code: "LANG" },
  { id: 13, name: "Humanities", code: "HUM" },
  { id: 14, name: "Social Sciences", code: "SOC" },
];

// Initial premade courses
export const initialPremadeCourses: Course[] = [
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
export const initialCurriculumCourses: CurriculumCourse[] = [];

// Initial course to PO mappings
export const initialCourseToPOMappings: CourseToPOMapping[] = [];

// Predefined year-semester combinations
export const predefinedYearSemesters = [
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
];

export const createProgramTemplates = (): ProgramTemplate[] => {
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
