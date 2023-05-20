import { assert, describe, expect, test } from "vitest";
import { isEqual } from '@/lib/is-equal';

test('isEqual', () => {
  assert.isTrue(isEqual(5, 5));
  assert.isTrue(isEqual('hello', 'hello'));
  assert.isTrue(isEqual(null, null));
  assert.isTrue(isEqual(undefined, undefined));
  assert.isTrue(isEqual(NaN, NaN));
  assert.isTrue(isEqual({}, {}));
  assert.isTrue(isEqual([], []));

  assert.isFalse(isEqual(5, 10));
  assert.isFalse(isEqual('hello', 'world'));
  assert.isFalse(isEqual(null, undefined));
  assert.isFalse(isEqual(NaN, 0));
  assert.isFalse(isEqual({}, []));
  assert.isFalse(isEqual({ prop: 'value' }, { prop: 'value' }));
});
