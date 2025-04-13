import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface SectionProps {
  id: string;
  title: string;
  stepNumber: number;
  goToStep: (step: number) => void;
  children: React.ReactNode;
}

export function Section({
  id,
  title,
  stepNumber,
  goToStep,
  children,
}: SectionProps) {
  return (
    <AccordionItem value={id} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-xl font-medium">{title}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              goToStep(stepNumber);
            }}
            className="mr-4"
          >
            Edit <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
