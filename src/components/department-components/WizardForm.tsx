"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import usePrograms from "@/hooks/department/useProgram";
import useMissions from "@/hooks/shared/useMission";
import useGraduateAttributes from "@/hooks/admin/useGraduateAttribute";
import { filterActivePrograms } from "@/app/utils/department/programFilter";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

// Import the step components
import { FormTypeStep } from "./form-steps/FormType";
import { NewProgramStep } from "./form-steps/NewProgram";
import { UpdateProgramStep } from "./form-steps/UpdateProgram";
import { PEOsStep } from "./form-steps/PEO";
import { MappingStep } from "./form-steps/PEOMapping";
import { GAToPEOMappingStep } from "@/components/department-components/form-steps/GAToPEOMapping";

export default function WizardForm() {
  const [step, setStep] = useState(1);
  const {
    formType,
    programName,
    programAbbreviation,
    selectedProgram,
    setFormType,
    setProgramName,
    setProgramAbbreviation,
    setSelectedProgram,
    peos,
    graduateAttributes,
    mappings,
    gaToPEOMappings,
    addPEO,
    updatePEO,
    removePEO,
    toggleMapping,
    toggleGAToPEOMapping,
    setGraduateAttributes,
  } = useWizardStore();

  const { programs, isLoading: programsLoading } = usePrograms();
  const { missions, isFetching: missionsLoading } = useMissions();
  const { graduateAttributes: fetchedGAs, isFetching: gasLoading } =
    useGraduateAttributes({ role: "department" });

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

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      formType,
      programName,
      programAbbreviation,
      selectedProgram,
      peos,
      mappings,
      gaToPEOMappings,
    });
    alert("Form submitted successfully!");
    // Reset form
    setStep(1);
    setFormType("");
    setProgramName("");
    setProgramAbbreviation("");
    setSelectedProgram("");
  };

  // Calculate progress percentage
  const progressValue = (step / 5) * 100;
  const isStepValid = () => {
    if (step === 1) return !!formType;
    if (step === 2) {
      return formType === "new"
        ? !!programName && !!programAbbreviation
        : !!selectedProgram;
    }
    if (step === 3) {
      return (
        peos.length > 0 && peos.every((peo) => peo.statement.trim() !== "")
      );
    }
    if (step === 4) {
      // At least one mapping per PEO is required
      return peos.every((peo) =>
        mappings.some((mapping) => mapping.peoId === peo.id)
      );
    }
    if (step === 5) {
      // At least one GA to PEO mapping per GA is required
      return graduateAttributes.every((ga) =>
        gaToPEOMappings.some((mapping) => mapping.gaId === ga.id.toString())
      );
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
        <MappingStep
          peos={peos}
          missions={missions || []}
          mappings={mappings}
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
          {step < 5 && (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          )}

          {step === 5 && (
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
