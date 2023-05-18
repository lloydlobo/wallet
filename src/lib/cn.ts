import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` conditionally adds Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// @example
// import clsx from 'clsx'
//
// function MyButton({ isHovering, children }) {
//   let classes = clsx(
//     'rounded bg-blue-500 px-4 py-2 text-base text-white',
//     {
//       'bg-blue-700 text-gray-100': isHovering,
//     },
//   )
//
//   return (
//     <button className={classes}>
//       {children}
//     </button>
//   )
// }
