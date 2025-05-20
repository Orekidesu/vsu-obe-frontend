import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import {
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function POsRevision() {
  const { pos, updatePO, addPO, removePO, resetSection, isModified } =
    useRevisionStore();
  const [newPO, setNewPO] = useState({ name: "", statement: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", statement: "" });
  const [errors, setErrors] = useState<{ name?: string; statement?: string }>(
    {}
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [poToDelete, setPoToDelete] = useState<number | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const sectionModified = isModified("pos");

  // Start editing a PO
  const handleEdit = (id: number, name: string, statement: string) => {
    setEditingId(id);
    setEditForm({ name, statement });
    setErrors({});
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", statement: "" });
    setErrors({});
  };

  // Save edited PO
  const handleSaveEdit = () => {
    const validationErrors: { name?: string; statement?: string } = {};

    if (!editForm.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!editForm.statement.trim()) {
      validationErrors.statement = "Statement is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updatePO(editingId!, {
      name: editForm.name,
      statement: editForm.statement,
    });
    setEditingId(null);
    setEditForm({ name: "", statement: "" });
    setErrors({});
  };

  // Handle changes in the edit form
  const handleEditChange = (field: "name" | "statement", value: string) => {
    setEditForm({ ...editForm, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Handle changes in the new PO form
  const handleNewPOChange = (field: "name" | "statement", value: string) => {
    setNewPO({ ...newPO, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Add a new PO
  const handleAddPO = () => {
    const validationErrors: { name?: string; statement?: string } = {};

    if (!newPO.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!newPO.statement.trim()) {
      validationErrors.statement = "Statement is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addPO(newPO);
    setNewPO({ name: "", statement: "" });
    setErrors({});
    setShowAddForm(false);
  };

  // Confirm deletion of a PO
  const handleDeleteClick = (id: number) => {
    setPoToDelete(id);
    setShowDeleteDialog(true);
  };

  // Delete a PO
  const handleConfirmDelete = () => {
    if (poToDelete !== null) {
      removePO(poToDelete);
      setShowDeleteDialog(false);
      setPoToDelete(null);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setPoToDelete(null);
  };

  // Confirm reset
  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  // Reset POs to original state
  const handleConfirmReset = () => {
    resetSection("pos");
    setShowResetDialog(false);
    setEditingId(null);
    setEditForm({ name: "", statement: "" });
    setNewPO({ name: "", statement: "" });
    setErrors({});
    setShowAddForm(false);
  };

  // Cancel reset
  const handleCancelReset = () => {
    setShowResetDialog(false);
  };

  // Toggle add form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setNewPO({ name: "", statement: "" });
      setErrors({});
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Program Outcomes (POs)</h2>
        <div className="flex gap-2">
          <Button onClick={toggleAddForm} className="gap-1">
            <Plus className="h-4 w-4" /> Add PO
          </Button>
          <Button
            variant="outline"
            onClick={handleResetClick}
            disabled={!sectionModified}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Add new PO form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">Add New Program Outcome</h3>
          <div className="space-y-4">
            <div>
              <Input
                value={newPO.name}
                onChange={(e) => handleNewPOChange("name", e.target.value)}
                placeholder="Program Outcome Name (e.g., Problem Solving)"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Textarea
                value={newPO.statement}
                onChange={(e) => handleNewPOChange("statement", e.target.value)}
                placeholder="Program Outcome Statement"
                className={`min-h-[100px] ${errors.statement ? "border-red-500" : ""}`}
              />
              {errors.statement && (
                <p className="text-red-500 text-xs mt-1">{errors.statement}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={toggleAddForm}>
                Cancel
              </Button>
              <Button onClick={handleAddPO}>Add Program Outcome</Button>
            </div>
          </div>
        </div>
      )}

      {/* List of existing POs */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto mb-6">
        {pos.length === 0 ? (
          <div className="p-4 border rounded-lg bg-gray-50 text-center text-gray-500">
            No program outcomes defined yet. Add your first program outcome.
          </div>
        ) : (
          pos.map((po, index) => (
            <div key={po.id} className="p-4 border rounded-lg">
              {editingId === po.id ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    placeholder="Program Outcome Name"
                    className={`mb-2 ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}

                  <Textarea
                    value={editForm.statement}
                    onChange={(e) =>
                      handleEditChange("statement", e.target.value)
                    }
                    placeholder="Program Outcome Statement"
                    className={`min-h-[100px] ${errors.statement ? "border-red-500" : ""}`}
                  />
                  {errors.statement && (
                    <p className="text-red-500 text-xs">{errors.statement}</p>
                  )}

                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div className="text-green-700 font-medium mb-1">
                      PO {index + 1}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(po.id, po.name, po.statement)}
                        className="h-8 w-8 p-0 text-gray-500"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(po.id)}
                        className="h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{po.name}</div>
                    <p className="text-gray-700 mt-1">{po.statement}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Warning note */}
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <Info className="h-4 w-4 text-amber-800" />
        <AlertDescription>
          Note: Removing a Program Outcome will also remove any mappings
          associated with it. This may affect other sections of the program
          proposal.
        </AlertDescription>
      </Alert>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program Outcome</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this program outcome?
            </AlertDialogDescription>
            <div className="flex items-start pt-2">
              <AlertTriangle className="text-amber-500 mr-2 h-5 w-5 mt-0.5" />
              <span className="text-amber-800 text-sm">
                This will also remove all mappings associated with this program
                outcome.
              </span>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Program Outcomes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all program outcomes to their
              original state?
            </AlertDialogDescription>
            <div className="mt-2">All your changes will be lost.</div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelReset}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
