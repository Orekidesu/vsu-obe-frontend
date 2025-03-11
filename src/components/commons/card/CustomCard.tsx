import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardProps {
  title: string;
  icon: string;
  children: ReactNode;
  iconHeight?: string;
  iconWidth?: string;
}

const CustomCard: React.FC<CardProps> = ({
  title,
  icon,
  children,
  iconHeight = "h-10",
  iconWidth = "w-10",
}) => {
  return (
    <Card className="w-full text-center border-2 shadow-md">
      <CardHeader className="text-4xl font-semi-bold">
        <span className="flex items-center justify-center gap-2">
          {title}
          <img
            src={icon}
            alt={title}
            className={`${iconHeight} ${iconWidth}`}
          />
        </span>
      </CardHeader>
      <CardContent className="italic">{children}</CardContent>
    </Card>
  );
};

export default CustomCard;
