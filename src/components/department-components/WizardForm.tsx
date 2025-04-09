"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizard-store";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import { Progress } from "@/components/ui/progress";
import usePrograms from "@/hooks/department/useProgram";
import { filterActivePrograms } from "@/app/utils/department/programFilter";
import { useAuth } from "@/hooks/useAuth";

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
  } = useWizardStore();

  const { programs, isLoading: programsLoading } = usePrograms();
  const { session } = useAuth() as { session: Session | null };

  const departmentId = session?.Department?.id;

  const activePrograms = filterActivePrograms(programs, departmentId);

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
  const progressValue = (step / 2) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        Propose a Program
      </h1>

      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-8">
            What would you like to do?
          </h2>

          <RadioGroup
            value={formType}
            onValueChange={setFormType}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card
              className={`cursor-pointer hover:border-green-500 transition-all ${formType === "new" ? "border-green-500 border-2" : ""}`}
            >
              <CardContent className="flex items-center p-6">
                <RadioGroupItem
                  value="new"
                  id="new"
                  className="text-green-600"
                />
                <Label htmlFor="new" className="ml-4 text-lg cursor-pointer">
                  Make a new program
                </Label>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer hover:border-green-500 transition-all ${formType === "update" ? "border-green-500 border-2" : ""}`}
            >
              <CardContent className="flex items-center p-6">
                <RadioGroupItem
                  value="update"
                  id="update"
                  className="text-green-600"
                />
                <Label htmlFor="update" className="ml-4 text-lg cursor-pointer">
                  Update existing program
                </Label>
              </CardContent>
            </Card>
          </RadioGroup>
        </>
      )}

      {step === 2 && formType === "new" && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Enter program details
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                placeholder="Enter program name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programAbbreviation">Program Abbreviation</Label>
              <Input
                id="programAbbreviation"
                placeholder="Enter abbreviation"
                value={programAbbreviation}
                onChange={(e) => setProgramAbbreviation(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {step === 2 && formType === "update" && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Select a program to update
          </h2>

          <div className="space-y-6">
            {programsLoading ? (
              <div className="text-center">Loading programs...</div>
            ) : (
              <Select
                value={selectedProgram}
                onValueChange={setSelectedProgram}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {activePrograms &&
                    activePrograms.map((program) => (
                      <SelectItem
                        key={program.id}
                        value={program.id.toString()}
                      >
                        {program.name} ({program.abbreviation})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </>
      )}

      {/* Progress bar using shadcn Progress component */}
      {/* Progress bar using shadcn Progress component */}
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
          {step < 2 && (
            <Button
              onClick={handleNext}
              disabled={!formType}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleSubmit}
              disabled={
                (formType === "new" &&
                  (!programName || !programAbbreviation)) ||
                (formType === "update" && !selectedProgram)
              }
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
