import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface FinalConfirmationProps {
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
}

export function FinalConfirmation({
  isConfirmed,
  setIsConfirmed,
}: FinalConfirmationProps) {
  return (
    <Card className="border border-gray-200">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Final Confirmation</h3>
        </div>
        <p className="mt-2 text-muted-foreground pl-7">
          Please ensure all information is correct before submitting. Once
          submitted, your course details will be saved and can be accessed from
          the My Courses page.
        </p>

        <div className="mt-6 flex items-start space-x-3 pl-7">
          <Checkbox
            id="course-confirmation"
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
          />
          <label
            htmlFor="course-confirmation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that I have reviewed all the course information and it is
            accurate and complete. After submission, the course details will be
            sent back to the department and wait for review by the dean.
          </label>
        </div>
      </div>
    </Card>
  );
}
