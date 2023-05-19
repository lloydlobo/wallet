import { cn } from '@/lib/cn'

type Props = {
  class?: string
}

function Skeleton(props: Props) {
  return (
    <div
      class={cn('animate-pulse rounded-md bg-muted', props.class)}
      // {...props}
    />
  )
}

export { Skeleton }
