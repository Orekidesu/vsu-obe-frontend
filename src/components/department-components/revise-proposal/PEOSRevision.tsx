import { useState } from "react";
import { useRevisionStore, type PEO } from "@/store/revision/revision-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PEOsRevision() {
  const { peos, updatePEO, addPEO, removePEO, resetSection, isModified } =
    useRevisionStore();

  const sectionModified = isModified("peos");

  // State for new PEO form
  const [newPEOStatement, setNewPEOStatement] = useState("");
  const [showNewPEOForm, setShowNewPEOForm] = useState(false);
  const [newPEOError, setNewPEOError] = useState("");

  // State for editing existing PEOs
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editingStatement, setEditingStatement] = useState("");
  const [editingError, setEditingError] = useState("");

  // Handle adding a new PEO
  const handleAddPEO = () => {
    if (!newPEOStatement.trim()) {
      setNewPEOError("PEO statement is required");
      return;
    }

    addPEO(newPEOStatement.trim());
    setNewPEOStatement("");
    setNewPEOError("");
    setShowNewPEOForm(false);
  };

  // Start editing a PEO
  const handleStartEditing = (peo: PEO) => {
    setEditingId(peo.id);
    setEditingStatement(peo.statement);
    setEditingError("");
  };

  // Save edited PEO
  const handleSaveEdit = () => {
    if (!editingStatement.trim()) {
      setEditingError("PEO statement is required");
      return;
    }

    if (editingId !== null) {
      updatePEO(editingId, editingStatement.trim());
      setEditingId(null);
      setEditingStatement("");
      setEditingError("");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingStatement("");
    setEditingError("");
  };

  // Handle removing a PEO
  const handleRemovePEO = (id: number | string) => {
    if (
      confirm(
        "Are you sure you want to remove this PEO? This will also remove any mappings associated with it."
      )
    ) {
      removePEO(id);
    }
  };

  // Reset all PEOs to original state
  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all PEOs to their original state? All changes will be lost."
      )
    ) {
      resetSection("peos");
      setEditingId(null);
      setEditingStatement("");
      setEditingError("");
      setNewPEOStatement("");
      setNewPEOError("");
      setShowNewPEOForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {sectionModified && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Modified
                </Badge>
              )}
              Program Educational Objectives (PEOs)
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewPEOForm(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add PEO
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!sectionModified}
                className="flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* New PEO Form */}
          {showNewPEOForm && (
            <div className="mb-6 p-4 border rounded-md bg-gray-50">
              <h4 className="font-medium mb-2">Add New PEO</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="new-peo-statement">PEO Statement</Label>
                  <Textarea
                    id="new-peo-statement"
                    value={newPEOStatement}
                    onChange={(e) => {
                      setNewPEOStatement(e.target.value);
                      if (newPEOError) setNewPEOError("");
                    }}
                    placeholder="Enter the PEO statement"
                    className={`mt-1 ${newPEOError ? "border-red-500" : ""}`}
                  />
                  {newPEOError && (
                    <p className="text-sm text-red-500 mt-1">{newPEOError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewPEOForm(false);
                      setNewPEOStatement("");
                      setNewPEOError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddPEO}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add PEO
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PEOs List */}
          {peos.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">
                No Program Educational Objectives defined yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewPEOForm(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-1" /> Add PEO
              </Button>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {peos.map((peo: PEO) => (
                  <div
                    key={peo.id}
                    className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {editingId === peo.id ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`edit-peo-${peo.id}`}>
                            Edit PEO Statement
                          </Label>
                          <Textarea
                            id={`edit-peo-${peo.id}`}
                            value={editingStatement}
                            onChange={(e) => {
                              setEditingStatement(e.target.value);
                              if (editingError) setEditingError("");
                            }}
                            className={`mt-1 ${editingError ? "border-red-500" : ""}`}
                          />
                          {editingError && (
                            <p className="text-sm text-red-500 mt-1">
                              {editingError}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-green-600 hover:bg-green-700 flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">
                              PEO {peos.indexOf(peo) + 1}
                            </p>
                            <p>{peo.statement}</p>
                          </div>
                          <div className="flex space-x-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEditing(peo)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePEO(peo.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Warning about mappings */}
          {peos.length > 0 && (
            <Alert
              variant="destructive"
              className="mt-6 bg-amber-50 border-amber-200"
            >
              <AlertCircle className="h-4 w-4 text-amber-800" />
              <AlertDescription className="text-amber-700">
                Note: Removing a PEO will also remove any mappings associated
                with it. This may affect other sections of the program proposal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
