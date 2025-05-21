"use client";

import { useState, useEffect } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CurriculumRevision() {
  // Get curriculum and functions from the store
  const curriculum = useRevisionStore((state) => state.curriculum);
  const updateCurriculum = useRevisionStore((state) => state.updateCurriculum);
  const resetSection = useRevisionStore((state) => state.resetSection);
  const isModified = useRevisionStore((state) => state.isModified);

  // Local state for the form
  const [curriculumName, setCurriculumName] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Initialize local state from store
  useEffect(() => {
    setCurriculumName(curriculum.name);
  }, [curriculum.name]);

  // Handle save
  const handleSave = () => {
    if (curriculumName.trim() !== curriculum.name) {
      updateCurriculum(curriculumName.trim());
    }
  };

  // Handle reset
  const handleReset = () => {
    resetSection("curriculum");
    setIsResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Curriculum Details</CardTitle>
          {isModified("curriculum") && (
            <Badge className="bg-green-500">Modified</Badge>
          )}
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Update the curriculum details to better reflect the program&apos;s
              structure and focus.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="curriculumName">Curriculum Name</Label>
              <Input
                id="curriculumName"
                value={curriculumName}
                onChange={(e) => setCurriculumName(e.target.value)}
                placeholder="Enter curriculum name"
              />
              <p className="text-sm text-muted-foreground">
                The curriculum name should reflect the program and academic year
                (e.g., &quot;BSEE Curriculum 2025-2026&quot;).
              </p>
            </div>

            <div className="flex justify-between">
              <Dialog
                open={isResetDialogOpen}
                onOpenChange={setIsResetDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!isModified("curriculum")}
                  >
                    <RefreshCw className="h-4 w-4" /> Reset Changes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Changes</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reset all changes made to the
                      curriculum details? This action cannot be undone.
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
                      Reset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={
                  curriculumName.trim() === curriculum.name ||
                  curriculumName.trim() === ""
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
