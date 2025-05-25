import { format } from "date-fns";

// Sample curriculum course data
export const sampleCurriculumCourseData = {
  data: [
    {
      id: 103,
      curriculum: {
        id: 18,
        name: "BSEE Curriculum 2025",
      },
      course: {
        id: 35,
        code: "EE 101",
        descriptive_title: "Fundamentals of Electrical Engineering",
      },
      course_category: {
        id: 1,
        name: "General Education",
        code: "GE",
      },
      semester: {
        id: 1,
        year: 1,
        sem: "first",
      },
      units: "3.00",
      is_in_revision: true,
      is_completed: false,
      course_outcomes: [
        {
          id: 49,
          name: "Art Analysis and Criticism",
          statement:
            "Students will be able to analyze and interpret visual artworks using appropriate terminology and critical frameworks to evaluate aesthetic qualities and cultural significance.",
          abcd: {
            audience: "Students",
            behavior: "Analyze and Interpret",
            condition: "visual artworks using appropriate terminology",
            degree: "evaluate aesthetic qualities and cultural significance",
          },
          cpa: "C",
          po_mappings: [
            {
              po_id: 79,
              po_name: "PO1",
              po_statement:
                "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
              ied: "I",
            },
            {
              po_id: 80,
              po_name: "PO2",
              po_statement:
                "Design and conduct experiments, as well as analyze and interpret data.",
              ied: "E",
            },
            {
              po_id: 81,
              po_name: "PO3",
              po_statement:
                "Function effectively on multidisciplinary teams and communicate effectively.",
              ied: "E",
            },
          ],
          tla_tasks: [
            {
              id: 89,
              at_code: "CA1",
              at_name: "Critique Assignment 1",
              at_tool: "Rubric",
              weight: "15.00",
            },
            {
              id: 90,
              at_code: "MT",
              at_name: "Midterm Exam",
              at_tool: "Marking Scheme",
              weight: "25.00",
            },
          ],
          tla_assessment_method: {
            id: 26,
            teaching_methods: ["Lecture", "Gallery Visits", "Discussion"],
            learning_resources: [
              "Textbooks",
              "Visual References",
              "Online Collections",
            ],
          },
        },
      ],
    },
    {
      id: 104,
      curriculum: {
        id: 18,
        name: "BSEE Curriculum 2025",
      },
      course: {
        id: 36,
        code: "EE 102",
        descriptive_title: "DC and AC Circuits",
      },
      course_category: {
        id: 2,
        name: "Core Courses",
        code: "CORE",
      },
      semester: {
        id: 2,
        year: 1,
        sem: "second",
      },
      units: "4.00",
      is_in_revision: true,
      is_completed: false,
      course_outcomes: [],
    },
  ],
  message: "Curriculum courses retrieved successfully",
};

export const sampleProgramOutcomes = [
  {
    id: 79,
    name: "PO1",
    statement:
      "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
  },
  {
    id: 80,
    name: "PO2",
    statement:
      "Design and conduct experiments, as well as analyze and interpret data.",
  },
  {
    id: 81,
    name: "PO3",
    statement:
      "Function effectively on multidisciplinary teams and communicate effectively.",
  },
  {
    id: 82,
    name: "PO4",
    statement:
      "Create computer-based systems applying mathematical foundations, algorithmic principles, and computer science theory and demonstrating comprehension of the tradeoffs involved in design choices.",
  },
  {
    id: 83,
    name: "PO5",
    statement:
      "Analyze information security issues related to the design, development, and use of information systems using critical thinking skills to identify vulnerabilities and threats.",
  },
];

// Sample course revision data
export const sampleCourseRevisionData = {
  curriculum_course_id: 103,
  course_code: "EE 101",
  course_title: "Fundamentals of Electrical Engineering",
  version: 2,
  revisions: [
    {
      id: 61,
      section: "course_outcomes",
      details:
        "The course outcomes need to be more specific to electrical engineering fundamentals. The current outcome about 'Art Analysis and Criticism' is not appropriate for an electrical engineering course. Please revise to focus on electrical engineering concepts.",
      created_at: "2025-05-20T08:30:00.000000Z",
      version: 2,
    },
    // {
    //   id: 62,
    //   section: "abcd",
    //   details:
    //     "The ABCD model components need to be revised to align with electrical engineering learning objectives. Ensure the audience, behavior, condition, and degree are appropriate for engineering students.",
    //   created_at: "2025-05-20T08:30:00.000000Z",
    //   version: 2,
    // },
    // {
    //   id: 63,
    //   section: "cpa",
    //   details:
    //     "The CPA classification needs to be reviewed and updated to reflect the appropriate cognitive level for electrical engineering fundamentals. Consider if 'C' (Comprehension) is the most appropriate level.",
    //   created_at: "2025-05-20T08:30:00.000000Z",
    //   version: 2,
    // },
    {
      id: 64,
      section: "po_mappings",
      details:
        "The Course Outcome to Program Outcome mappings need to be revised to ensure proper alignment with electrical engineering program outcomes. Verify that the IED levels are appropriate for this foundational course.",
      created_at: "2025-05-20T08:30:00.000000Z",
      version: 2,
    },
    {
      id: 65,
      section: "tla_tasks",
      details:
        "The TLA tasks need to be updated to reflect appropriate assessment methods for electrical engineering. 'Critique Assignment 1' is not suitable for this course. Consider laboratory exercises, problem-solving assignments, or technical reports.",
      created_at: "2025-05-20T08:30:00.000000Z",
      version: 2,
    },
    // {
    //   id: 66,
    //   section: "assessment_methods",
    //   details:
    //     "The assessment methods need to be revised to include appropriate teaching and learning resources for electrical engineering. Replace art-related methods with engineering-focused approaches such as laboratory work, simulations, and technical problem-solving.",
    //   created_at: "2025-05-20T08:30:00.000000Z",
    //   version: 2,
    // },
  ],
  message: "Course-level revisions fetched successfully.",
};

// Helper function to get section display names for course revisions
export const getCourseRevisionSectionDisplayName = (sectionKey: string) => {
  const sectionNames: Record<string, string> = {
    course_outcomes: "Course Outcomes",
    abcd: "ABCD Model",
    cpa: "CPA Classification",
    po_mappings: "Course Outcome to PO Mapping",
    tla_tasks: "TLA Tasks",
    assessment_methods: "Assessment Method",
  };
  return sectionNames[sectionKey] || sectionKey;
};

// Helper function to get semester display name
export const getSemesterDisplayName = (semester: {
  year: number;
  sem: string;
}) => {
  const semesterMap: Record<string, string> = {
    first: "First Semester",
    second: "Second Semester",
    summer: "Summer",
  };
  return `Year ${semester.year} - ${semesterMap[semester.sem] || semester.sem}`;
};

// Format date helper
export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMMM d, yyyy");
};
