import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { Skeleton } from "./ui/skeleton";

interface VisionMissionCardProps {
  title: string;
  content: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageSize: string;
  loading: boolean;
}

const VisionMissionCard: React.FC<VisionMissionCardProps> = ({
  title,
  content,
  imageSrc,
  imageAlt,
  imageSize,
  loading,
}) => {
  if (loading) {
    return <Skeleton className="w-full h-52" />;
  }

  return (
    <Card className="w-full text-center border-2 shadow-md">
      <CardHeader className="text-4xl font-semi-bold">
        <span className="flex items-center justify-center gap-2">
          {title}
          <Image className={imageSize} src={imageSrc} alt={imageAlt} priority />
        </span>
      </CardHeader>
      <CardContent className="italic">{content}</CardContent>
    </Card>
  );
};

export default VisionMissionCard;
