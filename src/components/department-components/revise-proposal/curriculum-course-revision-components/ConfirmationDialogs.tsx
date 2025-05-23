import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface ConfirmationDialogsProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (isOpen: boolean) => void;
  handleDeleteCourse: () => void;
  handleReset: () => void;
}

export function ConfirmationDialogs({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isResetDialogOpen,
  setIsResetDialogOpen,
  handleDeleteCourse,
  handleReset,
}: ConfirmationDialogsProps) {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this course from the curriculum?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Warning: Deleting a course will also remove any mappings to
                Program Outcomes.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all changes made to the curriculum
              courses? This will revert to the original data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
