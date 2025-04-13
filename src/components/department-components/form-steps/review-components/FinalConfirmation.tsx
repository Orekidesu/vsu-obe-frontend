import { AlertCircle } from "lucide-react";

export function FinalConfirmation() {
  return (
    <div className="mt-8 p-6 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-medium">Final Confirmation</h3>
      </div>
      <p>
        Please ensure all information is correct before submitting. Once
        submitted, your program proposal will be sent for review and approval.
      </p>
    </div>
  );
}
