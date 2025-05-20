import { ProgramProposalResponse } from "@/types/model/ProgramProposal";

// Sample program proposal data
export const sampleProposalData = {
  id: 17,
  status: "revision",
  comment: null,
  version: 1,
  created_at: "2025-05-17T08:53:22.000000Z",
  updated_at: "2025-05-19T06:45:28.000000Z",
  proposed_by: {
    id: 5,
    first_name: "Bacalso",
    last_name: "Machiato",
    email: "department@gmail.com",
  },
  program: {
    id: 18,
    name: "Bachelor of Science in Electrical Engineering",
    abbreviation: "BSEE",
    department_id: 1,
    department_name: "Department of Civil Engineering ",
    department_abbreviation: "DCE",
    version: 1,
    status: "pending",
  },
  peos: [
    {
      id: 34,
      statement:
        "Graduates will excel in electrical engineering practice and innovation.",
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
      id: 35,
      statement: "Graduates will solve real-world problems.",
      missions: [],
      graduate_attributes: [],
    },
  ],
  pos: [
    {
      id: 35,
      name: "Problem Solving",
      statement:
        "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
      peos: [
        {
          id: 34,
          statement:
            "Graduates will excel in electrical engineering practice and innovation.",
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
      id: 36,
      name: "Communication Skills",
      statement:
        "Design and conduct experiments, as well as analyze and interpret data.",
      peos: [],
      graduate_attributes: [],
    },
  ],
  curriculum: {
    id: 16,
    name: "BSEE Curriculum 2025",
    courses: [
      {
        id: 56,
        course: {
          id: 1,
          code: "EE 101",
          descriptive_title: "Fundamentals of Electrical Engineering",
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
            po_id: 35,
            po_name: "Problem Solving",
            ied: ["I", "E"],
          },
        ],
      },
    ],
  },
};

// Sample missions data
export const sampleMissions = [
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
  {
    id: 3,
    mission_no: 3,
    description: "and impactful community engagements.",
  },
];

// Sample graduate attributes data
export const sampleGraduateAttributes = [
  {
    id: 1,
    ga_no: 1,
    name: "Knowledge Competence",
    description:
      "Demonstrate a mastery of the fundamental knowledge and skills required for functioning effectively as a professional in the discipline, and an ability to integrate and apply them effectively to practice in the workplace.",
  },
  {
    id: 2,
    ga_no: 2,
    name: "Creativity and Innovation",
    description:
      "Experiment with new approaches, challenge existing knowledge boundaries and design novel solutions to solve problems.",
  },
  {
    id: 3,
    ga_no: 3,
    name: "Critical and Systems Thinking",
    description:
      "Identify, define, and deal with complex problems pertinent to the future professional practice or daily life through logical, analytical and critical thinking.",
  },
  {
    id: 4,
    ga_no: 4,
    name: "Communication",
    description:
      "Communicate effectively (both orally and in writing) with a wide range of audiences, across a range of professional and personal contexts, in English and Pilipino.",
  },
  {
    id: 5,
    ga_no: 5,
    name: "Lifelong Learning",
    description:
      "Identify own learning needs for professional or personal development; demonstrate an eagerness to take up opportunities for learning new things as well as the ability to learn effectively on their own.",
  },
  {
    id: 6,
    ga_no: 6,
    name: "Leadership, teamwork, and Interpersonal Skills",
    description:
      "Function effectively both as a leader and as a member of a team; motivate and lead a team to work towards goal; work collaboratively with other team members; as well as connect and interact socially and effectively with diverse culture.",
  },
  {
    id: 7,
    ga_no: 7,
    name: "Global Outlook",
    description:
      "Demonstrate an awareness and understanding of global issues and willingness to work, interact effectively and show sensitivity to cultural diversity.",
  },
  {
    id: 8,
    ga_no: 8,
    name: "Social and National Responsibility",
    description:
      "Demonstrate an awareness of their social and national responsibility; engage in activities that contribute to the betterment of the society; and behave ethically and responsibly in social, professional and work environments.",
  },
];

// Sample revision data
export const sampleRevisionData = {
  program_proposal_id: 17,
  version: 3,
  revisions: [
    {
      id: 50,
      section: "program",
      details:
        "Program details need revision - verify department alignment and abbreviation accuracy.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 51,
      section: "peos",
      details:
        "PEOs need to be more specific and aligned with industry standards. Consider adding a PEO related to ethical practice.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 52,
      section: "peo_mission_mappings",
      details:
        "The PEO to Mission mappings need to be revised to ensure all PEOs are properly aligned with the university's mission statements. Consider mapping to Mission 3 as well.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 53,
      section: "ga_peo_mappings",
      details:
        "The Graduate Attribute to PEO mappings need to be revised to ensure comprehensive coverage of all relevant graduate attributes. Consider mapping to additional GAs such as 'Knowledge Competence' and 'Lifelong Learning'.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 54,
      section: "pos",
      details:
        "Program Outcomes need to be expanded and refined to better align with current industry needs and ABET criteria. Consider adding outcomes related to teamwork and ethical considerations in engineering.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 55,
      section: "po_peo_mappings",
      details:
        "The Program Outcome to PEO mappings need to be revised to ensure all POs are properly aligned with the program's educational objectives. Ensure each PO contributes to at least one PEO.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
    {
      id: 56,
      section: "po_ga_mappings",
      details:
        "The Program Outcome to Graduate Attribute mappings need to be reviewed for comprehensive coverage. Ensure each PO is appropriately mapped to relevant Graduate Attributes, particularly focusing on 'Knowledge Competence' and 'Lifelong Learning' attributes which appear underrepresented in current mappings.",
      created_at: "2025-05-19T06:45:28.000000Z",
      version: 3,
    },
  ],
  message: "Department-level revisions fetched successfully.",
};

// Function to transform the proposal data into a normalized format
export const transformProposalData = (data: ProgramProposalResponse) => {
  // Extract basic program info
  const program = {
    id: data.program.id,
    name: data.program.name,
    abbreviation: data.program.abbreviation,
    department_id: data.program.department_id,
    department_name: data.program.department_name,
    department_abbreviation: data.program.department_abbreviation,
  };

  // Extract PEOs
  const peos = data.peos.map((peo) => ({
    id: peo.id,
    statement: peo.statement,
  }));

  // Create PEO to mission mappings
  const peo_mission_mappings = data.peos.flatMap((peo) =>
    peo.missions.map((mission) => ({
      peo_id: peo.id,
      mission_id: mission.id,
    }))
  );

  // Create GA to PEO mappings
  const ga_peo_mappings = data.peos.flatMap((peo) =>
    peo.graduate_attributes.map((ga) => ({
      peo_id: peo.id,
      ga_id: ga.id,
    }))
  );

  // Extract POs
  const pos = data.pos.map((po) => ({
    id: po.id,
    name: po.name,
    statement: po.statement,
  }));

  // Create PO to PEO mappings
  const po_peo_mappings = data.pos.flatMap((po) =>
    po.peos.map((peo) => ({
      po_id: po.id,
      peo_id: peo.id,
    }))
  );

  // Create PO to GA mappings
  const po_ga_mappings = data.pos.flatMap((po) =>
    po.graduate_attributes.map((ga) => ({
      po_id: po.id,
      ga_id: ga.id,
    }))
  );

  // Extract curriculum info
  const curriculum = {
    id: data.curriculum.id,
    name: data.curriculum.name,
  };

  // Extract course categories
  const course_categories = data.curriculum.courses
    .map((course) => course.category)
    .filter(
      (category, index, self) =>
        index === self.findIndex((c) => c.id === category.id)
    );

  // Transform curriculum courses
  const curriculum_courses = data.curriculum.courses.map((course) => ({
    id: course.id,
    course_id: course.course.id,
    course_code: course.course.code,
    course_title: course.course.descriptive_title,
    course_category_id: course.category.id,
    category_code: course.category.code,
    semester_id: course.semester.id,
    semester_year: course.semester.year,
    semester_term: course.semester.sem,
    unit: course.units,
  }));

  // Transform course to PO mappings
  const course_po_mappings = data.curriculum.courses.flatMap((course) =>
    course.po_mappings.map((mapping) => ({
      curriculum_course_id: course.id,
      po_id: mapping.po_id,
      ied: mapping.ied,
    }))
  );

  // Return the transformed data
  return {
    program,
    peos,
    peo_mission_mappings,
    ga_peo_mappings,
    pos,
    po_peo_mappings,
    po_ga_mappings,
    curriculum,
    course_categories,
    curriculum_courses,
    course_po_mappings,
    // Include metadata
    metadata: {
      id: data.id,
      status: data.status,
      version: data.version,
      created_at: data.created_at,
      updated_at: data.updated_at,
      proposed_by: data.proposed_by,
    },
  };
};

// Helper function to get a human-readable section name
export const getSectionDisplayName = (sectionKey: string) => {
  const sectionNames: Record<string, string> = {
    program: "Program Details",
    peos: "Program Educational Objectives",
    "peo-mission-mapping": "PEO to Mission Mapping",
    peo_mission_mappings: "PEO to Mission Mapping",
    "ga-peo-mapping": "GA to PEO Mapping",
    ga_peo_mappings: "GA to PEO Mapping",
    "program-outcomes": "Program Outcomes",
    pos: "Program Outcomes",
    "po-peo-mapping": "PO to PEO Mapping",
    po_peo_mappings: "PO to PEO Mapping",
    "po-ga-mapping": "PO to GA Mapping",
    po_ga_mappings: "PO to GA Mapping",
    curriculum: "Curriculum Structure",
    "course-categories": "Course Categories",
    "curriculum-courses": "Curriculum Courses",
    "course-po-mapping": "Course to PO Mapping",
  };
  return sectionNames[sectionKey] || sectionKey;
};

// Sample departments data for dropdown
export const sampleDepartments = [
  { id: 1, name: "Department of Civil Engineering", abbreviation: "DCE" },
  { id: 2, name: "Department of Computer Science", abbreviation: "DCS" },
  { id: 3, name: "Department of Electrical Engineering", abbreviation: "DEE" },
  { id: 4, name: "Department of Mechanical Engineering", abbreviation: "DME" },
];
