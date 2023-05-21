/* eslint-disable no-unused-vars */

import { cn } from '@/lib/cn';

import { cva, VariantProps } from 'class-variance-authority';
import { createSignal, JSX } from 'solid-js';
import { Fragment } from './fragment';
// import { ClassArray, ClassDictionary } from 'clsx';

const tooltipVariants = cva('absolute', {
  variants: {
    placement: {
      default: 'top-full right-full',
      top: 'bottom-full',
      bottom: 'top-full',
      left: 'right-full',
      right: 'left-full',
      topleft: 'bottom-full right-full',
      topright: 'bottom-full left-full',
      bottomleft: 'top-full right-full',
      bottomright: 'top-full left-full',
    },
    size: {
      default: 'leading-4 px-2 py-1 rounded-md',
      large: 'leading-7 px-3 py-2 rounded-lg',
    },
    color: {
      default: 'bg-muted',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
    },
    transition: {
      default: 'transition-opacity duration-200 delay-100',
      fast: 'transition-opacity duration-100 delay-50',
    },
    textAlignment: {
      default: 'text-start',
      center: 'text-center',
      start: 'text-start',
      end: 'text-end',
    },
  },
  defaultVariants: {
    // variant: 'default',
    placement: 'default',
    size: 'default',
    color: 'default',
    transition: 'default',
    textAlignment: 'default',
  },
});

type TooltipProps = {
  placement?: VariantProps<typeof tooltipVariants>['placement'];
  size?: VariantProps<typeof tooltipVariants>['size'];
  color?: VariantProps<typeof tooltipVariants>['color'];
  transition?: VariantProps<typeof tooltipVariants>['transition'];
  children: JSX.Element;
  text: string;
  withClass?: string;
};

type TargetDiv = {
  currentTarget: HTMLDivElement;
  target: Element;
};

const Tooltip = (props: TooltipProps) => {
  const [isHovered, setIsHovered] = createSignal(false);

  const handleMouseEnter = (_ev: MouseEvent & TargetDiv) => {
    setIsHovered(true);
  };
  const handleMouseLeave = (_ev: MouseEvent & TargetDiv) => {
    setIsHovered(false);
  };

  const styleScopedHandler = (): string =>
    cn(
      'absolute z-10 border',
      cn(
        tooltipVariants({
          placement: props.placement,
          size: props.size,
          color: props.color,
          transition: props.transition,
        }),
        props.withClass
      ),
      isHovered()
        ? 'pointer-events-auto opacity-100 delay-700'
        : 'pointer-events-none opacity-0  delay-500'
    );

  // PERF: If user clicks the {props.children}, do not trigger `isHovered()`.
  // PERF: If user wants to select the hovered tooltip data, pause transition.
  return (
    <div
      class="relative flex flex-col"
      onMouseEnter={(ev) => handleMouseEnter(ev)}
      onMouseLeave={(ev) => handleMouseLeave(ev)}
    >
      {props.children}
      <div class={styleScopedHandler()}>{props.text}</div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
