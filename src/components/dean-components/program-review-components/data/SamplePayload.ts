// Sample program proposal payload
export const sampleProgramProposal = {
  id: 1,
  status: "pending",
  comment: "Some comment",
  version: 1,
  created_at: "2025-05-11T00:00:00.000000Z",
  updated_at: "2025-05-11T00:00:00.000000Z",

  proposed_by: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  },

  program: {
    id: 1,
    name: "Bachelor of Science in Electrical Engineering",
    abbreviation: "BSEE",
    department_id: 1,
    department_name: "College of Engineering",
    department_abbreviation: "CoE",
    version: 1,
    status: "active",
  },

  peos: [
    {
      id: 11,
      statement:
        "Produce graduates who can apply engineering knowledge to solve real-world problems",
      missions: [
        {
          id: 1,
          mission_no: "1",
          description:
            "To produce graduates equipped with advanced knowledge and lifelong learning skills with ethical standards through high quality instruction",
        },
      ],
      graduate_attributes: [
        {
          id: 1,
          ga_no: "1",
          name: "Knowledge Competence",
        },
        {
          id: 2,
          ga_no: "2",
          name: "Creativity and Innovation",
        },
      ],
    },
    {
      id: 12,
      statement:
        "Develop professionals who can adapt to emerging technologies and industry demands",
      missions: [
        {
          id: 2,
          mission_no: "2",
          description:
            "To generate and disseminate knowledge through quality research and creative works",
        },
      ],
      graduate_attributes: [
        {
          id: 3,
          ga_no: "3",
          name: "Critical and Systems Thinking",
        },
        {
          id: 5,
          ga_no: "5",
          name: "Lifelong Learning",
        },
      ],
    },
  ],

  pos: [
    {
      id: 22,
      name: "PO1",
      statement:
        "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
      peos: [
        {
          id: 11,
          statement:
            "Produce graduates who can apply engineering knowledge to solve real-world problems",
        },
      ],
      graduate_attributes: [
        {
          id: 1,
          ga_no: "1",
          name: "Knowledge Competence",
        },
        {
          id: 3,
          ga_no: "3",
          name: "Critical and Systems Thinking",
        },
      ],
    },
    {
      id: 23,
      name: "PO2",
      statement:
        "Design and conduct experiments, as well as analyze and interpret data.",
      peos: [
        {
          id: 11,
          statement:
            "Produce graduates who can apply engineering knowledge to solve real-world problems",
        },
        {
          id: 12,
          statement:
            "Develop professionals who can adapt to emerging technologies and industry demands",
        },
      ],
      graduate_attributes: [
        {
          id: 2,
          ga_no: "2",
          name: "Creativity and Innovation",
        },
      ],
    },
  ],

  curriculum: {
    id: 11,
    name: "BSEE Curriculum 2025",
    courses: [
      {
        id: 35,
        course: {
          id: 1,
          code: "EE 101",
          descriptive_title: "Introduction to Electrical Engineering",
        },
        category: {
          id: 2,
          name: "Core Courses",
          code: "CORE",
        },
        semester: {
          id: 1,
          year: 1,
          sem: "first",
        },
        units: "3.00",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            ird: "I",
          },
        ],
      },
      {
        id: 36,
        course: {
          id: 2,
          code: "EE 102",
          descriptive_title: "DC and AC Circuits",
        },
        category: {
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
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            ird: "E",
          },
          {
            po_id: 23,
            po_name: "PO2",
            ird: "I",
          },
        ],
      },
      {
        id: 37,
        course: {
          id: 3,
          code: "MATH 101",
          descriptive_title: "Calculus 1",
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
        po_mappings: [],
      },
    ],
  },
};

