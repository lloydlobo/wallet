import { test, assert } from 'vitest';
import { radixSort } from '@/lib/radix-sort';

test('radixSort', () => {
  describe('Valid date formats', () => {
    const items = [
      { transaction_date: '2023-05-20T10:30:00Z' },
      { transaction_date: '2023-05-20T08:15:00Z' },
      { transaction_date: '2023-05-20T11:45:00Z' },
      { transaction_date: '2023-05-20T09:00:00Z' },
    ];

    describe('Ascending order', () => {
      const sorted = radixSort(items, 'Less');
      assert.deepEqual(sorted, [
        { transaction_date: '2023-05-20T08:15:00Z' },
        { transaction_date: '2023-05-20T09:00:00Z' },
        { transaction_date: '2023-05-20T10:30:00Z' },
        { transaction_date: '2023-05-20T11:45:00Z' },
      ]);
    });

    describe('Descending order', () => {
      const sorted = radixSort(items, 'Greater');
      assert.deepEqual(sorted, [
        { transaction_date: '2023-05-20T11:45:00Z' },
        { transaction_date: '2023-05-20T10:30:00Z' },
        { transaction_date: '2023-05-20T09:00:00Z' },
        { transaction_date: '2023-05-20T08:15:00Z' },
      ]);
    });
  });

  describe('Invalid date formats', () => {
    const items = [
      { transaction_date: '2023-05-20T10:30:00Z' },
      { transaction_date: 'invalid-date-format' },
      { transaction_date: '2023-05-20T11:45:00Z' },
    ];

    describe('Ascending order', () => {
      const sorted = radixSort(items, 'Less');
      assert.deepEqual(sorted, [
        { transaction_date: '2023-05-20T10:30:00Z' },
        { transaction_date: '2023-05-20T11:45:00Z' },
        { transaction_date: 'invalid-date-format' },
      ]);
    });

    describe('Descending order', () => {
      const sorted = radixSort(items, 'Greater');
      assert.deepEqual(sorted, [
        { transaction_date: 'invalid-date-format' },
        { transaction_date: '2023-05-20T11:45:00Z' },
        { transaction_date: '2023-05-20T10:30:00Z' },
      ]);
    });
  });
});
