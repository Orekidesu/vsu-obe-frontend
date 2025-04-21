"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

// Import edit section components
import { ProgramDetailsEdit } from "@/components/department-components/edit-proposal/program-details-edit";
import { PEOsEdit } from "@/components/department-components/edit-proposal/peos-edit";
import { ProgramOutcomesEdit } from "@/components/department-components/edit-proposal/program-outcomes-edit";
import { MappingsEdit } from "@/components/department-components/edit-proposal/mappings-edit";
import { CurriculumDetailsEdit } from "@/components/department-components/edit-proposal/curriculum-details-edit";
import { ProgramStructureEdit } from "@/components/department-components/edit-proposal/program-structure-edit";
import { CourseCategoriesEdit } from "@/components/department-components/edit-proposal/course-categories-edit";
import { CurriculumCoursesEdit } from "@/components/department-components/edit-proposal/curriculum-courses-edit";
import { CoursePOMappingEdit } from "@/components/department-components/edit-proposal/course-po-mappings-edit";

// Sample payload (same as in review page)
const samplePayload = {
  program: {
    name: "Bachelor of Science in Computer Science",
    abbreviation: "BSCS",
  },
  peos: [
    {
      statement:
        "Produce graduates who can apply computing knowledge to solve real-world problems",
    },
    {
      statement:
        "Develop professionals who can adapt to emerging technologies and industry demands",
    },
    {
      statement:
        "Foster leaders who can contribute to the advancement of computing and society",
    },
  ],
  peo_mission_mappings: [
    { peo_index: 0, mission_id: 1 },
    { peo_index: 0, mission_id: 2 },
    { peo_index: 1, mission_id: 2 },
    { peo_index: 1, mission_id: 3 },
    { peo_index: 2, mission_id: 4 },
    { peo_index: 2, mission_id: 5 },
  ],
  ga_peo_mappings: [
    { peo_index: 0, ga_id: 1 },
    { peo_index: 0, ga_id: 2 },
    { peo_index: 1, ga_id: 3 },
    { peo_index: 1, ga_id: 5 },
    { peo_index: 2, ga_id: 7 },
    { peo_index: 2, ga_id: 9 },
  ],
  pos: [
    {
      name: "Problem Analysis",
      statement:
        "Analyze complex computing problems and apply principles of computing to identify solutions",
    },
    {
      name: "Design Development",
      statement:
        "Design, implement, and evaluate computing-based solutions to meet a given set of requirements",
    },
    {
      name: "Modern Tools",
      statement:
        "Create, select, and apply appropriate techniques and resources for computing practices",
    },
    {
      name: "Ethics",
      statement:
        "Apply ethical principles and commit to professional ethics and responsibilities",
    },
  ],
  po_peo_mappings: [
    { po_index: 0, peo_index: 0 },
    { po_index: 1, peo_index: 0 },
    { po_index: 1, peo_index: 1 },
    { po_index: 2, peo_index: 1 },
    { po_index: 3, peo_index: 2 },
  ],
  po_ga_mappings: [
    { po_index: 0, ga_id: 2 },
    { po_index: 1, ga_id: 3 },
    { po_index: 2, ga_id: 5 },
    { po_index: 3, ga_id: 7 },
  ],
  curriculum: {
    name: "BSCS",
  },
  semesters: [
    { year: 1, sem: "first" },
    { year: 1, sem: "second" },
    { year: 2, sem: "first" },
    { year: 2, sem: "second" },
    { year: 3, sem: "first" },
    { year: 3, sem: "second" },
    { year: 4, sem: "first" },
    { year: 4, sem: "second" },
  ],
  course_categories: [
    { name: "General Education", code: "GE" },
    { name: "Core Courses", code: "CORE" },
    { name: "Major Courses", code: "MAJOR" },
    { name: "Elective Courses", code: "ELECT" },
    { name: "Thesis/Capstone", code: "THESIS" },
  ],
  courses: [
    { code: "CSIT 101", descriptive_title: "Introduction to Computing" },
    { code: "CSIT 102", descriptive_title: "Computer Programming 1" },
    { code: "CSIT 103", descriptive_title: "Computer Programming 2" },
    { code: "MATH 101", descriptive_title: "College Algebra" },
    { code: "MATH 102", descriptive_title: "Discrete Mathematics" },
    { code: "ENGL 101", descriptive_title: "Communication Skills 1" },
    { code: "CSIT 201", descriptive_title: "Data Structures and Algorithms" },
    { code: "CSIT 202", descriptive_title: "Object-Oriented Programming" },
    { code: "CSIT 301", descriptive_title: "Database Systems" },
    { code: "CSIT 401", descriptive_title: "Capstone Project 1" },
    { code: "CSIT 402", descriptive_title: "Capstone Project 2" },
  ],
  curriculum_courses: [
    {
      course_code: "CSIT 101",
      category_code: "CORE",
      semester_year: 1,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "MATH 101",
      category_code: "GE",
      semester_year: 1,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "ENGL 101",
      category_code: "GE",
      semester_year: 1,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "CSIT 102",
      category_code: "CORE",
      semester_year: 1,
      semester_name: "second",
      units: 3,
    },
    {
      course_code: "MATH 102",
      category_code: "CORE",
      semester_year: 1,
      semester_name: "second",
      units: 3,
    },
    {
      course_code: "CSIT 103",
      category_code: "CORE",
      semester_year: 1,
      semester_name: "second",
      units: 3,
    },
    {
      course_code: "CSIT 201",
      category_code: "MAJOR",
      semester_year: 2,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "CSIT 202",
      category_code: "MAJOR",
      semester_year: 2,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "CSIT 301",
      category_code: "MAJOR",
      semester_year: 3,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "CSIT 401",
      category_code: "THESIS",
      semester_year: 4,
      semester_name: "first",
      units: 3,
    },
    {
      course_code: "CSIT 402",
      category_code: "THESIS",
      semester_year: 4,
      semester_name: "second",
      units: 3,
    },
  ],
  course_po_mappings: [
    { course_code: "CSIT 101", po_code: "Problem Analysis", ird: ["I"] },
    { course_code: "CSIT 102", po_code: "Problem Analysis", ird: ["I", "R"] },
    { course_code: "CSIT 103", po_code: "Problem Analysis", ird: ["R"] },
    { course_code: "CSIT 201", po_code: "Problem Analysis", ird: ["R", "D"] },
    { course_code: "CSIT 202", po_code: "Design Development", ird: ["I", "R"] },
    { course_code: "CSIT 301", po_code: "Design Development", ird: ["R", "D"] },
    { course_code: "CSIT 301", po_code: "Modern Tools", ird: ["I", "R"] },
    { course_code: "CSIT 401", po_code: "Modern Tools", ird: ["R", "D"] },
    { course_code: "CSIT 401", po_code: "Ethics", ird: ["I"] },
    { course_code: "CSIT 402", po_code: "Ethics", ird: ["R", "D"] },
  ],
};