// Sample curriculum course details based on the actual payload structure
export const sampleCurriculumCourses = [
  {
    id: 35,
    curriculum: {
      id: 11,
      name: "BSEE Curriculum 2025",
    },
    course: {
      id: 1,
      code: "EE 101",
      descriptive_title: "Introduction to Electrical Engineering",
    },
    course_category: {
      id: 2,
      name: "Core Courses",
      code: "CORE",
    },
    semester: {
      id: 1,
      year: 1,
      sem: "first",
    },
    units: "3.00",
    course_outcomes: [
      {
        id: 9,
        name: "CO 1",
        statement:
          "Explain the fundamental principles of electrical engineering and its various subfields.",
        abcd: {
          audience: "Students",
          behavior: "explain",
          condition: "when discussing electrical engineering concepts",
          degree: "clearly and accurately",
        },

        cpa: "C",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "I",
          },
          {
            po_id: 23,
            po_name: "PO2",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "I",
          },
        ],
        tla_tasks: [
          {
            id: 4,
            at_code: "Q1",
            at_name: "Quiz 1",
            at_tool: "Marking Scheme",
            weight: "10.00",
          },
          {
            id: 5,
            at_code: "MT",
            at_name: "Midterm Exam",
            at_tool: "Marking Scheme",
            weight: "30.00",
          },
          {
            id: 6,
            at_code: "FE",
            at_name: "Final Exam",
            at_tool: "Marking Scheme",
            weight: "40.00",
          },
        ],
        tla_assessment_method: {
          teaching_methods: ["Lecture", "Discussion", "Video Presentations"],
          learning_resources: [
            "Textbooks",
            "Lecture Notes",
            "Online Resources",
          ],
        },
      },
      {
        id: 10,
        name: "CO 1",
        statement:
          "Explain the fundamental principles of electrical engineering and its various subfields.",
        abcd: {
          audience: "Students",
          behavior: "explain",
          condition: "when discussing electrical engineering concepts",
          degree: "clearly and accurately",
        },

        cpa: "C",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "I",
          },
          {
            po_id: 23,
            po_name: "PO2",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "I",
          },
        ],
        tla_tasks: [
          {
            id: 4,
            at_code: "Q1",
            at_name: "Quiz 1",
            at_tool: "Marking Scheme",
            weight: "10.00",
          },
          {
            id: 5,
            at_code: "MT",
            at_name: "Midterm Exam",
            at_tool: "Marking Scheme",
            weight: "30.00",
          },
          {
            id: 6,
            at_code: "FE",
            at_name: "Final Exam",
            at_tool: "Marking Scheme",
            weight: "40.00",
          },
        ],
        tla_assessment_method: {
          teaching_methods: ["Lecture", "Discussion", "Video Presentations"],
          learning_resources: [
            "Textbooks",
            "Lecture Notes",
            "Online Resources",
          ],
        },
      },
    ],
  },
  {
    id: 36,
    curriculum: {
      id: 11,
      name: "BSEE Curriculum 2025",
    },
    course: {
      id: 2,
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
    course_outcomes: [
      {
        id: 10,
        name: "CO 1",
        statement:
          "Apply conversion accurately across different number systems (e.g. binary, octal, decimal, hexadecimal) given integer representations.",
        abcd: {
          audience: "Students",
          behavior: "apply",
          condition: "conversion",
          degree: "accurately",
        },
        cpa: "P",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "E",
          },
        ],
        tla_tasks: [
          {
            id: 7,
            at_code: "Q1",
            at_name: "Quiz 1",
            at_tool: "Marking Scheme",
            weight: "10.00",
          },
          {
            id: 8,
            at_code: "Q2",
            at_name: "Quiz 2",
            at_tool: "Marking Scheme",
            weight: "10.00",
          },
          {
            id: 9,
            at_code: "MT",
            at_name: "Miterm Exam",
            at_tool: "Marking Scheme",
            weight: "40.00",
          },
        ],
        tla_assessment_method: {
          teaching_methods: ["Lecture", "Demonstration"],
          learning_resources: ["Textbooks", "Lecture Notes"],
        },
      },
      {
        id: 11,
        name: "CO 2",
        statement:
          "Analyze DC and AC circuits using various circuit analysis techniques.",
        abcd: {
          audience: "Students",
          behavior: "analyze",
          condition: "when given circuit diagrams",
          degree: "using appropriate techniques",
        },
        cpa: "C",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "E",
          },
          {
            po_id: 23,
            po_name: "PO2",
            po_statement:
              "Design and conduct experiments, as well as analyze and interpret data.",
            ied: "I",
          },
        ],
        tla_tasks: [
          {
            id: 10,
            at_code: "LAB1",
            at_name: "Laboratory Exercise 1",
            at_tool: "Rubric",
            weight: "15.00",
          },
          {
            id: 11,
            at_code: "FE",
            at_name: "Final Exam",
            at_tool: "Marking Scheme",
            weight: "40.00",
          },
        ],
        tla_assessment_method: {
          teaching_methods: [
            "Laboratory",
            "Problem-Based Learning",
            "Demonstration",
          ],
          learning_resources: [
            "Laboratory Manual",
            "Circuit Simulation Software",
            "Textbooks",
          ],
        },
      },
    ],
  },
  {
    id: 37,
    curriculum: {
      id: 11,
      name: "BSEE Curriculum 2025",
    },
    course: {
      id: 3,
      code: "MATH 101",
      descriptive_title: "Calculus 1",
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
    course_outcomes: [
      {
        id: 12,
        name: "CO 1",
        statement:
          "Apply differential calculus techniques to solve engineering problems.",
        abcd: {
          audience: "Students",
          behavior: "apply",
          condition: "when solving engineering problems",
          degree: "using differential calculus techniques",
        },
        cpa: "C",
        po_mappings: [
          {
            po_id: 22,
            po_name: "PO1",
            po_statement:
              "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
            ied: "I",
          },
        ],
        tla_tasks: [
          {
            id: 12,
            at_code: "HW",
            at_name: "Homework Sets",
            at_tool: "Marking Scheme",
            weight: "20.00",
          },
          {
            id: 13,
            at_code: "MT",
            at_name: "Midterm Exam",
            at_tool: "Marking Scheme",
            weight: "30.00",
          },
          {
            id: 14,
            at_code: "FE",
            at_name: "Final Exam",
            at_tool: "Marking Scheme",
            weight: "40.00",
          },
        ],
        tla_assessment_method: {
          teaching_methods: ["Lecture", "Problem Solving", "Group Discussions"],
          learning_resources: [
            "Calculus Textbook",
            "Problem Sets",
            "Online Math Resources",
          ],
        },
      },
    ],
  },
];

// Create a mapping of course IDs to course details
export const courseDetailsMap = {
  35: sampleCurriculumCourses[0],
  36: sampleCurriculumCourses[1],
  37: sampleCurriculumCourses[2],
};
