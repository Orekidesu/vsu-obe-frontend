"use client";

import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Info,
} from "lucide-react";

export function CourseCategoriesRevision() {
  // Get course categories and related functions from the store
  const courseCategories = useRevisionStore((state) => state.course_categories);
  const isModified = useRevisionStore((state) =>
    state.isModified("course_categories")
  );
  const resetSection = useRevisionStore((state) => state.resetSection);
  const addCourseCategory = useRevisionStore(
    (state) => state.addCourseCategory
  );
  const updateCourseCategory = useRevisionStore(
    (state) => state.updateCourseCategory
  );
  const removeCourseCategory = useRevisionStore(
    (state) => state.removeCourseCategory
  );

  // Local state for the form
  const [newCategory, setNewCategory] = useState({ name: "", code: "" });
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [errors, setErrors] = useState({ name: "", code: "" });

  // Handle adding a new category
  const handleAddCategory = () => {
    // Validate inputs
    const newErrors = { name: "", code: "" };
    let isValid = true;

    if (!newCategory.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }

    if (!newCategory.code.trim()) {
      newErrors.code = "Category code is required";
      isValid = false;
    } else if (newCategory.code.length > 10) {
      newErrors.code = "Code must be 10 characters or less";
      isValid = false;
    }

    // Check for duplicate code
    if (
      courseCategories.some(
        (cat) =>
          cat.code.toLowerCase() === newCategory.code.trim().toLowerCase()
      )
    ) {
      newErrors.code = "This code is already in use";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      addCourseCategory(newCategory.name, newCategory.code);
      setNewCategory({ name: "", code: "" });
      setIsAddDialogOpen(false);
    }
  };

  // Handle updating a category
  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    // Validate inputs
    const newErrors = { name: "", code: "" };
    let isValid = true;

    if (!editingCategory.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }

    if (!editingCategory.code.trim()) {
      newErrors.code = "Category code is required";
      isValid = false;
    } else if (editingCategory.code.length > 10) {
      newErrors.code = "Code must be 10 characters or less";
      isValid = false;
    }

    // Check for duplicate code (excluding the current category)
    if (
      courseCategories.some(
        (cat) =>
          cat.id !== editingCategory.id &&
          cat.code.toLowerCase() === editingCategory.code.trim().toLowerCase()
      )
    ) {
      newErrors.code = "This code is already in use";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      updateCourseCategory(
        editingCategory.id,
        editingCategory.name,
        editingCategory.code
      );
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = () => {
    if (categoryToDelete !== null) {
      removeCourseCategory(categoryToDelete);
      setCategoryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle resetting the section
  const handleReset = () => {
    resetSection("course_categories");
    setIsResetDialogOpen(false);
  };

  const curriculumCourses = useRevisionStore(
    (state) => state.curriculum_courses
  );

  // Calculate how many courses are associated with each category
  const getCourseCount = (categoryId: number) => {
    return curriculumCourses.filter(
      (course) => course.course_category_id === categoryId
    ).length;
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Categories</CardTitle>
          {isModified && <Badge className="bg-green-500">Modified</Badge>}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={!isModified}
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
            </Button>
          </div>

          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Course categories are used to classify courses in the curriculum.
              Each category should have a unique code.
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="w-[120px]">Code</TableHead>
                  <TableHead className="w-[120px]">Courses</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No course categories defined. Click &quot;Add
                      Category&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  courseCategories.map((category, index) => (
                    <TableRow key={category.id}>
                      {/* index */}
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {/* Category Name */}
                      <TableCell>{category.name}</TableCell>
                      {/* Category COde */}
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {category.code}
                        </Badge>
                      </TableCell>
                      {/* Category Count */}
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="px-2">
                          {getCourseCount(category.id)}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsEditDialogOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCategoryToDelete(category.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course Category</DialogTitle>
            <DialogDescription>
              Create a new course category for the curriculum.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="e.g., General Education"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="code" className="text-sm font-medium">
                Category Code
              </label>
              <Input
                id="code"
                value={newCategory.code}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g., GE"
                className="font-mono"
                maxLength={10}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
              <p className="text-xs text-gray-500">
                A short code used to identify this category (max 10 characters).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Category</DialogTitle>
            <DialogDescription>
              Update the details of this course category.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-code" className="text-sm font-medium">
                  Category Code
                </label>
                <Input
                  id="edit-code"
                  value={editingCategory.code}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="font-mono"
                  maxLength={10}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code}</p>
                )}
                <p className="text-xs text-gray-500">
                  A short code used to identify this category (max 10
                  characters).
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course category? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Warning: Deleting a category will remove it from all courses
                that use it. Those courses will need to be reassigned to a
                different category.
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
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
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
              Are you sure you want to reset all changes made to the course
              categories? This will revert to the original data.
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
    </div>
  );
}
