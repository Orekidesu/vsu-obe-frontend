import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Target,
  BookOpen,
  Users,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import {
  useCourseRevisionStore,
  type CourseOutcome,
} from "@/store/revision/course-revision-store";

export function CourseOutcomesRevision() {
  const {
    courseOutcomes,
    // currentCourse,
    modifiedSections,
    addCourseOutcome,
    updateCourseOutcome,
    removeCourseOutcome,
    resetCourseOutcomes,
  } = useCourseRevisionStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<CourseOutcome | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Check if this section has been modified
  const isModified = modifiedSections.has("course_outcomes");

  // Form state for new/edit outcome
  const [formData, setFormData] = useState({
    name: "",
    statement: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      statement: "",
    });
  };

  const handleAddOutcome = () => {
    if (formData.name.trim() && formData.statement.trim()) {
      const newOutcome: Omit<CourseOutcome, "id"> = {
        name: formData.name.trim(),
        statement: formData.statement.trim(),
        abcd: {
          audience: "",
          behavior: "",
          condition: "",
          degree: "",
        },
        cpa: "",
        po_mappings: [],
        tla_tasks: [],
        tla_assessment_method: {
          id: 0,
          teaching_methods: [],
          learning_resources: [],
        },
      };

      addCourseOutcome(newOutcome);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditOutcome = () => {
    if (editingOutcome && formData.name.trim() && formData.statement.trim()) {
      updateCourseOutcome(editingOutcome.id, {
        name: formData.name.trim(),
        statement: formData.statement.trim(),
      });
      resetForm();
      setEditingOutcome(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (outcome: CourseOutcome) => {
    setEditingOutcome(outcome);
    setFormData({
      name: outcome.name,
      statement: outcome.statement,
    });
    setIsEditDialogOpen(true);
  };

  const handleRemoveOutcome = (id: number) => {
    removeCourseOutcome(id);
  };

  const handleReset = () => {
    resetCourseOutcomes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Target className="h-6 w-6 mr-2 text-primary" />
            Course Outcomes
            {isModified && (
              <Badge className="ml-3 bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Modified
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-0">
            Define the learning outcomes that students should achieve upon
            completion of this course.
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isModified}
                className="text-gray-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Course Outcomes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset all changes to the course
                  outcomes? This will restore the original course outcomes and
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reset Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/70">
                <Plus className="h-4 w-4 mr-2" />
                Add Course Outcome
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Course Outcome</DialogTitle>
                <DialogDescription>
                  Create a new learning outcome for this course. After adding,
                  you&apos;ll need to complete the CPA classification, PO
                  mappings, ABCD model, and assessment tasks for this outcome.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="outcome-name">Outcome Name</Label>
                  <Input
                    id="outcome-name"
                    placeholder="e.g., Problem Solving Skills"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="outcome-statement">Outcome Statement</Label>
                  <Textarea
                    id="outcome-statement"
                    placeholder="Describe what students will be able to do after completing this course..."
                    value={formData.statement}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        statement: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">
                      Required Information
                    </p>
                    <p className="text-amber-700">
                      After adding this course outcome, you&apos;ll need to
                      complete:
                    </p>
                    <ul className="list-disc list-inside text-amber-700 mt-1 space-y-0.5">
                      <li>
                        CPA Classification (Cognitive, Psychomotor, or
                        Affective)
                      </li>
                      <li>
                        ABCD Model (Audience, Behavior, Condition, Degree)
                      </li>
                      <li>Program Outcome (PO) mappings with IED levels</li>
                      <li>Teaching, Learning & Assessment (TLA) tasks</li>
                      <li>Assessment methods and tools</li>
                    </ul>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddOutcome}
                  disabled={!formData.name.trim() || !formData.statement.trim()}
                >
                  Add Outcome
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {courseOutcomes.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 pb-6 text-center">
            <div>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Course Outcomes
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding course outcomes that define what students will
                learn. Each outcome will need CPA classification, PO mappings,
                and assessment details.
              </p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course Outcome
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courseOutcomes.map((outcome, index) => (
            <Card key={outcome.id} className="border-l-4 border-l-primary-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <span className="bg-blue-100 text-primary-800 text-sm font-medium px-2 py-1 rounded mr-3">
                        CO{index + 1}
                      </span>
                      {outcome.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {outcome.statement}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(outcome)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove Course Outcome
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className="space-y-3">
                          Are you sure you want to remove &quot;{outcome.name}
                          &quot;?
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <div className="font-medium text-red-800">
                                  Warning: Data Loss
                                </div>
                                <div className="text-red-700">
                                  Removing this course outcome will permanently
                                  delete all associated data:
                                </div>
                                <ul className="list-disc list-inside text-red-700 mt-1 space-y-0.5">
                                  <li>CPA classification</li>
                                  <li>ABCD model components</li>
                                  <li>
                                    All PO mappings (
                                    {outcome.po_mappings.length} mapping
                                    {outcome.po_mappings.length !== 1
                                      ? "s"
                                      : ""}
                                    )
                                  </li>
                                  <li>
                                    All assessment tasks (
                                    {outcome.tla_tasks.length} task
                                    {outcome.tla_tasks.length !== 1 ? "s" : ""})
                                  </li>
                                  <li>Teaching and learning methods</li>
                                </ul>
                                <div className="text-red-700 mt-2 font-medium">
                                  This action cannot be undone.
                                </div>
                              </div>
                            </div>
                          </div>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveOutcome(outcome.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-500">CPA Classification</p>
                      <p className="font-medium">
                        {outcome.cpa || (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-500">PO Mappings</p>
                      <p className="font-medium">
                        {outcome.po_mappings.length} mappings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-500">Assessment Tasks</p>
                      <p className="font-medium">
                        {outcome.tla_tasks.length} tasks
                      </p>
                    </div>
                  </div>
                </div>
                {outcome.po_mappings.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Program Outcome Mappings:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {outcome.po_mappings.map((mapping) => (
                        <Badge
                          key={mapping.po_id}
                          variant="outline"
                          className="text-xs"
                        >
                          {mapping.po_name} ({mapping.ied})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course Outcome</DialogTitle>
            <DialogDescription>
              Update the course outcome information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-outcome-name">Outcome Name</Label>
              <Input
                id="edit-outcome-name"
                placeholder="e.g., Problem Solving Skills"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-outcome-statement">Outcome Statement</Label>
              <Textarea
                id="edit-outcome-statement"
                placeholder="Describe what students will be able to do after completing this course..."
                value={formData.statement}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    statement: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditOutcome}
              disabled={!formData.name.trim() || !formData.statement.trim()}
            >
              Update Outcome
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {courseOutcomes.length > 0 && (
        <div className="bg-accent/50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-primary mr-2" />
            <div>
              <h4 className="font-medium text-primary-900">
                Course Outcomes Summary
              </h4>
              <p className="text-sm text-primary-700">
                {courseOutcomes.length} course outcome
                {courseOutcomes.length !== 1 ? "s" : ""} defined. You can add
                detailed ABCD models, CPA classifications, and PO mappings in
                the next steps.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
