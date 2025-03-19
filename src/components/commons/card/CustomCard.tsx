import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface CardProps {
  title: string;
  icon: string;
  children: ReactNode;
  iconHeight?: number;
  iconWidth?: number;
}

const CustomCard: React.FC<CardProps> = ({
  title,
  icon,
  children,
  iconHeight = 0, //same as h-10 but in px
  iconWidth = 0,
}) => {
  return (
    <Card className="w-full text-center border-2 shadow-md">
      <CardHeader className="text-4xl font-semi-bold">
        <span className="flex items-center justify-center gap-2">
          {title}
          <Image
            src={icon}
            alt={title}
            height={iconHeight}
            width={iconWidth}
            priority
          />
        </span>
      </CardHeader>
      <CardContent className="italic">{children}</CardContent>
    </Card>
  );
};

export default CustomCard;