// Mission statements for reference
const missions = [
  {
    id: 1,
    statement:
      "Provide high-quality education that prepares students for professional careers",
  },
  {
    id: 2,
    statement:
      "Foster innovation and critical thinking through research and creative activities",
  },
  {
    id: 3,
    statement:
      "Promote diversity, equity, and inclusion in all aspects of education",
  },
  {
    id: 4,
    statement: "Engage with the community to address societal challenges",
  },
  {
    id: 5,
    statement:
      "Develop ethical leaders who contribute to global sustainability",
  },
];

// Graduate attributes for reference
const graduateAttributes = [
  {
    id: 1,
    statement:
      "Discipline Knowledge: Demonstrate comprehensive understanding of core concepts and principles in the field",
  },
  {
    id: 2,
    statement:
      "Problem Solving: Apply analytical thinking to identify, formulate, and solve complex problems",
  },
  {
    id: 3,
    statement:
      "Design/Development: Design solutions for complex problems that meet specified needs",
  },
  {
    id: 4,
    statement:
      "Investigation: Conduct investigations of complex problems using research-based knowledge",
  },
  {
    id: 5,
    statement:
      "Modern Tools: Create, select, and apply appropriate techniques and resources for engineering activities",
  },
  {
    id: 6,
    statement:
      "Society & Environment: Understand the impact of professional solutions in societal and environmental contexts",
  },
  {
    id: 7,
    statement:
      "Ethics: Apply ethical principles and commit to professional ethics and responsibilities",
  },
  {
    id: 8,
    statement:
      "Individual & Team Work: Function effectively as an individual and as a member/leader in diverse teams",
  },
  {
    id: 9,
    statement:
      "Communication: Communicate effectively with a range of audiences through various media",
  },
  {
    id: 10,
    statement:
      "Project Management: Demonstrate knowledge and understanding of management principles in multidisciplinary environments",
  },
];

