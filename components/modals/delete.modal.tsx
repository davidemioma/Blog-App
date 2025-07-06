"use client";

import React from "react";
import { Button } from "../ui/button";
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

type Props = {
  title: string;
  description?: string;
  prompt: string;
  icon?: React.ReactNode;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "violet";
  size?: "default" | "sm" | "lg" | "icon";
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  onContinue: () => void;
  disabled: boolean;
};

const DeleteModal = ({
  title,
  description,
  variant,
  size,
  icon,
  prompt,
  isOpen,
  onOpenChange,
  onCancel,
  onContinue,
  disabled,
}: Props) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          className="gap-2"
          variant={variant || "violet"}
          size={size || "default"}
        >
          {icon}

          {prompt}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled} onClick={onCancel}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction disabled={disabled} onClick={onContinue}>
            {disabled ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
