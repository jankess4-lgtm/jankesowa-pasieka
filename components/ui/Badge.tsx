import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "gold" | "warning" | "unavailable";
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
          "bg-amber-500 text-white": variant === "warning",
          "bg-neutral-400 text-white": variant === "unavailable",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
