import type React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CustomCard2Props {
  title?: string;
  value?: number | string;
  description?: string;
  icon?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
}: CustomCard2Props) {
  return (
    <Card className="w-full border-2 shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
          <div className="text-gray-800">{icon}</div>
        </div>
        <div className="mt-4">
          <p className="text-5xl font-medium">{value}</p>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
