"use client";

import { useState } from "react";
import { useRevisionStore } from "@/store/revision/revision-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Plus, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCourseCategories from "@/hooks/department/useCourseCategory";
import { Loader2 } from "lucide-react";

export function CourseCategoriesRevision() {
  // Get course categories and related functions from the store
  const courseCategories = useRevisionStore((state) => state.course_categories);
  const curriculumCourses = useRevisionStore(
    (state) => state.curriculum_courses
  );
  // Add the API hook to fetch categories
  const {
    courseCategories: apiCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCourseCategories();

  const [selectedApiCategoryId, setSelectedApiCategoryId] =
    useState<string>("");

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
  const getCoursesCount = (categoryId: number) => {
    return curriculumCourses.filter(
      (course) => course.course_category_id === categoryId
    ).length;
  };

  // Local state for the form
  const [newCategory, setNewCategory] = useState({ name: "", code: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editForm, setEditForm] = useState({ name: "", code: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [errors, setErrors] = useState({ name: "", code: "" });
  const [activeTab, setActiveTab] = useState("add-new");

  // Start editing a category
  const startEditing = (category: {
    id: number;
    name: string;
    code: string;
  }) => {
    setEditingCategoryId(category.id);
    setEditForm({ name: category.name, code: category.code });
    setErrors({ name: "", code: "" });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditForm({ name: "", code: "" });
    setErrors({ name: "", code: "" });
  };

  // Save edited category
  const saveEditing = () => {
    // Validate inputs
    const newErrors = { name: "", code: "" };
    let isValid = true;

    if (!editForm.name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }

    if (!editForm.code.trim()) {
      newErrors.code = "Category code is required";
      isValid = false;
    } else if (editForm.code.length > 10) {
      newErrors.code = "Code must be 10 characters or less";
      isValid = false;
    }

    // Check for duplicate code (excluding the current category)
    if (
      courseCategories.some(
        (cat) =>
          cat.id !== editingCategoryId &&
          cat.code.toLowerCase() === editForm.code.trim().toLowerCase()
      )
    ) {
      newErrors.code = "This code is already in use";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid && editingCategoryId !== null) {
      updateCourseCategory(editingCategoryId, editForm.name, editForm.code);
      setEditingCategoryId(null);
      setEditForm({ name: "", code: "" });
    }
  };

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

  const handleAddExistingCategory = () => {
    if (!selectedApiCategoryId) return;

    const categoryToAdd = apiCategories?.find(
      (cat) => cat.id.toString() === selectedApiCategoryId
    );

    if (categoryToAdd) {
      // Check if this category already exists
      const exists = courseCategories.some(
        (cat) => cat.code.toLowerCase() === categoryToAdd.code.toLowerCase()
      );

      if (exists) {
        setErrors({
          ...errors,
          code: "This category code already exists in your curriculum",
        });
        return;
      }

      // Add the category
      addCourseCategory(categoryToAdd.name, categoryToAdd.code);
      setSelectedApiCategoryId("");
    }
  };

  // Handle resetting the section
  const handleReset = () => {
    resetSection("course_categories");
    setIsResetDialogOpen(false);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Categories</CardTitle>
          <div className="flex items-center gap-2">
            {isModified && <Badge className="bg-green-500">Modified</Badge>}
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={!isModified}
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Current Course Categories
            </h3>

            {courseCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border rounded-md">
                No course categories defined. Add a category below.
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-3 border-b">
                  <div className="col-span-4 font-medium">Category Name</div>
                  <div className="col-span-4 font-medium">Code</div>
                  <div className="col-span-2 font-medium">Courses</div>
                  <div className="col-span-2 font-medium text-right">
                    Actions
                  </div>
                </div>
                <div className="divide-y">
                  {courseCategories.map((category) => (
                    <div
                      key={category.id}
                      className="grid grid-cols-12 p-3 items-center"
                    >
                      {editingCategoryId === category.id ? (
                        // Editing mode
                        <>
                          <div className="col-span-4 pr-2">
                            <Input
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.name}
                              </p>
                            )}
                          </div>
                          <div className="col-span-4 pr-2">
                            <Input
                              value={editForm.code}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  code: e.target.value.toUpperCase(),
                                })
                              }
                              className={`font-mono ${errors.code ? "border-red-500" : ""}`}
                              maxLength={10}
                            />
                            {errors.code && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors.code}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <Badge variant="secondary">
                              {getCoursesCount(category.id)}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={saveEditing}
                              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditing}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        // Display mode
                        <>
                          <div className="col-span-4">{category.name}</div>
                          <div className="col-span-4">
                            <Badge variant="outline" className="font-mono">
                              {category.code}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <Badge variant="secondary">
                              {getCoursesCount(category.id)}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(category)}
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCategoryToDelete(category.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-4">
              Add Course Categories
            </h3>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="select-existing">
                  Select Existing Category
                </TabsTrigger>
                <TabsTrigger value="add-new">Add New Category</TabsTrigger>
              </TabsList>

              <TabsContent value="select-existing" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Category
                    </label>
                    {categoriesLoading && (
                      <div className="flex items-center space-x-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        <span className="text-sm text-gray-500">
                          Loading categories...
                        </span>
                      </div>
                    )}

                    {categoriesError && (
                      <div className="text-sm text-red-500 py-2">
                        Failed to load categories. Please try again.
                      </div>
                    )}
                    {!categoriesLoading && !categoriesError && (
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedApiCategoryId}
                        onChange={(e) =>
                          setSelectedApiCategoryId(e.target.value)
                        }
                      >
                        <option value="">Select a category</option>
                        {apiCategories &&
                          apiCategories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name} ({category.code})
                            </option>
                          ))}
                      </select>
                    )}

                    {errors.code && selectedApiCategoryId && (
                      <p className="text-sm text-red-500 mt-1">{errors.code}</p>
                    )}
                  </div>

                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleAddExistingCategory}
                    disabled={!selectedApiCategoryId || categoriesLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Selected Category
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="add-new" className="pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Category Name
                    </label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="e.g., Common Courses"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="category-code"
                      className="block text-sm font-medium mb-1"
                    >
                      Category Code
                    </label>
                    <Input
                      id="category-code"
                      value={newCategory.code}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="E.G., CC"
                      className={`font-mono ${errors.code ? "border-red-500" : ""}`}
                      maxLength={10}
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500 mt-1">{errors.code}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Short code used to identify courses in this category
                      (e.g., CC for Common Courses)
                    </p>
                  </div>
                </div>

                <Button
                  className="bg-green-600 hover:bg-green-700 mt-6"
                  onClick={handleAddCategory}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New Category
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

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
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700">
              Warning: Deleting a category will remove it from all courses that
              use it. Those courses will need to be reassigned to a different
              category.
            </div>
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
