import { cva, VariantProps } from 'class-variance-authority';
import { Component, FlowComponent, Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Optional reference to the button element. */
  ref?: HTMLButtonElement | undefined;
  /** Custom class to append to the base `class` styling. */
  className?: string;
  /** Sets the asChild parameter and nest the link component. */
  asChild?: boolean;
  // Add your additional props here...
  // type?: "submit" | "reset" | "button" | undefined
}

/**
 * Displays a button or a component that looks like a button.
 *
 * # Usage
 *
 * ```
 * import { Button } from "@/components/ui/button"
 * <Button variant="outline">Button</Button>
 * ```
 *
 * ## Link
 * You can use the buttonVariants helper to create a link that looks like a button.
 *
 * ```
 * import { buttonVariants } from "@/components/ui/button"
 * <Link className={buttonVariants({ variant: "outline" })}>Click here</Link>
 * ```
 *
 * Alternatively, you can set the asChild parameter and nest the link component.
 *
 * ```
 * <Button asChild>
 *   <Link href="/login">Login</Link>
 * </Button>
 * ```
 */
// TODO: `FlowComponent` requires a `children` prop with the specified type. Use this for components where you need a specific child type, typically a function that receives specific argument types. Note that all JSX <Elements> are of the type `JSX.Element`.
// const MyButton: FlowComponent<ButtonProps> = (props: ButtonProps) => {
// const Comp = props.asChild ? props.children : "button"
// A general `Component` has no implicit `children` prop.  If desired, you can
// specify one as in `Component<{name: String, children: JSX.Element}>`.
// @see https://raqueebuddinaziz.com/blog/3-patterns-to-write-better-and-more-readable-solidjs-components/#declarative-slots
const Button = (props: ButtonProps) => {
  return (
    <>
      <Show
        when={props.asChild}
        fallback={
          <button
            type={props.type ?? 'button'}
            class={cn(
              buttonVariants({
                variant: props.variant,
                size: props.size,
                className: props.className,
              })
            )}
            {...props}
          >
            {props.children}
          </button>
        }
      >
        <button
          role={props.role ?? 'none'}
          type={props.type ?? 'button'}
          class={cn(
            buttonVariants({ variant: props.variant, size: props.size, className: props.className })
          )}
          {...props}
        >
          {props.children}
        </button>
      </Show>
    </>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };

// export interface IButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> { ref ?: HTMLButtonElement | undefined; className?: string; }

// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
//
// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }
//
// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Button.displayName = "Button"
//
// export { Button, buttonVariants }
