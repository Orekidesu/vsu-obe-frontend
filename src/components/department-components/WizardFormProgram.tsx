"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import usePrograms from "@/hooks/shared/useProgram";
import useMissions from "@/hooks/shared/useMission";
import useGraduateAttributes from "@/hooks/shared/useGraduateAttribute";
import useCourseCategories from "@/hooks/department/useCourseCategory";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import {
  createFullProgramProposalPayload,
  submitFullProgramProposalHandler,
} from "@/app/utils/department/handleProgramProposal";
import useUsers from "@/hooks/shared/useUser";
import { useState as useFormErrorState } from "react";

import {
  filterActiveNoPendingPrograms,
  getDepartmentPrograms,
} from "@/app/utils/department/programFilter";

import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// Import the step components
import { FormTypeStep } from "./form-steps/FormType";
import { NewProgramStep } from "./form-steps/NewProgram";
import { UpdateProgramStep } from "./form-steps/UpdateProgram";
import { PEOsStep } from "./form-steps/PEO";
import { PEOToMission } from "./form-steps/PEOToMissionMapping";
import { GAToPEOMappingStep } from "@/components/department-components/form-steps/GAToPEOMapping";
import { ProgramOutcomeStep } from "./form-steps/PO";
import { POToPEOMappingStep } from "./form-steps/POToPEOMapping";
import { POToGAMappingStep } from "./form-steps/POToGAMapping";
import { CurriculumStep } from "./form-steps/AddCurriculum";
import { YearSemesterStep } from "./form-steps/YearSemester";
import { CourseCategoriesStep } from "./form-steps/CC";
import { CurriculumCoursesStep } from "./form-steps/CurriculumCourse";
import { CourseToPOMappingStep } from "./form-steps/CourseToPOMapping";
import { CommitteeAssignmentStep } from "./form-steps/CommitteeAssignment";
import { CommitteeCourseAssignmentStep } from "./form-steps/CommitteeCourseAssignment";
import { ReviewStep } from "./form-steps/ReviewSteps";
import useCourses from "@/hooks/department/useCourse";

