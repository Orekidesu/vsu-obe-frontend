import type React from "react";

import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

export function ProgramRevision() {
  const { program, updateProgram, resetSection } = useRevisionStore();

  // Local state for form values
  const [formValues, setFormValues] = useState({
    name: program.name,
    abbreviation: program.abbreviation,
  });

  // Local state for validation errors
  const [errors, setErrors] = useState({
    name: "",
    abbreviation: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: "",
      abbreviation: "",
    };

    if (!formValues.name.trim()) {
      newErrors.name = "Program name is required";
    }

    if (!formValues.abbreviation.trim()) {
      newErrors.abbreviation = "Program abbreviation is required";
    } else if (formValues.abbreviation.length > 10) {
      newErrors.abbreviation = "Abbreviation must be 10 characters or less";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      updateProgram({
        name: formValues.name,
        abbreviation: formValues.abbreviation,
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    resetSection("program");
    setFormValues({
      name: program.name,
      abbreviation: program.abbreviation,
    });
    setErrors({
      name: "",
      abbreviation: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Enter program name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="abbreviation">Program Abbreviation</Label>
                <Input
                  id="abbreviation"
                  name="abbreviation"
                  value={formValues.abbreviation}
                  onChange={handleChange}
                  placeholder="Enter program abbreviation"
                  className={errors.abbreviation ? "border-red-500" : ""}
                />
                {errors.abbreviation && (
                  <p className="text-sm text-red-500">{errors.abbreviation}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