export default function EditProgramPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "program-details",
  ]);
  const [programData, setProgramData] = useState(samplePayload);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get semester display name
  const getSemesterName = (semesterCode: string) => {
    switch (semesterCode) {
      case "first":
        return "First Semester";
      case "second":
        return "Second Semester";
      case "midyear":
        return "Midyear";
      default:
        return semesterCode;
    }
  };

  // Update program details
  const updateProgramDetails = (name: string, abbreviation: string) => {
    setProgramData({
      ...programData,
      program: {
        name,
        abbreviation,
      },
    });
  };

  // Update PEOs
  const updatePEOs = (peos: { statement: string }[]) => {
    setProgramData({
      ...programData,
      peos,
    });
  };

  // Update Program Outcomes
  const updateProgramOutcomes = (
    pos: { name: string; statement: string }[]
  ) => {
    setProgramData({
      ...programData,
      pos,
    });
  };

  // Update PEO Mission Mappings
  const updatePEOMissionMappings = (
    mappings: { peo_index: number; mission_id: number }[]
  ) => {
    setProgramData({
      ...programData,
      peo_mission_mappings: mappings,
    });
  };

  // Update GA PEO Mappings
  const updateGAPEOMappings = (
    mappings: { peo_index: number; ga_id: number }[]
  ) => {
    setProgramData({
      ...programData,
      ga_peo_mappings: mappings,
    });
  };

  // Update PO PEO Mappings
  const updatePOPEOMappings = (
    mappings: { po_index: number; peo_index: number }[]
  ) => {
    setProgramData({
      ...programData,
      po_peo_mappings: mappings,
    });
  };

  // Update PO GA Mappings
  const updatePOGAMappings = (
    mappings: { po_index: number; ga_id: number }[]
  ) => {
    setProgramData({
      ...programData,
      po_ga_mappings: mappings,
    });
  };

  // Update Curriculum Details
  const updateCurriculumDetails = (name: string) => {
    setProgramData({
      ...programData,
      curriculum: {
        name,
      },
    });
  };

  // Update Semesters
  const updateSemesters = (semesters: { year: number; sem: string }[]) => {
    setProgramData({
      ...programData,
      semesters,
    });
  };

  // Update Course Categories
  const updateCourseCategories = (
    categories: { name: string; code: string }[]
  ) => {
    setProgramData({
      ...programData,
      course_categories: categories,
    });
  };

  // Update Courses
  const updateCourses = (
    courses: { code: string; descriptive_title: string }[]
  ) => {
    setProgramData({
      ...programData,
      courses,
    });
  };

  // Update Curriculum Courses
  const updateCurriculumCourses = (
    curriculumCourses: {
      course_code: string;
      category_code: string;
      semester_year: number;
      semester_name: string;
      units: number;
    }[]
  ) => {
    setProgramData({
      ...programData,
      curriculum_courses: curriculumCourses,
    });
  };

  // Update Course PO Mappings
  const updateCoursePOMappings = (
    mappings: { course_code: string; po_code: string; ird: string[] }[]
  ) => {
    setProgramData({
      ...programData,
      course_po_mappings: mappings,
    });
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    setSaveSuccess(true);
    setIsSaving(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Program Proposal
          </h1>
          <p className="text-gray-600 mt-1">
            Make changes to your program proposal
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />{" "}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">
            {programData.program.name} ({programData.program.abbreviation})
          </h2>
          <p className="text-gray-600 mt-1">
            Curriculum: {programData.curriculum.name} | Courses:{" "}
            {programData.curriculum_courses.length}
          </p>
        </div>
      </Card>

      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        {/* Program Details Section */}
        <AccordionItem
          value="program-details"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Program Details</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <ProgramDetailsEdit
              programName={programData.program.name}
              programAbbreviation={programData.program.abbreviation}
              updateProgramDetails={updateProgramDetails}
            />
          </AccordionContent>
        </AccordionItem>

        {/* PEOs Section */}
        <AccordionItem
          value="peos"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">
                Program Educational Objectives (PEOs)
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <PEOsEdit peos={programData.peos} updatePEOs={updatePEOs} />
          </AccordionContent>
        </AccordionItem>

        {/* Mappings Section */}
        <AccordionItem
          value="mappings"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">PEO Mappings</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <MappingsEdit
              peos={programData.peos}
              missions={missions}
              peoMissionMappings={programData.peo_mission_mappings}
              graduateAttributes={graduateAttributes}
              gaPeoMappings={programData.ga_peo_mappings}
              updatePEOMissionMappings={updatePEOMissionMappings}
              updateGAPEOMappings={updateGAPEOMappings}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Program Outcomes Section */}
        <AccordionItem
          value="program-outcomes"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Program Outcomes (POs)</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <ProgramOutcomesEdit
              programOutcomes={programData.pos}
              updateProgramOutcomes={updateProgramOutcomes}
            />
          </AccordionContent>
        </AccordionItem>

        {/* PO Mappings Section */}
        <AccordionItem
          value="po-mappings"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">PO Mappings</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium mb-4">PO to PEO Mapping</h4>
                <MappingsEdit
                  peos={programData.peos}
                  pos={programData.pos}
                  poPeoMappings={programData.po_peo_mappings}
                  updatePOPEOMappings={updatePOPEOMappings}
                  isPOMapping={true}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">
                  PO to Graduate Attribute Mapping
                </h4>
                <MappingsEdit
                  pos={programData.pos}
                  graduateAttributes={graduateAttributes}
                  poGaMappings={programData.po_ga_mappings}
                  updatePOGAMappings={updatePOGAMappings}
                  isPOGAMapping={true}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Curriculum Details Section */}
        <AccordionItem
          value="curriculum-details"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Curriculum Details</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <CurriculumDetailsEdit
              curriculumName={programData.curriculum.name}
              updateCurriculumDetails={updateCurriculumDetails}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Program Structure Section */}
        <AccordionItem
          value="program-structure"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Program Structure</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <ProgramStructureEdit
              semesters={programData.semesters}
              updateSemesters={updateSemesters}
              getSemesterName={getSemesterName}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Course Categories Section */}
        <AccordionItem
          value="course-categories"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Course Categories</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <CourseCategoriesEdit
              categories={programData.course_categories}
              updateCourseCategories={updateCourseCategories}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Curriculum Courses Section */}
        <AccordionItem
          value="curriculum-courses"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Curriculum Courses</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <CurriculumCoursesEdit
              courses={programData.courses}
              curriculumCourses={programData.curriculum_courses}
              categories={programData.course_categories}
              semesters={programData.semesters}
              updateCourses={updateCourses}
              updateCurriculumCourses={updateCurriculumCourses}
              getSemesterName={getSemesterName}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Course PO Mapping Section */}
        <AccordionItem
          value="course-po-mapping"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Course to PO Mapping</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <CoursePOMappingEdit
              courses={programData.courses}
              pos={programData.pos}
              semesters={programData.semesters}
              curriculumCourses={programData.curriculum_courses}
              coursePOMappings={programData.course_po_mappings}
              updateCoursePOMappings={updateCoursePOMappings}
              getSemesterName={getSemesterName}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          disabled={isSaving}
        >
          <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </main>
  );
}
