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

/**
 * in-source test suites.
 */
if (import.meta.vitest) {
  const { test, assert } = import.meta.vitest;
  // const { it, expect } = import.meta.vitest

  test('isEqual', () => {
    assert.isTrue(isEqual(5, 5));
    assert.isTrue(isEqual('hello', 'hello'));
    assert.isTrue(isEqual(null, null));
    assert.isTrue(isEqual(undefined, undefined));
    assert.isTrue(isEqual(NaN, NaN));

    assert.isFalse(isEqual(5, 10));
    assert.isFalse(isEqual('hello', 'world'));
    assert.isFalse(isEqual(null, undefined));
    assert.isFalse(isEqual(NaN, 0));
    assert.isFalse(isEqual({}, []));
    assert.isFalse(isEqual({}, {}));
    assert.isFalse(isEqual([], []));
    assert.isFalse(isEqual({ prop: 'value' }, { prop: 'value' }));
  });
}
