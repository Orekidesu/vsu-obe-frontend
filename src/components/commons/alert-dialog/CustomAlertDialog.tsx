"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomAlertDialogProps {
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  actionVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionClassName?: string;
  onCancel?: () => void;
  onAction?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomAlertDialog({
  title,
  description,
  cancelText = "Cancel",
  actionText = "Continue",
  actionVariant = "default",
  actionClassName = "",
  onCancel,
  onAction,
  open,
  onOpenChange,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className={`${
              actionVariant === "destructive"
                ? "bg-destructive text-white hover:bg-destructive/90"
                : ""
            } ${actionClassName}`}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
