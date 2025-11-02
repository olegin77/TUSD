"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        premium:
          "bg-gradient-to-r from-gold-accent to-yellow-500 text-white hover:from-gold-accent/90 hover:to-yellow-500/90 shadow-premium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animate?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      animate = true,
      loading = false,
      loadingText = "Loading...",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          {loading ? (
            <>
              <span className="sr-only">{loadingText}</span>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              {children}
            </>
          ) : (
            children
          )}
        </Slot>
      );
    }

    if (animate) {
      // Extract and filter out event handlers that conflict with framer-motion
      const {
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        onDragStart,
        onDragEnd,
        onDrag,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        ...restProps
      } = props;
      return (
        <motion.button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-busy={loading}
          whileHover={isDisabled ? {} : { scale: 1.02 }}
          whileTap={isDisabled ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...(restProps as any)}
        >
          {loading ? (
            <>
              <span className="sr-only">{loadingText}</span>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              {children}
            </>
          ) : (
            children
          )}
        </motion.button>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">{loadingText}</span>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
