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

interface CourseCategory {
  name: string;
  code: string;
}

interface CourseCategoriesEditProps {
  categories: CourseCategory[];
  updateCourseCategories: (categories: CourseCategory[]) => void;
}

export function CourseCategoriesEdit({
  categories,
  updateCourseCategories,
}: CourseCategoriesEditProps) {
  const [localCategories, setLocalCategories] =
    useState<CourseCategory[]>(categories);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  const handleAddCategory = () => {
    // Validate inputs
    if (!newName.trim() || !newCode.trim()) {
      setError("Both name and code are required.");
      return;
    }

    // Check if code already exists
    const codeExists = localCategories.some(
      (cc) => cc.code.toLowerCase() === newCode.toLowerCase()
    );
    if (codeExists) {
      setError(`A category with code "${newCode}" already exists.`);
      return;
    }

    // Add the category
    const updatedCategories = [
      ...localCategories,
      { name: newName, code: newCode },
    ];
    setLocalCategories(updatedCategories);
    updateCourseCategories(updatedCategories);

    // Reset form
    setNewName("");
    setNewCode("");
    setError("");
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditName(localCategories[index].name);
    setEditCode(localCategories[index].code);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditCode("");
  };

  const handleSaveEdit = (index: number) => {
    // Validate inputs
    if (!editName.trim() || !editCode.trim()) {
      setError("Both name and code are required.");
      return;
    }

    // Check if code already exists (except for the current category)
    const codeExists = localCategories.some(
      (cc, i) => i !== index && cc.code.toLowerCase() === editCode.toLowerCase()
    );
    if (codeExists) {
      setError(`A category with code "${editCode}" already exists.`);
      return;
    }

    // Update the category
    const updatedCategories = [...localCategories];
    updatedCategories[index] = { name: editName, code: editCode };
    setLocalCategories(updatedCategories);
    updateCourseCategories(updatedCategories);

    // Reset form
    setEditingIndex(null);
    setEditName("");
    setEditCode("");
    setError("");
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = localCategories.filter((_, i) => i !== index);
    setLocalCategories(updatedCategories);
    updateCourseCategories(updatedCategories);
  };

  return (
    <div className="space-y-8">
      {/* Current course categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Course Categories</h3>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {localCategories.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/20">
            <p>
              No course categories added yet. Add categories using the form
              below.
            </p>
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
              {localCategories.map((category, index) => (
                <TableRow key={index}>
                  {editingIndex === index ? (
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
                            onClick={() => handleSaveEdit(index)}
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
                            onClick={() => handleStartEdit(index)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCategory(index)}
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

      {/* Add new category */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Category</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="e.g., Common Courses"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryCode">Category Code</Label>
            <Input
              id="categoryCode"
              placeholder="e.g., CC"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="uppercase"
            />
            <p className="text-sm text-muted-foreground">
              Short code used to identify courses in this category (e.g., CC for
              Common Courses)
            </p>
          </div>
        </div>

        <Button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </Button>
      </div>
    </div>
  );
}
