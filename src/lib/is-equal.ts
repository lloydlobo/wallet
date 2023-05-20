/* eslint-disable no-self-compare */

/**
 * `isEqual` compares Equality Ordering between two parametrs.
 *
 * - `===` operator in `JS/TS` is error prone.
 * - `Object.is` is slow.
 *
 * @param a {unknown} First parameter.
 * @param b {unknown} Second parameter.
 * @returns {boolean} Returns `true` if `a` is equal to `b` or else returns false.
 *
 * @source https://github.com/lxsmnsyc/solid-headless/blob/next/packages/terracotta/src/utils/is-equal.ts
 */
export function isEqual(a: unknown, b: unknown): boolean {
  // rome-ignore lint/suspicious/noSelfCompare: <explanation>
  return a === b || (a !== a && b !== b);
}
