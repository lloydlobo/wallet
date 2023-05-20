import { createMemo, type JSX } from 'solid-js';

export type FragmentProps = {
  children?: JSX.Element;
};

/**
 * `Fragment` is similar to a `Slot` to nest `children` `JSX.Element` within.
 *
 * It creates a readonly derived reactive memoized signal with `createMemo`.
 * Note: SolidJS does'nt provide this as of 2023-05-20 11:39.
 *
 * @source https://github.com/lxsmnsyc/solid-headless/blob/next/packages/terracotta/src/utils/Fragment.ts
 */
export function Fragment(props: FragmentProps): JSX.Element {
  return createMemo(() => props.children) as unknown as JSX.Element;
}
