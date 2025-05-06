import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FinalConfirmation() {
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
      </div>
    </Card>
  );
}
