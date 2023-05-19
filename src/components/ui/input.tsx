import { cn } from '@/lib/cn';
import { JSX } from 'solid-js/jsx-runtime';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  // Add your additional props here
  ref?: HTMLInputElement | undefined;
  /** Custom class to append to the base `class` styling. */
  className?: string;
  // type?: string
}

const Input = (props: InputProps) => {
  return (
    <input
      class={cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.className
      )}
      {...props}
      // ref={props.ref}
    />
  );
};

Input.displayName = 'Input';

export { Input };
