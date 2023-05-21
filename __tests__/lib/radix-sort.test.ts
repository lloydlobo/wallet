import { Ordering } from '../../src/lib/enums';
import { radixSort } from '../../src/lib/radix-sort';
import { TRowExpense, TUpdateExpense } from '@/lib/types-supabase';

import { assert, describe, expect, test } from 'vitest';
import fc from 'fast-check';

describe('warmup testrun sortNumbersAscending', () => {
  describe('test bubble sort with values', () => {
    test('should keep an already sorted array sorted', () => {
      expect(sortNumbersAscending([1, 2, 3])).toEqual([1, 2, 3]);
    });
    test('should sort a randomly ordered array in ascending order', () => {
      expect(sortNumbersAscending([3, 1, 2])).toEqual([1, 2, 3]);
    });
    test('should sort a descending ordered array in ascending order', () => {
      expect(sortNumbersAscending([3, 1, 2])).toEqual([1, 2, 3]);
    });
  });

  describe('test bubble sort with fast-check(quickcheck) arbitrary values', () => {
    test('should sort numeric elements from the smallest to the largest one', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (data) => {
          const sortedData = sortNumbersAscending(data);
          for (let i = 1; i < data.length; i++) {
            expect(sortedData[i - 1]).toBeLessThanOrEqual(sortedData[i]);
          }
        })
      );
    });
  });
});

describe('sort', () => {
  test('should have the same length as source', () => {
    const source: TRowExpense[] = [];
    expect(radixSort(source, Ordering.Less).length).toBe(source.length);
  });
});

/*
 * Testing Helpers
 */

const seedArb = fc.integer().noBias().noShrink();

const recordModel = {
  name: fc.string(),
  description: fc.string(),
  amount: fc.float(),
  transaction_date: fc.string(),
  created_at: fc.string(),
  updated_at: fc.string(),
  is_cash: fc.boolean(),
  owner: fc.string(),
  id: fc.integer(),
};
const inputsArb: fc.Arbitrary<TRowExpense> = fc.record(recordModel);

/*
 * Mock Helpers
 */

/**
 * Similar to Bubble sort.
 */
const sortNumbersAscending = (array: number[]): number[] => {
  const len = array.length;

  const swap = (vec: number[], index: number): void => {
    const temp = vec[index];
    vec[index] = vec[index + 1];
    vec[index + 1] = temp;
  };

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        swap(array, j);
      }
    }
  }

  return array;
};
