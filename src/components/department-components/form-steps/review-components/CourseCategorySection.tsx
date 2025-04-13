import { Section } from "./Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseCategory } from "@/store/wizard-store";

interface CourseCategoriesSectionProps {
  courseCategories: CourseCategory[];
  goToStep: (step: number) => void;
}

export function CourseCategoriesSection({
  courseCategories,
  goToStep,
}: CourseCategoriesSectionProps) {
  return (
    <Section
      id="course-categories"
      title="Course Categories"
      stepNumber={11}
      goToStep={goToStep}
    >
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
