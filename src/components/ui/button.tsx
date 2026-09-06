import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
        secondary:
          "bg-surface-elevated text-fg border border-border hover:border-border-strong active:scale-[0.98]",
        ghost:
          "bg-transparent text-fg hover:bg-surface-elevated/80 active:scale-[0.98]",
        danger:
          "bg-danger text-fg hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        md: "h-11 px-5 text-sm rounded-[var(--radius-md)]",
        lg: "h-12 px-7 text-base rounded-[var(--radius-lg)]",
        icon: "size-11 rounded-[var(--radius-md)]",
        pill: "h-12 px-8 text-base rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
