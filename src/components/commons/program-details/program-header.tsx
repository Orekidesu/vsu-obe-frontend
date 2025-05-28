import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckCheck,
  // ThumbsDown,
  FileEdit,
} from "lucide-react";

interface ProgramHeaderProps {
  programName: string;
  programAbbreviation: string;
  actionTaken?: string | null;
  onApprove?: () => void;
  onRevise?: () => void;
  onReject?: () => void;
  status?: string;
  role?: string;
}

export function ProgramHeader({
  programName,
  programAbbreviation,
  actionTaken,
  onApprove,
  onRevise,
  status,
  // onReject,
  role,
}: ProgramHeaderProps) {
  // Show actions for Dean role
  const showActions = role === "Dean" && status !== "approved";

  // Changed this to show alert when role is Dean and there's an action taken
  const showAlert = role === "Dean" && actionTaken;

  return (
    <>
      {showAlert && (
        <Alert
          className={`mb-6 ${
            actionTaken === "approved"
              ? "bg-green-50 border-green-200"
              : actionTaken === "rejected"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionTaken === "approved" && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {actionTaken === "rejected" && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            {actionTaken === "revision" && (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <AlertTitle
              className={`${
                actionTaken === "approved"
                  ? "text-green-800"
                  : actionTaken === "rejected"
                    ? "text-red-800"
                    : "text-amber-800"
              }`}
            >
              Program{" "}
              {actionTaken === "approved"
                ? "Approved"
                : actionTaken === "rejected"
                  ? "Rejected"
                  : "Revision Requested"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {actionTaken === "approved" &&
              "The program has been approved successfully."}
            {actionTaken === "rejected" &&
              "The program has been rejected. Feedback has been sent to the proposer."}
            {actionTaken === "revision" &&
              "Revision requests have been sent to the proposer."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {programName && programAbbreviation
              ? `${programName} (${programAbbreviation})`
              : "Program Details"}
          </h1>
          {role === "Department" ? (
            <p className="text-gray-600 mt-1">Review Program Details</p>
          ) : (
            <p className="text-gray-600 mt-1">
              Review and take action on the proposed program
            </p>
          )}
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onApprove}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              disabled={!!actionTaken}
            >
              <CheckCheck className="h-4 w-4" /> Approve
            </Button>
            <Button
              onClick={onRevise}
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50 flex items-center gap-2"
              disabled={!!actionTaken}
            >
              <FileEdit className="h-4 w-4" /> Request Revisions
            </Button>
            {/* <Button
              onClick={onReject}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
              disabled={!!actionTaken}
            >
              <ThumbsDown className="h-4 w-4" /> Reject
            </Button> */}
          </div>
        )}
      </div>
    </>
  );
}
