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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseCategory } from "@/store/wizard-store";

interface CourseCategoriesStepProps {
  courseCategories: CourseCategory[];
  premadeCourseCategories: CourseCategory[];
  addCourseCategory: (name: string, code: string) => void;
  updateCourseCategory: (id: number, name: string, code: string) => void;
  removeCourseCategory: (id: number) => void;
  isLoading?: boolean;
}

export function CourseCategoriesStep({
  courseCategories,
  addCourseCategory,
  updateCourseCategory,
  removeCourseCategory,
  premadeCourseCategories,
  isLoading = false,
}: CourseCategoriesStepProps) {
  const [activeTab, setActiveTab] = useState("existing");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
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
  // Handle adding an existing category
  const handleAddExistingCategory = () => {
    if (!selectedCategory) {
      setError("Please select a category.");
      return;
    }

    // Find the selected category
    const category = premadeCourseCategories.find(
      (c) => c.id === parseInt(selectedCategory, 10)
    );
    if (!category) {
      setError("Selected category not found.");
      return;
    }

    // Check if this category already exists
    const categoryExists = courseCategories.some(
      (cc) => cc.code.toLowerCase() === category.code.toLowerCase()
    );
    if (categoryExists) {
      setError(`A category with code "${category.code}" already exists.`);
      return;
    }

    // Add the category
    addCourseCategory(category.name, category.code);
    setSelectedCategory("");
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
  const handleSaveEdit = (id: number) => {
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

  // Filter premade categories based on search term
  const filteredCategories = premadeCourseCategories
    ? searchTerm.trim() === ""
      ? premadeCourseCategories
      : premadeCourseCategories.filter(
          (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

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
        <Card>
          <CardHeader>
            <CardTitle>Add Course Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="existing">
                  Select Existing Category
                </TabsTrigger>
                <TabsTrigger value="new">Add New Category</TabsTrigger>
              </TabsList>

              <TabsContent value="existing">
                <div className="space-y-6">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="selectedCategory">Select Category</Label>
                    {isLoading ? (
                      <div className="text-center p-4 border rounded-md bg-muted/20">
                        <p>Loading categories...</p>
                      </div>
                    ) : (
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger id="selectedCategory">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="py-2 px-3 border-b">
                            <Input
                              placeholder="Filter categories..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          {isLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <p className="text-sm text-muted-foreground">
                                Loading categories...
                              </p>
                            </div>
                          ) : filteredCategories.length === 0 ? (
                            <div className="flex items-center justify-center p-4">
                              <p className="text-sm text-muted-foreground">
                                {searchTerm.trim() !== ""
                                  ? "No matching categories found"
                                  : "No categories available"}
                              </p>
                            </div>
                          ) : (
                            filteredCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name} ({category.code})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <Button
                    onClick={handleAddExistingCategory}
                    disabled={!selectedCategory || isLoading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white mt-4"
                  >
                    <Plus className="h-4 w-4" /> Add Selected Category
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="new">
                <div className="space-y-6">
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
                        Short code used to identify courses in this category
                        (e.g., CC for Common Courses)
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
