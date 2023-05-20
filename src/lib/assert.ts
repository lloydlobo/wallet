/* @source: https://github.com/lxsmnsyc/solid-headless/blob/next/packages/terracotta/src/utils/assert.ts */

/**
 * @param expression Expression to test for truthiness.
 * @param error Error or Message to display on error.
 */
export function assert<T extends Error>(expression: unknown, error: T): asserts expression {
  if (!expression) {
    throw error;
  }
}

/**
 * @description in-source test suites.
 */
if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;

  describe('assert', () => {
    test('should assert equality', () => {
      expect(assert(1 === 0 + 1, new Error(`'1' should be equal to '0+1'`)));
    });

    test('should assert inequality', () => {
      expect(assert(1 !== 0 - 1, new Error(`'1' should not be equal to '0-1'`)));
    });
  });
}
