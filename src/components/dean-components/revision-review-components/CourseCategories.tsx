import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";

interface CourseCategory {
  name: string;
  code: string;
}

interface CourseCategoriesProps {
  categories: CourseCategory[];
}

export function CourseCategories({ categories }: CourseCategoriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-purple-600" />
          Course Categories
        </CardTitle>
        <p className="text-sm text-gray-600">
          Classification of courses into different categories for curriculum
          organization
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Course Categories defined</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <Card key={index} className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">
                        {category.name}
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Category Code
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-700 border-purple-300"
                    >
                      {category.code}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Total Categories:</strong> {categories.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
