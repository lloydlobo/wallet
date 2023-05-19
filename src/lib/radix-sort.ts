/**
 * This implementation uses the radix sort algorithm along with the counting sort algorithm
 * to sort the items based on their timestamps.
 *
 * The radixSort() function iterates through the digits of the largest timestamp and uses
 * the countingSort() function to sort the items based on the
 * current digit.
 *
 * The countingSort() function uses an array of counts to count the number of items with
 * the current digit and then concatenates the counts to create the sorted output array.
 *
 * Using this optimized sorting algorithm reduces the time complexity of the sorting step from
 * O(n log n) to O(kn), which is a significant improvement if the number of items is large.
 */

import { Ordering } from '@/lib/enums';
import { TDatabaseExpense } from '@/lib/types-supabase';

/**
 * Sorts the items based on their timestamps using the radix sort algorithm.
 * @param items - The array of items to be sorted.
 * @param cmp - The ordering direction for the sort (Ordering.Less for ascending, Ordering.Greater for descending).
 * @returns The sorted array of items.
 */
export function radixSort(items: TDatabaseExpense[], cmp: Ordering): TDatabaseExpense[] {
  /**
   * Finds the maximum timestamp from the items array.
   */
  const maxTimestamp = Math.max(
    ...items.map((item) =>
      new Date(item.transaction_date ?? item.created_at ?? item.updated_at).getTime()
    )
  );
  let divisor = 1;

  /**
   * Performs radix sort by iterating through the digits of the largest timestamp.
   */
  while (Math.floor(maxTimestamp / divisor) > 0) {
    items = countingSort({
      array: items as TDatabaseExpense[],
      divisor,
      cmp,
    });
    divisor *= 10;
  }

  return items;
}

type CountingSort = {
  array: TDatabaseExpense[];
  divisor: number;
  cmp: Ordering;
};

/**
 * Sorts the items based on the current digit using the counting sort algorithm.
 * @param props - The counting sort properties including the array, divisor, and cmp.
 * @returns The sorted array of items based on the current digit.
 */
function countingSort(props: CountingSort): TDatabaseExpense[] {
  const counts = Array.from({ length: 10 }, () => [] as TDatabaseExpense[]);
  const output: TDatabaseExpense[] = [];

  /**
   * Counts the number of items with the current digit and puts them in the corresponding count array.
   */
  for (const item of props.array) {
    const digit = Math.floor(
      (new Date(item.transaction_date ?? item.created_at ?? item.updated_at).getTime() /
        props.divisor) %
        10
    );

    counts[digit].push(item);
  }

  /**
   * Concatenates the counts to create the sorted output array based on the ordering direction.
   */
  if (props.cmp === Ordering.Less) {
    for (const count of counts) {
      output.push(...count);
    }
  } else if (props.cmp === Ordering.Greater) {
    for (let i = counts.length - 1; i >= 0; i--) {
      output.push(...counts[i]);
    }
  }

  return output;
}

/*
 * Explanation of how the radix sort algorithm works including an ASCII art example to
 * help illustrate the process.
 *
 * Radix sort is a non-comparative sorting algorithm that sorts elements based on their digits. It
 * works by processing the elements digit by digit, from the least significant digit to the
 * most significant digit, using a stable sorting algorithm (in this case, counting sort) at
 * each digit position.
 *
 * Here's a step-by-step breakdown of the radix sort algorithm with an ASCII art example:
 *
 * 1. Consider an array of items to be sorted based on their timestamps:
 *
 * ```
 * [8, 15, 3, 10, 2]
 * ```
 *
 * 2. Find the maximum timestamp from the array. In this case, it's 15.
 *
 * 3. Start with the least significant digit (rightmost digit) and iterate through all the digits
 *    of the maximum timestamp.
 *
 * 4. Perform the counting sort algorithm for each digit position. Counting sort works by
 *    counting the number of occurrences of each digit and then creating an output array with
 *    the elements sorted based on that digit.
 *
 * 5. Repeat the counting sort for each digit position, moving from the least significant digit
 *    to the most significant digit.
 *
 * 6. After sorting each digit position, the array is sorted based on the timestamps.
 *
 * Here's an ASCII art example illustrating the radix sort process for the array [8, 15, 3, 10, 2]:
 *
 * ```
 * Array: [8, 15, 3, 10, 2]
 *
 * Step 1: Sort by least significant digit (ones place)
 *         Counting Sort: [10, 2], [3], [], [], [8, 15]
 *         Result: [10, 2, 3, 8, 15]
 *
 * Step 2: Sort by next significant digit (tens place)
 *         Counting Sort: [2, 3, 8], [10, 15], [], [], []
 *         Result: [2, 3, 8, 10, 15]
 *
 * Step 3: Sort by most significant digit (hundreds place)
 *         Counting Sort: [2, 3, 8, 10, 15], [], [], [], []
 *         Result: [2, 3, 8, 10, 15]
 *
 * Final Sorted Array: [2, 3, 8, 10, 15]
 * ```
 *
 * In each step, the counting sort is performed on the corresponding digit position. The elements
 * are distributed into different buckets based on the current digit, and then the buckets
 * are concatenated to form the sorted array.
 *
 * By repeating this process for each digit position, the radix sort algorithm can efficiently
 * sort the items based on their timestamps. The radix sort algorithm has a time complexity of
 * O(kn), where n is the number of items and k is the number of digits in the maximum timestamp.
 */

// ARCHIVE
// const sortByDate = (items: TDatabaseExpense[] | null) => {
//   const data = items;
//   if (data) {
//     data.sort((a, b) => {
//       const aTimestampz = new Date(a.transaction_date ?? a.created_at ?? a.updated_at).getTime();
//       const bTimestampz = new Date(b.transaction_date ?? b.created_at ?? b.updated_at).getTime();
//       console.log({ date_a: aTimestampz, date_b: bTimestampz });
//       return -1 * (aTimestampz - bTimestampz); // latest at top.
//     });
//   }
//   return data;
// }
//
