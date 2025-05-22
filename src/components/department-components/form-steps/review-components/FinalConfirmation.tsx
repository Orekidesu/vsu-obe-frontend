import { AlertCircle } from "lucide-react";
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
    <div className="mt-8 p-6 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-medium">Final Confirmation</h3>
      </div>
      <p className="mb-4">
        Please ensure all information is correct before submitting. Once
        submitted, your program proposal will be sent to the pending section.
      </p>

      <div className="mt-6 flex items-start space-x-3">
        <Checkbox
          id="confirmation"
          checked={isConfirmed}
          onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
        />
        <label
          htmlFor="confirmation"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I confirm that I have reviewed all the information and it is accurate
          and complete. After submission, the proposal will enter the proposal
          workflow and notifications will be sent to relevant committee members.
        </label>
      </div>
    </div>
  );
}
