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
import { cn } from "@/lib/utils";

interface CustomAlertDialogProps {
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  preActionText?: string;
  actionVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionClassName?: string;
  onCancel?: () => void;
  onAction?: () => void; // Now only triggers, does not manage state
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  isLoading?: boolean; // ✅ Moved state management to the parent
}

export function CustomAlertDialog({
  title,
  description,
  cancelText = "Cancel",
  preActionText = "Delete",
  actionText = "Deleting...",
  actionVariant = "destructive",
  actionClassName = "",
  onCancel,
  onAction,
  open,
  onOpenChangeAction,
  isLoading = false, // Controlled externally
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            disabled={isLoading}
            className={cn(
              actionVariant === "destructive" &&
                "bg-destructive text-white hover:bg-destructive/90",
              actionClassName
            )}
          >
            {isLoading ? actionText : preActionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
