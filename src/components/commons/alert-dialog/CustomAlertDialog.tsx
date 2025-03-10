"use client";

import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDialogProps {
  // Trigger props
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerClassName?: string;
  customTrigger?: ReactNode;

  // Content props
  title: string;
  description?: string;

  // Action props
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

  // Callbacks
  onCancel?: () => void;
  onAction?: () => void;

  // Open state (optional)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CustomAlertDialog({
  // Trigger defaults
  triggerText = "Show Dialog",
  triggerVariant = "outline",
  triggerClassName = "",
  customTrigger,

  // Content defaults
  title,
  description,

  // Action defaults
  cancelText = "Cancel",
  actionText = "Continue",
  actionVariant = "default",
  actionClassName = "",

  // Callbacks
  onCancel,
  onAction,

  // Open state
  open,
  onOpenChange,
}: CustomAlertDialogProps) {
  const handleCancel = () => {
    onCancel?.();
  };

  const handleAction = () => {
    onAction?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button variant={triggerVariant} className={triggerClassName}>
            {triggerText}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} className={actionClassName}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
