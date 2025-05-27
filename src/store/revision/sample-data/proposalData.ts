// Sample revision requests data with all possible department sections
import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

export const sampleRevisionRequests = {
  program_proposal_id: 21,
  version: 1,
  department_revisions: [
    {
      id: 68,
      section: "program",
      details:
        "Update the program name to better reflect current industry standards.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 69,
      section: "peos",
      details:
        "Revise PEO statements to align with ABET requirements and industry expectations.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 70,
      section: "peo_mission_mappings",
      details: "Ensure all PEOs are properly mapped to institutional missions.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 71,
      section: "ga_peo_mappings",
      details:
        "Redo the mapping carefully. Some graduate attributes are not properly aligned with PEOs.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 72,
      section: "pos",
      details: "Program outcomes need to be more specific and measurable.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 73,
      section: "po_peo_mappings",
      details:
        "Clarify linkage between POs and PEOs. Some mappings are unclear or missing.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 74,
      section: "po_ga_mappings",
      details:
        "Review the mapping between program outcomes and graduate attributes.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 75,
      section: "curriculum",
      details:
        "Curriculum structure needs adjustment to meet accreditation standards.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 76,
      section: "course_categories",
      details:
        "Course categories need to be reorganized and some may need renaming.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 77,
      section: "curriculum_courses",
      details:
        "Review course distribution across semesters and adjust prerequisites.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
    {
      id: 78,
      section: "course_po_mappings",
      details:
        "Course to PO mappings need to be more comprehensive and accurate.",
      created_at: "2025-05-26T12:58:16.000000Z",
      version: 1,
    },
  ],
  committee_revisions: [
    {
      curriculum_course_id: 103,
      course_code: "EE 101",
      course_title: "Fundamentals of Electrical Engineering",
      revisions: [
        {
          id: 79,
          section: "course_outcomes",
          details:
            "Course outcomes need to be more specific and measurable. Current outcomes are too broad and don't clearly define what students should achieve.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 80,
          section: "abcd",
          details:
            "ABCD components need to be more clearly defined. The Audience, Behavior, Condition, and Degree elements should be more specific and measurable.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 81,
          section: "cpa",
          details:
            "CPA classification needs review. Some outcomes may be incorrectly classified as Cognitive when they should be Psychomotor or Affective.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 82,
          section: "po_mappings",
          details:
            "PO mappings for this course need clarification and justification. The contribution levels (I/E/D) should be better aligned with course content.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 83,
          section: "tla_tasks",
          details:
            "Assessment tasks need to better align with course outcomes. Current tasks don't adequately measure all learning objectives and weights need adjustment.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 84,
          section: "tla_assessment_method",
          details:
            "Teaching and learning methods should include more hands-on activities and diverse assessment approaches to better support student learning.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
      ],
    },
    {
      curriculum_course_id: 104,
      course_code: "EE 102",
      course_title: "DC and AC Circuits",
      revisions: [
        {
          id: 83,
          section: "course_outcomes",
          details: "Add more practical application-focused outcomes.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 84,
          section: "abcd",
          details: "ABCD model needs refinement for better clarity.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
        {
          id: 85,
          section: "tla_methods",
          details:
            "Teaching and learning methods should include more hands-on activities.",
          created_at: "2025-05-26T12:58:16.000000Z",
        },
      ],
    },
  ],
  message: "All revisions fetched successfully.",
};

// Sample program proposal data (raw API format)
export const sampleProgramProposalRaw: ProgramProposalResponse = {
  id: 21,
  status: "revision",
  comment: null,
  version: 1,
  department_revision_required: true,
  committee_revision_required: true,
  has_revision_record: false,
  created_at: "2025-05-26T07:17:52.000000Z",
  updated_at: "2025-05-26T11:10:36.000000Z",
  proposed_by: {
    id: 5,
    first_name: "Bacalso",
    last_name: "Machiato",
    email: "department@gmail.com",
  },
  program: {
    id: 22,
    name: "Bachelor of Science in Information Technology",
    abbreviation: "BSIT",
    department_id: 1,
    department_name: "Department of Civil Engineering ",
    department_abbreviation: "DCE",
    version: 1,
    status: "pending",
  },
  peos: [
    {
      id: 70,
      statement:
        "Graduates will excel in the development and deployment of IT solutions across industries.",
      missions: [
        {
          id: 1,
          mission_no: 1,
          description:
            "To produce graduates equipped with advanced knowledge and lifelong learning skills with ethical standards through high quality instruction",
        },
        {
          id: 3,
          mission_no: 3,
          description: "and impactful community engagements.",
        },
      ],
      graduate_attributes: [
        {
          id: 2,
          ga_no: 2,
          name: "Creativity and Innovation",
        },
        {
          id: 4,
          ga_no: 4,
          name: "Communication",
        },
      ],
    },
    {
      id: 71,
      statement:
        "Graduates will demonstrate professionalism, leadership, and ethical responsibility in technology environments.",
      missions: [
        {
          id: 2,
          mission_no: 2,
          description: "innovative research",
        },
        {
          id: 3,
          mission_no: 3,
          description: "and impactful community engagements.",
        },
      ],
      graduate_attributes: [
        {
          id: 1,
          ga_no: 1,
          name: "Knowledge Competence",
        },
        {
          id: 6,
          ga_no: 6,
          name: "Leadership, teamwork, and Interpersonal Skills",
        },
      ],
    },
    {
      id: 72,
      statement:
        "Graduates will pursue continuous professional development and advanced studies in IT.",
      missions: [
        {
          id: 1,
          mission_no: 1,
          description:
            "To produce graduates equipped with advanced knowledge and lifelong learning skills with ethical standards through high quality instruction",
        },
        {
          id: 2,
          mission_no: 2,
          description: "innovative research",
        },
      ],
      graduate_attributes: [
        {
          id: 5,
          ga_no: 5,
          name: "Lifelong Learning",
        },
        {
          id: 7,
          ga_no: 7,
          name: "Global Outlook",
        },
        {
          id: 8,
          ga_no: 8,
          name: "Social and National Responsibility",
        },
      ],
    },
  ],
  pos: [
    {
      id: 85,
      name: "PO1",
      statement:
        "Apply knowledge of computing, algorithms, and programming to solve complex IT problems.",
      peos: [
        {
          id: 70,
          statement:
            "Graduates will excel in the development and deployment of IT solutions across industries.",
        },
      ],
      graduate_attributes: [
        {
          id: 1,
          ga_no: 1,
          name: "Knowledge Competence",
        },
        {
          id: 2,
          ga_no: 2,
          name: "Creativity and Innovation",
        },
      ],
    },
    {
      id: 86,
      name: "PO2",
      statement: "Analyze user needs and design effective IT-based solutions.",
      peos: [
        {
          id: 71,
          statement:
            "Graduates will demonstrate professionalism, leadership, and ethical responsibility in technology environments.",
        },
      ],
      graduate_attributes: [
        {
          id: 3,
          ga_no: 3,
          name: "Critical and Systems Thinking",
        },
        {
          id: 4,
          ga_no: 4,
          name: "Communication",
        },
      ],
    },
    {
      id: 87,
      name: "PO3",
      statement:
        "Demonstrate effective communication, collaboration, and project management skills.",
      peos: [
        {
          id: 72,
          statement:
            "Graduates will pursue continuous professional development and advanced studies in IT.",
        },
      ],
      graduate_attributes: [
        {
          id: 5,
          ga_no: 5,
          name: "Lifelong Learning",
        },
        {
          id: 6,
          ga_no: 6,
          name: "Leadership, teamwork, and Interpersonal Skills",
        },
      ],
    },
  ],
  curriculum: {
    id: 20,
    name: "BSIT Curriculum 2025",
    courses: [
      {
        id: 133,
        course: {
          id: 48,
          code: "IT 101",
          descriptive_title: "Introduction to Computing",
        },
        category: {
          id: 20,
          name: "IT Core Courses",
          code: "ITCORE",
        },
        semester: {
          id: 1,
          year: 1,
          sem: "first",
        },
        units: "3.00",
        po_mappings: [
          {
            po_id: 85,
            po_name: "PO1",
            ied: ["I"],
          },
          {
            po_id: 86,
            po_name: "PO2",
            ied: ["E"],
          },
        ],
      },
      {
        id: 134,
        course: {
          id: 49,
          code: "IT 102",
          descriptive_title: "Programming Fundamentals",
        },
        category: {
          id: 20,
          name: "IT Core Courses",
          code: "ITCORE",
        },
        semester: {
          id: 2,
          year: 1,
          sem: "second",
        },
        units: "4.00",
        po_mappings: [
          {
            po_id: 85,
            po_name: "PO1",
            ied: ["D"],
          },
        ],
      },
      {
        id: 135,
        course: {
          id: 50,
          code: "IT 201",
          descriptive_title: "Database Systems",
        },
        category: {
          id: 20,
          name: "IT Core Courses",
          code: "ITCORE",
        },
        semester: {
          id: 3,
          year: 2,
          sem: "first",
        },
        units: "3.00",
        po_mappings: [
          {
            po_id: 86,
            po_name: "PO2",
            ied: ["I", "E"],
          },
        ],
      },
      {
        id: 136,
        course: {
          id: 51,
          code: "IT 202",
          descriptive_title: "Web Development",
        },
        category: {
          id: 20,
          name: "IT Core Courses",
          code: "ITCORE",
        },
        semester: {
          id: 4,
          year: 2,
          sem: "second",
        },
        units: "4.00",
        po_mappings: [
          {
            po_id: 86,
            po_name: "PO2",
            ied: ["D"],
          },
        ],
      },
      {
        id: 137,
        course: {
          id: 52,
          code: "ENG 101",
          descriptive_title: "Technical Writing",
        },
        category: {
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
        po_mappings: [
          {
            po_id: 87,
            po_name: "PO3",
            ied: ["I"],
          },
        ],
      },
    ],
  },
  committees: [
    {
      id: 18,
      user: {
        id: 6,
        first_name: "Carl",
        last_name: "Subaru",
        email: "faculty@gmail.com",
      },
      assigned_by: {
        id: 5,
        first_name: "Bacalso",
        last_name: "Machiato",
      },
      assigned_courses: [
        {
          curriculum_course_id: 133,
          course_code: "IT 101",
          descriptive_title: "Introduction to Computing",
          is_completed: false,
          is_in_revision: true,
        },
        {
          curriculum_course_id: 134,
          course_code: "IT 102",
          descriptive_title: "Programming Fundamentals",
          is_completed: false,
          is_in_revision: true,
        },
        {
          curriculum_course_id: 135,
          course_code: "IT 201",
          descriptive_title: "Database Systems",
          is_completed: false,
          is_in_revision: false,
        },
        {
          curriculum_course_id: 136,
          course_code: "IT 202",
          descriptive_title: "Web Development",
          is_completed: false,
          is_in_revision: false,
        },
        {
          curriculum_course_id: 137,
          course_code: "ENG 101",
          descriptive_title: "Technical Writing",
          is_completed: false,
          is_in_revision: false,
        },
      ],
    },
  ],
};

// Sample curriculum courses data
export const sampleCurriculumCourses = {
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
      is_completed: true,
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
              ied: "D",
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
        {
          id: 51,
          name: "Circuit Analysis Fundamentals",
          statement:
            "Students will be able to apply Kirchhoff's laws and circuit analysis techniques to solve DC and AC circuit problems with resistors, capacitors, and inductors.",
          abcd: {
            audience: "Students",
            behavior: "Apply and Solve",
            condition: "using Kirchhoff's laws and circuit analysis techniques",
            degree: "solve DC and AC circuit problems accurately",
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
              id: 93,
              at_code: "HW1",
              at_name: "Circuit Analysis Homework",
              at_tool: "Problem Sets",
              weight: "10.00",
            },
            {
              id: 94,
              at_code: "LAB1",
              at_name: "Circuit Laboratory Exercise",
              at_tool: "Laboratory Report",
              weight: "15.00",
            },
          ],
          tla_assessment_method: {
            id: 28,
            teaching_methods: ["Lecture", "Problem Solving", "Laboratory Work"],
            learning_resources: [
              "Textbooks",
              "Circuit Simulation Software",
              "Laboratory Equipment",
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
      is_in_revision: false,
      is_completed: true,
      course_outcomes: [
        {
          id: 52,
          name: "Advanced Circuit Analysis",
          statement:
            "Students will be able to analyze complex AC circuits using phasor analysis and apply network theorems to solve multi-source circuit problems.",
          abcd: {
            audience: "Students",
            behavior: "Analyze and Apply",
            condition: "complex AC circuits using phasor analysis",
            degree:
              "solve multi-source circuit problems using network theorems",
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
              id: 95,
              at_code: "CA2",
              at_name: "Circuit Analysis Assignment",
              at_tool: "Rubric",
              weight: "20.00",
            },
            {
              id: 96,
              at_code: "FE",
              at_name: "Final Exam",
              at_tool: "Comprehensive Exam",
              weight: "35.00",
            },
          ],
          tla_assessment_method: {
            id: 29,
            teaching_methods: ["Lecture", "Problem Solving", "Laboratory Work"],
            learning_resources: [
              "Textbooks",
              "Circuit Simulation Software",
              "Online Resources",
            ],
          },
        },
      ],
    },
  ],
};

// Data transformation function
// export const transformApiData = (data: ProgramProposalResponse) => {
//   if (!data) return null;

//   // Extract unique semesters
//   const uniqueSemesters = new Map();
//   data?.curriculum.courses.forEach((course) => {
//     const key = `${course.semester.year}-${course.semester.sem}`;
//     if (!uniqueSemesters.has(key)) {
//       uniqueSemesters.set(key, {
//         year: course.semester.year,
//         sem: course.semester.sem,
//       });
//     }
//   });

//   // Extract unique categories
//   const uniqueCategories = new Map();
//   data.curriculum.courses.forEach((course) => {
//     const key = course.category.code;
//     if (!uniqueCategories.has(key)) {
//       uniqueCategories.set(key, {
//         name: course.category.name,
//         code: course.category.code,
//       });
//     }
//   });

//   // Extract unique courses
//   const uniqueCourses = new Map();
//   data.curriculum.courses.forEach((course) => {
//     const key = course.course.code;
//     if (!uniqueCourses.has(key)) {
//       uniqueCourses.set(key, {
//         code: course.course.code,
//         descriptive_title: course.course.descriptive_title,
//       });
//     }
//   });

//   // Extract unique missions
//   const uniqueMissions = new Map();
//   data.peos.forEach((peo) => {
//     peo.missions.forEach((mission) => {
//       if (!uniqueMissions.has(mission.mission_no)) {
//         uniqueMissions.set(mission.mission_no, {
//           id: mission.mission_no,
//           statement: mission.description,
//         });
//       }
//     });
//   });

//   // Create PEO to Mission mappings
//   const peoMissionMappings: { peo_index: number; mission_id: number }[] = [];
//   data.peos.forEach((peo, peoIndex) => {
//     peo.missions.forEach((mission) => {
//       peoMissionMappings.push({
//         peo_index: peoIndex,
//         mission_id: mission.mission_no,
//       });
//     });
//   });

//   // Create GA to PEO mappings
//   const gaPeoMappings: { peo_index: number; ga_id: number }[] = [];
//   data.peos.forEach((peo, peoIndex) => {
//     peo.graduate_attributes.forEach((ga) => {
//       gaPeoMappings.push({
//         peo_index: peoIndex,
//         ga_id: ga.ga_no,
//       });
//     });
//   });

//   // Create PO to PEO mappings
//   const poPeoMappings: { po_index: number; peo_index: number }[] = [];
//   data.pos.forEach((po, poIndex) => {
//     po.peos.forEach((peo) => {
//       // Find the index of this PEO in the peos array
//       const peoIndex = data.peos.findIndex((p) => p.id === peo.id);
//       if (peoIndex !== -1) {
//         poPeoMappings.push({
//           po_index: poIndex,
//           peo_index: peoIndex,
//         });
//       }
//     });
//   });

//   // Create PO to GA mappings
//   const poGaMappings: { po_index: number; ga_id: number }[] = [];
//   data.pos.forEach((po, poIndex) => {
//     po.graduate_attributes.forEach((ga) => {
//       poGaMappings.push({
//         po_index: poIndex,
//         ga_id: ga.ga_no,
//       });
//     });
//   });

//   // Create Course to PO mappings
//   const coursePOMappings: {
//     course_code: string;
//     po_code: string;
//     ied: string[];
//   }[] = [];
//   data.curriculum.courses.forEach((course) => {
//     course.po_mappings.forEach((mapping) => {
//       // Find the PO by ID
//       const po = data.pos.find((p) => p.id === mapping.po_id);
//       if (po) {
//         coursePOMappings.push({
//           course_code: course.course.code,
//           po_code: po.name,
//           ied: mapping.ied,
//         });
//       }
//     });
//   });

//   // Create curriculum courses
//   const curriculumCourses = data.curriculum.courses.map((course) => ({
//     course_code: course.course.code,
//     category_code: course.category.code,
//     semester_year: course.semester.year,
//     semester_name: course.semester.sem,
//     units: Number.parseFloat(course.units),
//   }));

//   const committees =
//     data.committees?.map((committee) => ({
//       id: committee.id.toString(),
//       name: `${committee.user.first_name} ${committee.user.last_name}`,
//       email: committee.user.email,
//       description: `Assigned by ${committee.assigned_by.first_name} ${committee.assigned_by.last_name}`,
//     })) || [];

//   // Transform committee assignments
//   const committeeAssignments: Array<{
//     committeeId: string;
//     courseId: string;
//     isCompleted: boolean;
//   }> = [];

//   data.committees?.forEach((committee) => {
//     committee.assigned_courses.forEach((course) => {
//       committeeAssignments.push({
//         committeeId: committee.id.toString(),
//         courseId: course.course_code,
//         isCompleted: course.is_completed || false,
//       });
//     });
//   });

//   return {
//     program: {
//       name: data.program.name,
//       abbreviation: data.program.abbreviation,
//     },
//     peos: data.peos.map((peo) => ({ statement: peo.statement })),
//     pos: data.pos.map((po) => ({
//       name: po.name,
//       statement: po.statement,
//     })),
//     curriculum: { name: data.curriculum.name },
//     semesters: Array.from(uniqueSemesters.values()),
//     course_categories: Array.from(uniqueCategories.values()),
//     courses: Array.from(uniqueCourses.values()),
//     curriculum_courses: curriculumCourses,
//     peo_mission_mappings: peoMissionMappings,
//     ga_peo_mappings: gaPeoMappings,
//     po_peo_mappings: poPeoMappings,
//     po_ga_mappings: poGaMappings,
//     course_po_mappings: coursePOMappings,
//     missions: Array.from(uniqueMissions.values()),
//     committees,
//     committeeAssignments,
//   };
// };

// Helper function to get section display name
export const getSectionDisplayName = (sectionKey: string) => {
  const sectionNames: Record<string, string> = {
    program: "Program Details",
    peos: "Program Educational Objectives",
    peo_mission_mappings: "PEO to Mission Mapping",
    ga_peo_mappings: "GA to PEO Mapping",
    po_peo_mappings: "PO to PEO Mapping",
    po_ga_mappings: "PO to GA Mapping",
    pos: "Program Outcomes",
    curriculum: "Curriculum Details",
    course_categories: "Course Categories",
    curriculum_courses: "Curriculum Courses",
    course_po_mappings: "Course to PO Mapping",
    course_outcomes: "Course Outcomes",
    abcd: "ABCD Components",
    cpa: "CPA Classification",
    po_mappings: "PO Mappings",
    tla_tasks: "TLA Assessment Tasks",
    tla_assessment_method: "TLA Methods",
  };
  return sectionNames[sectionKey] || sectionKey;
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
