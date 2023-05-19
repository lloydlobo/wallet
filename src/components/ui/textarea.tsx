import { cn } from '@/lib/cn';
import { JSX } from 'solid-js/jsx-runtime';

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Add your additional props here
  // ref?: HTMLTextAreaElement | undefined
}

const stylesInput = cn(
  'flex min-h-[80px] w-full px-3 py-2',
  'rounded-md border border-input bg-transparent',
  'text-sm ring-offset-background placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

const Textarea = (
  props: JSX.IntrinsicAttributes & JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  return (
    <textarea
      class={cn(stylesInput, props.class)}
      // ref={props.ref}
      // ref={props.ref}
      {...props}
    />
  );
};

Textarea.displayName = 'Textarea';

export { Textarea, stylesInput };
