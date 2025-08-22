import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "scroll-m-20 font-heading",
  {
    variants: {
      size: {
        default: "text-3xl font-bold tracking-tight",
        sm: "text-2xl font-semibold tracking-tight",
        lg: "text-4xl font-bold tracking-tight",
        xl: "text-5xl font-bold tracking-tight",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, as: Comp = "h2", ...props }, ref) => {
    return (
      <Comp
        className={cn(headingVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }