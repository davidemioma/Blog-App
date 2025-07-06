import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

const EmptyState = ({
  title = "No items found",
  description = "Get started by creating your first item.",
  icon,
  action,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="violet">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
