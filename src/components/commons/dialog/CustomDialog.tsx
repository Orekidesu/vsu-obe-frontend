import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactNode } from "react";

interface CustomDialogProps {
  buttonTitle?: string;
  title: string;
  description?: string;
  footerButtonTitle: string;
  children: ReactNode;
  isOpen: boolean;
  buttonIcon?: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  buttonTitle,
  title,
  description,
  footerButtonTitle,
  children,
  buttonIcon,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {buttonTitle && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <span>{buttonIcon}</span>
            {buttonTitle}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
