import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-brand-green text-white": variant === "default",
          "border border-brand-brown/40 text-brand-brown": variant === "outline",
          "bg-brand-gold/90 text-white": variant === "gold",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
