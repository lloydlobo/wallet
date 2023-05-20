/** @source: https://github.com/lxsmnsyc/solid-headless/blob/next/packages/terracotta/src/utils/assert.ts */

export function assert<T extends Error>(condition: unknown, error: T): asserts condition {
  if (!condition) {
    throw error;
  }
}
