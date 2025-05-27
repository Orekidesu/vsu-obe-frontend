// Sample revision requests data with all possible department sections

// Sample curriculum courses data

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
