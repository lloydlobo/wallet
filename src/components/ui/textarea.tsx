import { cn } from "@/lib/cn";

export function Textarea() {
  return (
    <textarea
      class={cn(
        "flex min-h-[80px] w-full px-3 py-2",
        "rounded-md border border-input bg-transparent",
        "text-sm ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      // ref={ref}
      // {...props}
    />
  );
}
