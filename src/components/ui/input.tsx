import { cn } from '@/lib/cn';
import { JSX } from 'solid-js/jsx-runtime';

/**
 * @typedef {JSX.InputHTMLAttributes<HTMLInputElement>} InputProps
 * @property {HTMLInputElement | undefined} ref - Optional reference to the input element.
 * @property {string} className - Custom class to append to the base `class` styling.
 * @description
 * Represents the properties for an input element. The `InputProps` type
 * extends `JSX.InputHTMLAttributes<HTMLInputElement>`, which is a built-in
 * TypeScript type representing the HTML attributes that can be applied to an <input> element.
 * It includes two additional properties: `ref` and `className`. The `ref` property is
 * optional and can be of type `HTMLInputElement` or `undefined`, and the `className` property
 * is of type `string`.
 */
//
export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  /** @property {HTMLInputElement | undefined} ref - Optional reference to the input element. */
  ref?: HTMLInputElement | undefined;

  /** @property {string} className - Custom class to append to the base `class` styling. */
  className?: string;

  // Add your additional props here...
};

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
    />
  );
};

Input.displayName = 'Input';

export { Input };

// export interface IInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> { ref ?: HTMLInputElement | undefined; className?: string; }
