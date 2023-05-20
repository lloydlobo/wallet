import { createSignal, JSX } from 'solid-js';

import { cn } from '@/lib/cn';
import { ClassArray, ClassDictionary } from 'clsx';
import { cva, VariantProps } from 'class-variance-authority';

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
  className?: string;
};

const Tooltip = (props: TooltipProps) => {
  const [isHovered, setIsHovered] = createSignal(false);

  const handleMouseEnter = (
    ev: MouseEvent & { currentTarget: HTMLDivElement; target: Element }
  ) => {
    ev.preventDefault();
    setIsHovered(true);
  };

  const handleMouseLeave = (
    ev: MouseEvent & { currentTarget: HTMLDivElement; target: Element }
  ) => {
    ev.preventDefault();
    setIsHovered(false);
  };

  const tooltipClasses = cn(
    tooltipVariants({
      placement: props.placement,
      size: props.size,
      color: props.color,
      transition: props.transition,
    }),
    props.className
  );

  return (
    <div
      class="relative flex flex-col"
      onMouseEnter={(ev) => handleMouseEnter(ev)}
      onMouseLeave={(ev) => handleMouseLeave(ev)}
    >
      {props.children}
      <div
        class={cn(
          'absolute z-10 border',
          tooltipClasses,
          isHovered() ? 'opacity-100' : 'opacity-0 delay-300'
        )}
      >
        {props.text}
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };

const getPlacement = (value: TooltipProps['placement']): string => {
  let placement: string;
  switch (value) {
    case 'top':
      placement = cn('bottom-full');
      break;
    case 'bottom':
      placement = cn('top-full');
      break;
    case 'left':
      placement = cn('right-full');
      break;
    case 'right':
      placement = cn('left-full');
      break;
    case 'topleft':
      placement = cn('bottom-full', 'right-full');
      break;
    case 'topright':
      placement = cn('bottom-full', 'left-full');
      break;
    case 'bottomleft':
      placement = cn('top-full', 'right-full');
      break;
    case 'bottomright':
      placement = cn('top-full', 'left-full');
      break;
    default:
      placement = cn('top-full', 'right-full');
      break;
    // throw new Error("Invalid placement value");
  }
  return placement;
};
