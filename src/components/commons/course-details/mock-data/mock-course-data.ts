export const mockCourseData = {
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
      id: 50,
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
          ied: "E",
        },
        {
          po_id: 80,
          po_name: "PO2",
          po_statement:
            "Design and conduct experiments, as well as analyze and interpret data.",
          ied: "I",
        },
        {
          po_id: 82,
          po_name: "PO4",
          po_statement:
            "Design systems, components, or processes to meet desired needs.",
          ied: "I",
        },
      ],
      tla_tasks: [
        {
          id: 91,
          at_code: "HW1",
          at_name: "Circuit Analysis Homework",
          at_tool: "Problem Sets",
          weight: "10.00",
        },
        {
          id: 92,
          at_code: "LAB1",
          at_name: "Circuit Laboratory Exercise",
          at_tool: "Laboratory Report",
          weight: "15.00",
        },
        {
          id: 93,
          at_code: "Q1",
          at_name: "Circuit Analysis Quiz",
          at_tool: "Written Exam",
          weight: "10.00",
        },
      ],
      tla_assessment_method: {
        id: 27,
        teaching_methods: [
          "Lecture",
          "Problem Solving",
          "Laboratory Work",
          "Demonstration",
        ],
        learning_resources: [
          "Textbooks",
          "Circuit Simulation Software",
          "Laboratory Equipment",
          "Online Tutorials",
        ],
      },
    },
    {
      id: 51,
      name: "Electrical Safety and Standards",
      statement:
        "Students will be able to identify electrical hazards, apply safety protocols, and demonstrate understanding of electrical codes and standards in laboratory and field environments.",
      abcd: {
        audience: "Students",
        behavior: "Identify and Apply",
        condition: "electrical hazards and safety protocols",
        degree: "demonstrate understanding of electrical codes and standards",
      },
      cpa: "A",
      po_mappings: [
        {
          po_id: 83,
          po_name: "PO5",
          po_statement:
            "Recognize professional and ethical responsibilities in engineering situations.",
          ied: "E",
        },
        {
          po_id: 84,
          po_name: "PO6",
          po_statement: "Communicate effectively with a range of audiences.",
          ied: "I",
        },
        {
          po_id: 85,
          po_name: "PO7",
          po_statement:
            "Understand the impact of engineering solutions in a global context.",
          ied: "I",
        },
      ],
      tla_tasks: [
        {
          id: 94,
          at_code: "SP1",
          at_name: "Safety Protocol Presentation",
          at_tool: "Presentation Rubric",
          weight: "8.00",
        },
        {
          id: 95,
          at_code: "SE1",
          at_name: "Safety Exam",
          at_tool: "Multiple Choice Test",
          weight: "12.00",
        },
      ],
      tla_assessment_method: {
        id: 28,
        teaching_methods: [
          "Lecture",
          "Case Study",
          "Field Trip",
          "Group Discussion",
        ],
        learning_resources: [
          "Safety Manuals",
          "Code Books",
          "Video Materials",
          "Industry Standards",
        ],
      },
    },
    {
      id: 52,
      name: "Basic Electronics Components",
      statement:
        "Students will be able to identify, test, and analyze the behavior of basic electronic components including diodes, transistors, and operational amplifiers in simple circuits.",
      abcd: {
        audience: "Students",
        behavior: "Identify, Test, and Analyze",
        condition: "basic electronic components in simple circuits",
        degree:
          "analyze behavior of diodes, transistors, and operational amplifiers",
      },
      cpa: "P",
      po_mappings: [
        {
          po_id: 79,
          po_name: "PO1",
          po_statement:
            "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
          ied: "E",
        },
        {
          po_id: 80,
          po_name: "PO2",
          po_statement:
            "Design and conduct experiments, as well as analyze and interpret data.",
          ied: "E",
        },
        {
          po_id: 86,
          po_name: "PO8",
          po_statement:
            "Use techniques, skills, and modern engineering tools for engineering practice.",
          ied: "D",
        },
      ],
      tla_tasks: [
        {
          id: 96,
          at_code: "LAB2",
          at_name: "Component Testing Lab",
          at_tool: "Laboratory Report",
          weight: "18.00",
        },
        {
          id: 97,
          at_code: "PR1",
          at_name: "Circuit Design Project",
          at_tool: "Project Rubric",
          weight: "22.00",
        },
      ],
      tla_assessment_method: {
        id: 29,
        teaching_methods: [
          "Laboratory Work",
          "Hands-on Practice",
          "Demonstration",
          "Project-Based Learning",
        ],
        learning_resources: [
          "Electronic Components",
          "Multimeters",
          "Oscilloscopes",
          "Circuit Breadboards",
          "Datasheets",
        ],
      },
    },
    {
      id: 53,
      name: "Mathematical Foundations for Electrical Engineering",
      statement:
        "Students will be able to apply complex numbers, phasors, and Fourier analysis to solve electrical engineering problems involving AC circuits and signal processing.",
      abcd: {
        audience: "Students",
        behavior: "Apply Mathematical Concepts",
        condition: "complex numbers, phasors, and Fourier analysis",
        degree:
          "solve electrical engineering problems involving AC circuits and signal processing",
      },
      cpa: "C",
      po_mappings: [
        {
          po_id: 79,
          po_name: "PO1",
          po_statement:
            "Apply knowledge of mathematics, science, and engineering to solve complex electrical engineering problems.",
          ied: "D",
        },
        {
          po_id: 87,
          po_name: "PO9",
          po_statement:
            "Engage in life-long learning and adapt to changing technology.",
          ied: "I",
        },
      ],
      tla_tasks: [
        {
          id: 98,
          at_code: "HW2",
          at_name: "Mathematical Problem Sets",
          at_tool: "Problem Sets",
          weight: "12.00",
        },
        {
          id: 99,
          at_code: "FE",
          at_name: "Final Examination",
          at_tool: "Comprehensive Exam",
          weight: "30.00",
        },
      ],
      tla_assessment_method: {
        id: 30,
        teaching_methods: [
          "Lecture",
          "Problem Solving",
          "Tutorial Sessions",
          "Peer Learning",
        ],
        learning_resources: [
          "Mathematics Textbooks",
          "Engineering Software",
          "Online Problem Banks",
          "Study Groups",
        ],
      },
    },
  ],
};
