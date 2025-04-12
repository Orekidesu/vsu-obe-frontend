import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CourseCategory } from "@/store/wizard-store";

interface CourseCategoriesStepProps {
  courseCategories: CourseCategory[];
  addCourseCategory: (name: string, code: string) => void;
  updateCourseCategory: (id: string, name: string, code: string) => void;
  removeCourseCategory: (id: string) => void;
}

export function CourseCategoriesStep({
  courseCategories,
  addCourseCategory,
  updateCourseCategory,
  removeCourseCategory,
}: CourseCategoriesStepProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  // Handle adding a new course category
  const handleAddCategory = () => {
    // Validate inputs
    if (!name.trim() || !code.trim()) {
      setError("Both name and code are required.");
      return;
    }

    // Check if code already exists
    const codeExists = courseCategories.some(
      (cc) => cc.code.toLowerCase() === code.toLowerCase()
    );
    if (codeExists) {
      setError(`A category with code "${code}" already exists.`);
      return;
    }

    // Add the category
    addCourseCategory(name, code);
    setName("");
    setCode("");
    setError("");
  };

  // Start editing a category
  const handleStartEdit = (category: CourseCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditCode(category.code);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCode("");
  };

  // Save edited category
  const handleSaveEdit = (id: string) => {
    // Validate inputs
    if (!editName.trim() || !editCode.trim()) {
      setError("Both name and code are required.");
      return;
    }

    // Check if code already exists (except for the current category)
    const codeExists = courseCategories.some(
      (cc) => cc.id !== id && cc.code.toLowerCase() === editCode.toLowerCase()
    );
    if (codeExists) {
      setError(`A category with code "${editCode}" already exists.`);
      return;
    }

    // Update the category
    updateCourseCategory(id, editName, editCode);
    setEditingId(null);
    setEditName("");
    setEditCode("");
    setError("");
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Course Categories
      </h2>

      <div className="space-y-8">
        {/* Current course categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Course Categories</h3>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {courseCategories.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/20">
              <p>No course categories added yet. Add your first one below.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseCategories.map((category) => (
                  <TableRow key={category.id}>
                    {editingId === category.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEdit(category.id)}
                              className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCancelEdit}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.code}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartEdit(category)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCourseCategory(category.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Add new course category */}
        <div className="space-y-6 border p-6 rounded-md">
          <h3 className="text-lg font-medium">Add New Course Category</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Common Courses"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryCode">Category Code</Label>
              <Input
                id="categoryCode"
                placeholder="e.g., CC"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="uppercase"
              />
              <p className="text-sm text-muted-foreground">
                Short code used to identify courses in this category (e.g., CC
                for Common Courses)
              </p>
            </div>
          </div>

          <Button
            onClick={handleAddCategory}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
          >
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>
    </>
  );
}
