"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import usePrograms from "@/hooks/department/useProgram";
import useMissions from "@/hooks/shared/useMission";
import useGraduateAttributes from "@/hooks/shared/useGraduateAttribute";
import useProgramProposals from "@/hooks/department/useProgramProposal";
import {
  createFullProgramProposalPayload,
  submitFullProgramProposalHandler,
} from "@/app/utils/department/handleProgramPrposal";
import { useState as useFormErrorState } from "react";

import { filterActivePrograms } from "@/app/utils/department/programFilter";
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
import { ReviewStep } from "./form-steps/ReviewSteps";

export default function WizardForm() {
  const [step, setStep] = useState(1);
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
    premadeCourses,
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
    addPEO,
    updatePEO,
    removePEO,
    addProgramOutcome,
    updateProgramOutcome,
    removeProgramOutcome,
    toggleMapping,
    toggleGAToPEOMapping,
    setGraduateAttributes,
    poToPEOMappings,
    togglePOToPEOMapping,
    togglePOToGAMapping,
  } = useWizardStore();

  const { programs, isLoading: programsLoading } = usePrograms();
  const { missions, isFetching: missionsLoading } = useMissions();
  const { graduateAttributes: fetchedGAs, isFetching: gasLoading } =
    useGraduateAttributes({ role: "department" });
  const { submitFullProgramProposal } = useProgramProposals();
  const { session } = useAuth() as { session: Session | null };

  const departmentId = session?.Department?.id;

  const activePrograms = filterActivePrograms(programs, departmentId);

  // Load graduate attributes when they are fetched
  useEffect(() => {
    if (fetchedGAs && fetchedGAs.length > 0) {
      setGraduateAttributes(fetchedGAs);
    }
  }, [fetchedGAs, setGraduateAttributes]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
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
        title: course.title,
        yearSemesterId: String(course.yearSemesterId), // Convert id to string
        categoryId: String(course.categoryId), // Convert id to string
        units: course.units,
      })),
      courseToPOMappings: courseToPOMappings.map((mapping) => ({
        courseId: String(mapping.courseId), // Convert id to string
        poId: String(mapping.poId), // Convert id to string
        contributionLevels: mapping.contributionLevels,
      })),
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
    setStep(1);
    setFormType("");
    setProgramName("");
    setProgramAbbreviation("");
    setSelectedProgram("");
    setAcademicYear("");
    setCurriculumName("");
    setYearSemesters([]);
    // Additional resets could be added if needed
  };
  // Calculate progress percentage
  const progressValue = (step / 14) * 100;
  const isStepValid = () => {
    if (step === 1) return !!formType;
    if (step === 2) {
      if (formType === "new") {
        // Check if program already exists
        const programExists = activePrograms.some(
          (program) => program.name.toLowerCase() === programName.toLowerCase()
        );
        return !!programName && !!programAbbreviation && !programExists;
      } else {
        return !!selectedProgram;
      }
    }
    if (step === 3) {
      return (
        peos.length > 0 && peos.every((peo) => peo.statement.trim() !== "")
      );
    }
    if (step === 4) {
      // At least one mapping per PEO is required
      return peos.every((peo) =>
        peoToMissionMappings.some((mapping) => mapping.peoId === peo.id)
      );
    }
    if (step === 5) {
      // At least one GA to PEO mapping per GA is required
      return graduateAttributes.every((ga) =>
        gaToPEOMappings.some((mapping) => mapping.gaId === ga.id)
      );
    }

    if (step === 6) {
      return (
        programOutcomes.length > 0 &&
        programOutcomes.every(
          (po) => po.name.trim() !== "" && po.statement.trim() !== ""
        )
      );
    }

    if (step === 7) {
      // Each PO should map to at least one PEO
      return programOutcomes.every((po) =>
        poToPEOMappings.some((mapping) => mapping.poId === po.id)
      );
    }
    if (step === 8) {
      // At least one PO to GA mapping per PO is required
      return programOutcomes.every((po) =>
        poToGAMappings.some((mapping) => mapping.poId === po.id)
      );
    }
    if (step === 9) {
      // Curriculum name and academic year are required
      return !!curriculumName && /^\d{4}-\d{4}$/.test(academicYear);
    }
    if (step === 10) {
      // At least one year-semester combination is required
      return yearSemesters.length > 0;
    }
    if (step === 11) {
      // At least one course category is required
      return courseCategories.length > 0;
    }
    if (step === 12) {
      // At least one curriculum course is required
      return curriculumCourses.length > 0;
    }
    if (step === 13) {
      // At least one course to PO mapping is required
      return courseToPOMappings.length > 0;
    }
    if (step === 14) {
      // Review step is always valid
      return true;
    }
    return false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        Propose a Program
      </h1>

      {/* Step 1: Select form type */}
      {step === 1 && (
        <FormTypeStep formType={formType} setFormType={setFormType} />
      )}

      {/* Step 2: New program details */}
      {step === 2 && formType === "new" && (
        <NewProgramStep
          programName={programName}
          programAbbreviation={programAbbreviation}
          setProgramName={setProgramName}
          setProgramAbbreviation={setProgramAbbreviation}
          activePrograms={activePrograms}
        />
      )}

      {/* Step 2: Select program to update */}
      {step === 2 && formType === "update" && (
        <UpdateProgramStep
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          activePrograms={activePrograms}
          programsLoading={programsLoading}
        />
      )}

      {/* Step 3: Program Educational Objectives */}
      {step === 3 && (
        <PEOsStep
          peos={peos}
          addPEO={addPEO}
          updatePEO={updatePEO}
          removePEO={removePEO}
        />
      )}

      {/* Step 4: PEOs to Mission Mapping */}
      {step === 4 && (
        <PEOToMission
          peos={peos}
          missions={missions || []}
          mappings={peoToMissionMappings}
          toggleMapping={toggleMapping}
          isLoading={missionsLoading}
        />
      )}

      {/* Step 5: Graduate Attributes to PEOs Mapping */}
      {step === 5 && (
        <GAToPEOMappingStep
          peos={peos}
          graduateAttributes={graduateAttributes}
          gaToPEOMappings={gaToPEOMappings}
          toggleGAToPEOMapping={toggleGAToPEOMapping}
          isLoading={gasLoading}
        />
      )}

      {/* Step 6: Program Outcomes */}
      {step === 6 && (
        <ProgramOutcomeStep
          programOutcomes={programOutcomes}
          addProgramOutcome={addProgramOutcome}
          updateProgramOutcome={updateProgramOutcome}
          removeProgramOutcome={removeProgramOutcome}
        />
      )}
      {/* Step 7: Program Outcomes to PEOs Mapping */}
      {step === 7 && (
        <POToPEOMappingStep
          peos={peos}
          programOutcomes={programOutcomes}
          poToPEOMappings={poToPEOMappings}
          togglePOToPEOMapping={togglePOToPEOMapping}
        />
      )}
      {/* Step 8: Program Outcomes to Graduate Attributes Mapping */}
      {step === 8 && (
        <POToGAMappingStep
          programOutcomes={programOutcomes}
          graduateAttributes={graduateAttributes}
          poToGAMappings={poToGAMappings}
          togglePOToGAMapping={togglePOToGAMapping}
        />
      )}
      {/* Step 9: Curriculum Details */}
      {step === 9 && (
        <CurriculumStep
          programAbbreviation={programAbbreviation}
          curriculumName={curriculumName}
          academicYear={academicYear}
          setCurriculumName={setCurriculumName}
          setAcademicYear={setAcademicYear}
        />
      )}
      {/* Step 10: Year and Semester Selection */}
      {step === 10 && (
        <YearSemesterStep
          yearSemesters={yearSemesters}
          programTemplates={programTemplates}
          setYearSemesters={setYearSemesters}
          removeYearSemester={removeYearSemester}
        />
      )}
      {/* Step 11: Course Categories */}
      {step === 11 && (
        <CourseCategoriesStep
          courseCategories={courseCategories}
          addCourseCategory={addCourseCategory}
          updateCourseCategory={updateCourseCategory}
          removeCourseCategory={removeCourseCategory}
        />
      )}
      {/* Step 12: Curriculum Courses */}
      {step === 12 && (
        <CurriculumCoursesStep
          premadeCourses={premadeCourses}
          courseCategories={courseCategories}
          yearSemesters={yearSemesters}
          curriculumCourses={curriculumCourses}
          addCourse={addCourse}
          addCurriculumCourse={addCurriculumCourse}
          updateCurriculumCourse={updateCurriculumCourse}
          removeCurriculumCourse={removeCurriculumCourse}
        />
      )}
      {/* Step 13: Course to PO Mapping */}
      {step === 13 && (
        <CourseToPOMappingStep
          curriculumCourses={curriculumCourses}
          programOutcomes={programOutcomes}
          courseToPOMappings={courseToPOMappings}
          updateCourseToPOMapping={updateCourseToPOMapping}
        />
      )}
      {/* Step 14: Review */}
      {step === 14 && (
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
          goToStep={goToStep}
        />
      )}

      {/* Progress bar */}
      <div className="mt-12 mb-8">
        <Progress value={progressValue} className="h-2 bg-gray-200" />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}

        <div className="ml-auto">
          {step < 14 && (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          )}

          {step === 14 && (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
