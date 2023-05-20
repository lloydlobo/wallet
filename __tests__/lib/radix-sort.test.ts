import { Ordering } from '@/lib/enums';
import { radixSort } from '@/lib/radix-sort';
import { TRowExpense } from '@/lib/types-supabase';

import { assert, describe, expect, test } from 'vitest';

describe('warmup testrun', () => {
  test('Math.sqrt()', () => {
    expect(Math.sqrt(4)).toBe(2);
    expect(Math.sqrt(144)).toBe(12);
    expect(Math.sqrt(2)).toBe(Math.SQRT2);
  });

  test('JSON', () => {
    const input = {
      foo: 'hello',
      bar: 'world',
    };
    const output = JSON.stringify(input);
    expect(output).eq('{"foo":"hello","bar":"world"}');
    assert.deepEqual(JSON.parse(output), input, 'matches original');
  });
});

// FIXME: With the following test, the test build or compiler system panics with, undetectable file.

/*
describe('radixSort', () => {

  const initial = [
    { transaction_date: '2023-05-20T10:30:00Z' },
    { transaction_date: '2023-05-20T08:15:00Z' },
    { transaction_date: '2023-05-20T11:45:00Z' },
    { transaction_date: '2023-05-20T09:00:00Z' },
  ];

  const items: TRowExpense[] = [];
  for (let index = 0; index < initial.length; index++) {
    const item = {
      amount: 0,
      created_at: "",
      description: "",
      id: 0,
      is_cash: true,
      name: "",
      owner: "",
      transaction_date: initial[index].transaction_date,
      updated_at: "",
    };
    items[index] = item;
  }

  describe('Valid date formats', () => {
    assert(1 === 0 + 1);


    // describe('Ascending order', () => {
    //   const sorted = radixSort(items, Ordering.Less);
    //   assert.deepEqual(sorted[0].transaction_date, items[0].transaction_date);
    // });

    //
    //   describe('Descending order', () => {
    //     const sorted = radixSort(items, 'Greater');
    //     assert.deepEqual(sorted, [
    //       { transaction_date: '2023-05-20T11:45:00Z' },
    //       { transaction_date: '2023-05-20T10:30:00Z' },
    //       { transaction_date: '2023-05-20T09:00:00Z' },
    //       { transaction_date: '2023-05-20T08:15:00Z' },
    //     ]);
    //   });
    // });
    //
    // describe('Invalid date formats', () => {
    //   const items = [
    //     { transaction_date: '2023-05-20T10:30:00Z' },
    //     { transaction_date: 'invalid-date-format' },
    //     { transaction_date: '2023-05-20T11:45:00Z' },
    //   ];
    //
    //   describe('Ascending order', () => {
    //     const sorted = radixSort(items, 'Less');
    //     assert.deepEqual(sorted, [
    //       { transaction_date: '2023-05-20T10:30:00Z' },
    //       { transaction_date: '2023-05-20T11:45:00Z' },
    //       { transaction_date: 'invalid-date-format' },
    //     ]);
    //   });
    //
    //   describe('Descending order', () => {
    //     const sorted = radixSort(items, 'Greater');
    //     assert.deepEqual(sorted, [
    //       { transaction_date: 'invalid-date-format' },
    //       { transaction_date: '2023-05-20T11:45:00Z' },
    //       { transaction_date: '2023-05-20T10:30:00Z' },
    //     ]);
    //   });
  });
});

*/
