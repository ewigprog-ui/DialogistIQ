// SPDX-License-Identifier: GPL-3.0-or-later
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButton = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-100 " +
    "hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "size-7 [&_svg]:size-4",
        md: "size-8 [&_svg]:size-[18px]",
      },
      active: {
        true: "bg-selected text-ink",
        false: "",
      },
    },
    defaultVariants: { size: "md", active: false },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButton> {
  /** Accessible name; also shown as tooltip. */
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size, active, label, title, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={title ?? label}
      className={cn(iconButton({ size, active }), className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
