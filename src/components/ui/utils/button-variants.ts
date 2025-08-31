import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark hover:shadow-[var(--shadow-button)] transform hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Professional (primary CTA) — unified solid brand blue in light & dark (no gradient)
        professional: [
          // Base colors (light uses design tokens; dark overrides to keep blue rather than white var(--primary))
          "font-semibold shadow-sm",
          "bg-[hsl(var(--primary))] text-primary-foreground",
          "dark:bg-[hsl(217,91%,60%)] dark:text-white",
          // Hover / active / focus states
          "hover:bg-[hsl(var(--primary-dark))] dark:hover:bg-[hsl(217,91%,50%)]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Motion + subtle lift
            "transition-transform hover:-translate-y-0.5 active:translate-y-0",
          // Shadow accent on hover
          "hover:shadow-[var(--shadow-button)]",
        ].join(' '),
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-[var(--shadow-button)]",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