export default function WizardFormProgram() {
  // const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [, setFormError] = useFormErrorState<
    Record<string, string[]> | string | null
  >(null);

  const {
    formType,
    programName,
    programAbbreviation,
    selectedProgram,
    curriculumName,
    academicYear,
    yearSemesters,
    courseCategories,
    curriculumCourses,
    courseToPOMappings,
    setFormType,
    setProgramName,
    setProgramAbbreviation,
    setSelectedProgram,
    setAcademicYear,
    setYearSemesters,
    removeYearSemester,
    addCourseCategory,
    removeCourseCategory,
    addCourse,
    addCurriculumCourse,
    updateCurriculumCourse,
    removeCurriculumCourse,
    updateCourseToPOMapping,
    updateCourseCategory,
    setCurriculumName,
    peos,
    programOutcomes,
    graduateAttributes,
    peoToMissionMappings,
    gaToPEOMappings,
    poToGAMappings,
    programTemplates,
    premadeCourseCategories,
    addPEO,
    updatePEO,
    removePEO,
    addProgramOutcome,
    updateProgramOutcome,
    removeProgramOutcome,
    toggleMapping,
    toggleGAToPEOMapping,
    setGraduateAttributes,
    setPremadeCourseCategories,
    setPremadeCourses,
    poToPEOMappings,
    togglePOToPEOMapping,
    togglePOToGAMapping,

    committees,
    selectedCommittees,
    setSelectedCommittees,
    committeeCourseAssignments,
    addCommittee,
    removeCommittee,
    setCommittees,
    assignCourseToCommittee,
    removeCourseAssignment,
    getCommitteeForCourse,
    currentStep,
    setCurrentStep,
  } = useWizardStore();

  const { programs, isLoading: programsLoading } = usePrograms();
  const { missions, isFetching: missionsLoading } = useMissions();
  const { graduateAttributes: fetchedGAs, isFetching: gasLoading } =
    useGraduateAttributes({ role: "department" });
  const { courseCategories: fetchedCategories, isLoading: categoriesLoading } =
    useCourseCategories();
  const { users: fetchedUsers, isLoading: usersLoading } = useUsers({
    role: "department",
  });
  const { courses: fetchedCourses, isLoading: coursesLoading } = useCourses();

  const { submitFullProgramProposal } = useProgramProposals();
  const { session } = useAuth() as { session: Session | null };

  const departmentId = session?.Department?.id;

  // const activePrograms = filterActivePrograms(programs, departmentId);
  const departmentPrograms = getDepartmentPrograms(programs, departmentId);

  const activeNoPendingPrograms = filterActiveNoPendingPrograms(
    programs,
    departmentId
  );

  // GAS
  // Load graduate attributes when they are fetched
  useEffect(() => {
    if (fetchedGAs && fetchedGAs.length > 0) {
      setGraduateAttributes(fetchedGAs);
    }
    if (fetchedCategories && fetchedCategories.length > 0) {
      setPremadeCourseCategories(fetchedCategories);
    } else if (fetchedCategories) {
      setPremadeCourseCategories([]);
    }
  }, [
    fetchedGAs,
    setGraduateAttributes,
    fetchedCategories,
    setPremadeCourseCategories,
  ]);

  // Courses
  useEffect(() => {
    if (fetchedCourses && departmentId) {
      // Move the filtering logic inside the effect

      if (fetchedCourses.length > 0) {
        // Transform API courses to match the expected format if necessary
        const formattedCourses = fetchedCourses.map((course) => ({
          id: course.id,
          code: course.code,
          descriptive_title: course.descriptive_title,
        }));

        // Update the store with fetched courses
        setPremadeCourses(formattedCourses);
      } else {
        setPremadeCourses([]);
      }
    }
  }, [fetchedCourses, departmentId, setPremadeCourses]);

  // Users/Committees
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      // Filter users who are faculty member or faculty (potential committee members)
      const potentialCommittees = fetchedUsers.filter(
        (user) => user.role?.name === "Faculty_Member"
      );

      // Transform users to Committee format
      const formattedCommittees = potentialCommittees.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
      }));

      // Update the store with transformed committees
      setCommittees(formattedCommittees);
    }
  }, [fetchedUsers, setCommittees]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };
  const handleSubmit = async () => {
    // Create form data object from wizard store state
    const formData = {
      programName,
      programAbbreviation,
      peos: peos.map((peo) => ({
        id: String(peo.id), // Convert id to string
        statement: peo.statement,
      })),
      programOutcomes: programOutcomes.map((po) => ({
        id: String(po.id), // Convert id to string
        name: po.name,
        statement: po.statement,
      })),
      peoToMissionMappings: peoToMissionMappings.map((mapping) => ({
        peoId: String(mapping.peoId), // Convert id to string
        missionId: mapping.missionId,
      })),
      gaToPEOMappings: gaToPEOMappings.map((mapping) => ({
        peoId: String(mapping.peoId), // Convert id to string
        gaId: mapping.gaId,
      })),
      poToPEOMappings: poToPEOMappings.map((mapping) => ({
        poId: String(mapping.poId), // Convert id to string
        peoId: String(mapping.peoId), // Convert id to string
      })),
      poToGAMappings: poToGAMappings.map((mapping) => ({
        poId: String(mapping.poId), // Convert id to string
        gaId: mapping.gaId,
      })),
      curriculumName,
      yearSemesters: yearSemesters.map((ys) => ({
        id: String(ys.id), // Convert id to string
        year: ys.year,
        semester: ys.semester,
      })),
      courseCategories: courseCategories.map((cat) => ({
        id: String(cat.id), // Convert id to string
        name: cat.name,
        code: cat.code,
      })),
      curriculumCourses: curriculumCourses.map((course) => ({
        id: String(course.id), // Convert id to string
        code: course.code,
        title: course.descriptive_title,
        yearSemesterId: String(course.yearSemesterId), // Convert id to string
        categoryId: String(course.categoryId), // Convert id to string
        units: course.units,
      })),
      courseToPOMappings: courseToPOMappings.map((mapping) => ({
        courseId: String(mapping.courseId), // Convert id to string
        poId: String(mapping.poId), // Convert id to string
        contributionLevels: mapping.contributionLevels,
      })),

      selectedCommittees,
      committeeCourseAssignments: committeeCourseAssignments.map(
        (assignment) => ({
          committeeId: assignment.committeeId,
          courseId: String(assignment.courseId),
        })
      ),
    };

    // Transform data into the required payload format using the utility function
    const payload = createFullProgramProposalPayload(formData);

    // Log payload for debugging
    console.log("Submitting payload:", payload);

    try {
      // Use the handler to submit the proposal
      await submitFullProgramProposalHandler(
        submitFullProgramProposal,
        payload,
        setFormError
      );

      // Reset form on successful submission
      resetForm();
    } catch (error) {
      console.error("Error submitting program proposal:", error);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormType("");
    setProgramName("");
    setProgramAbbreviation("");
    setSelectedProgram("");
    setAcademicYear("");
    setCurriculumName("");
    setYearSemesters([]);
    // pwede mag add later
    localStorage.removeItem("program-wizard-storage");
  };
  // Calculate progress percentage
  const progressValue = (currentStep / 16) * 100;
  const isStepValid = () => {
    if (currentStep === 1) return !!formType;
    if (currentStep === 2) {
      if (formType === "new") {
        // Check if program already exists
        // const programExists = activePrograms.some(
        //   (program) => program.name.toLowerCase() === programName.toLowerCase()
        // );
        const programExists = programs?.some(
          (program) =>
            program.name.toLowerCase() === programName.toLowerCase() ||
            program.abbreviation.toLowerCase() ===
              programAbbreviation.toLowerCase()
        );
        return !!programName && !!programAbbreviation && !programExists;
      } else {
        return !!selectedProgram;
      }
    }
    if (currentStep === 3) {
      return (
        peos.length > 0 && peos.every((peo) => peo.statement.trim() !== "")
      );
    }
    if (currentStep === 4) {
      // At least one mapping per PEO is required
      return peos.every((peo) =>
        peoToMissionMappings.some((mapping) => mapping.peoId === peo.id)
      );
    }
    if (currentStep === 5) {
      // At least one GA to PEO mapping per GA is required
      return graduateAttributes.every((ga) =>
        gaToPEOMappings.some((mapping) => mapping.gaId === ga.id)
      );
    }

    if (currentStep === 6) {
      return (
        programOutcomes.length > 0 &&
        programOutcomes.every(
          (po) => po.name.trim() !== "" && po.statement.trim() !== ""
        )
      );
    }

    if (currentStep === 7) {
      // Each PO should map to at least one PEO
      return programOutcomes.every((po) =>
        poToPEOMappings.some((mapping) => mapping.poId === po.id)
      );
    }
    if (currentStep === 8) {
      // At least one PO to GA mapping per PO is required
      return programOutcomes.every((po) =>
        poToGAMappings.some((mapping) => mapping.poId === po.id)
      );
    }
    if (currentStep === 9) {
      // Curriculum name and academic year are required
      return !!curriculumName && /^\d{4}-\d{4}$/.test(academicYear);
    }
    if (currentStep === 10) {
      // At least one year-semester combination is required
      return yearSemesters.length > 0;
    }
    if (currentStep === 11) {
      // At least one course category is required
      return courseCategories.length > 0;
    }
    // if (currentStep === 12) {
    //   // At least one curriculum course is required
    //   return curriculumCourses.length > 0;
    // }
    if (currentStep === 12) {
      // First check if we have any courses at all
      if (curriculumCourses.length === 0) {
        return false;
      }

      // Check if all year-semesters have at least one course
      const yearSemestersWithCourses = new Set(
        curriculumCourses.map((course) => course.yearSemesterId)
      );

      // Make sure every yearSemester ID has at least one course
      return yearSemesters.every((ys) =>
        yearSemestersWithCourses.has(ys.id.toString())
      );
    }

    if (currentStep === 13) {
      // At least one course to PO mapping is required
      return courseToPOMappings.length > 0;
    }
    if (currentStep === 14) {
      // At least one committee is required
      return selectedCommittees.length > 0;
    }
    if (currentStep === 15) {
      // All courses must be assigned to committees
      return (
        curriculumCourses.length > 0 &&
        curriculumCourses.every((course) =>
          committeeCourseAssignments.some(
            (assignment) => assignment.courseId === course.id
          )
        )
      );
    }
    if (currentStep === 16) {
      // Review currentStep is always valid
      return isConfirmed;
    }

    return false;
  };
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        Propose a Program
      </h1>

      {/* Step 1: Select form type */}
      {currentStep === 1 && (
        <FormTypeStep formType={formType} setFormType={setFormType} />
      )}

      {/* Step 2: New program details */}
      {currentStep === 2 && formType === "new" && (
        <NewProgramStep
          programName={programName}
          programAbbreviation={programAbbreviation}
          setProgramName={setProgramName}
          setProgramAbbreviation={setProgramAbbreviation}
          // activePrograms={activePrograms}
          departmentPrograms={departmentPrograms}
        />
      )}

      {/* Step 2: Select program to update */}
      {currentStep === 2 && formType === "update" && (
        <UpdateProgramStep
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          activePrograms={activeNoPendingPrograms}
          programsLoading={programsLoading}
        />
      )}

      {/* Step 3: Program Educational Objectives */}
      {currentStep === 3 && (
        <PEOsStep
          peos={peos}
          addPEO={addPEO}
          updatePEO={updatePEO}
          removePEO={removePEO}
        />
      )}

      {/* Step 4: PEOs to Mission Mapping */}
      {currentStep === 4 && (
        <PEOToMission
          peos={peos}
          missions={missions || []}
          mappings={peoToMissionMappings}
          toggleMapping={toggleMapping}
          isLoading={missionsLoading}
        />
      )}

      {/* Step 5: Graduate Attributes to PEOs Mapping */}
      {currentStep === 5 && (
        <GAToPEOMappingStep
          peos={peos}
          graduateAttributes={graduateAttributes}
          gaToPEOMappings={gaToPEOMappings}
          toggleGAToPEOMapping={toggleGAToPEOMapping}
          isLoading={gasLoading}
        />
      )}

      {/* Step 6: Program Outcomes */}
      {currentStep === 6 && (
        <ProgramOutcomeStep
          programOutcomes={programOutcomes}
          addProgramOutcome={addProgramOutcome}
          updateProgramOutcome={updateProgramOutcome}
          removeProgramOutcome={removeProgramOutcome}
        />
      )}
      {/* Step 7: Program Outcomes to PEOs Mapping */}
      {currentStep === 7 && (
        <POToPEOMappingStep
          peos={peos}
          programOutcomes={programOutcomes}
          poToPEOMappings={poToPEOMappings}
          togglePOToPEOMapping={togglePOToPEOMapping}
        />
      )}
      {/* Step 8: Program Outcomes to Graduate Attributes Mapping */}
      {currentStep === 8 && (
        <POToGAMappingStep
          programOutcomes={programOutcomes}
          graduateAttributes={graduateAttributes}
          poToGAMappings={poToGAMappings}
          togglePOToGAMapping={togglePOToGAMapping}
        />
      )}
      {/* Step 9: Curriculum Details */}
      {currentStep === 9 && (
        <CurriculumStep
          programAbbreviation={programAbbreviation}
          curriculumName={curriculumName}
          academicYear={academicYear}
          setCurriculumName={setCurriculumName}
          setAcademicYear={setAcademicYear}
        />
      )}
      {/* Step 10: Year and Semester Selection */}
      {currentStep === 10 && (
        <YearSemesterStep
          yearSemesters={yearSemesters}
          programTemplates={programTemplates}
          setYearSemesters={setYearSemesters}
          removeYearSemester={removeYearSemester}
        />
      )}
      {/* Step 11: Course Categories */}
      {currentStep === 11 && (
        <CourseCategoriesStep
          courseCategories={courseCategories}
          addCourseCategory={addCourseCategory}
          updateCourseCategory={updateCourseCategory}
          removeCourseCategory={removeCourseCategory}
          premadeCourseCategories={premadeCourseCategories}
          isLoading={categoriesLoading}
        />
      )}
      {/* Step 12: Curriculum Courses */}
      {currentStep === 12 && (
        <CurriculumCoursesStep
          premadeCourses={fetchedCourses || []}
          courseCategories={courseCategories}
          yearSemesters={yearSemesters}
          curriculumCourses={curriculumCourses}
          addCourse={addCourse}
          addCurriculumCourse={addCurriculumCourse}
          updateCurriculumCourse={updateCurriculumCourse}
          removeCurriculumCourse={removeCurriculumCourse}
          isLoading={coursesLoading}
        />
      )}
      {/* Step 13: Course to PO Mapping */}
      {currentStep === 13 && (
        <CourseToPOMappingStep
          curriculumCourses={curriculumCourses}
          programOutcomes={programOutcomes}
          courseToPOMappings={courseToPOMappings}
          updateCourseToPOMapping={updateCourseToPOMapping}
        />
      )}
      {/* Step 14: Committee Assignment */}
      {currentStep === 14 && (
        <CommitteeAssignmentStep
          committees={committees}
          selectedCommittees={selectedCommittees}
          addCommittee={addCommittee}
          removeCommittee={removeCommittee}
          setSelectedCommittees={setSelectedCommittees}
          isLoading={usersLoading}
        />
      )}
      {/* Step 15: Committee Course Assignment */}
      {currentStep === 15 && (
        <CommitteeCourseAssignmentStep
          committees={committees}
          selectedCommittees={selectedCommittees}
          curriculumCourses={curriculumCourses}
          yearSemesters={yearSemesters}
          committeeCourseAssignments={committeeCourseAssignments}
          assignCourseToCommittee={assignCourseToCommittee}
          removeCourseAssignment={removeCourseAssignment}
          getCommitteeForCourse={getCommitteeForCourse}
        />
      )}

      {/* Step 16: Review */}
      {currentStep === 16 && (
        <ReviewStep
          formType={formType}
          programName={programName}
          programAbbreviation={programAbbreviation}
          selectedProgram={selectedProgram}
          curriculumName={curriculumName}
          academicYear={academicYear}
          yearSemesters={yearSemesters}
          courseCategories={courseCategories}
          curriculumCourses={curriculumCourses}
          courseToPOMappings={courseToPOMappings}
          peos={peos}
          programOutcomes={programOutcomes}
          missions={missions || []}
          graduateAttributes={graduateAttributes}
          peoToMissionMappings={peoToMissionMappings}
          gaToPEOMappings={gaToPEOMappings}
          poToPEOMappings={poToPEOMappings}
          poToGAMappings={poToGAMappings}
          committees={committees}
          selectedCommittees={selectedCommittees}
          committeeCourseAssignments={committeeCourseAssignments}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
          goToStep={goToStep}
        />
      )}

      {/* Progress bar */}
      <div className="mt-12 mb-8">
        <Progress value={progressValue} className="h-2 bg-gray-200" />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}

        <div className="ml-auto">
          {currentStep < 16 && (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          )}

          {currentStep === 16 && (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
