import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles = "btn inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.985] disabled:opacity-60";
    
    const variants = {
      primary: "btn-primary px-6 py-2.5 text-base",
      secondary: "btn-secondary px-6 py-2.5 text-base",
      outline: "btn-outline px-5 py-2",
      ghost: "btn-ghost px-4 py-2 text-sm",
    };

    const sizes = {
      default: "",
      sm: "text-sm px-4 py-1.5",
      lg: "text-lg px-8 py-3.5",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
