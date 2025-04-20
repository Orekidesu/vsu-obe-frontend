import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCategory {
  name: string;
  code: string;
}

interface CourseCategoriesProps {
  categories?: CourseCategory[];
}

export function CourseCategories({ categories = [] }: CourseCategoriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {category.code}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No course categories available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
