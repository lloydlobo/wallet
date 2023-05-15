import { Ordering } from "./enums";
import { TDatabaseExpense } from "./types-supabase";

/**
 * This implementation uses the radix sort algorithm along with the counting sort algorithm
 * to sort the items based on their timestamps. The radixSort() function iterates through
 * the digits of the largest timestamp and uses the countingSort() function to sort the
 * items based on the current digit. 
 *
 * Using this optimized sorting algorithm reduces the time complexity of the sorting step from
 * O(n log n) to O(kn), which is a significant improvement if the number of items is large.
 */
export function radixSort(items: TDatabaseExpense[], cmp: Ordering): TDatabaseExpense[] {
  const maxTimestamp = Math.max(
    ...items.map((item) =>
      new Date(
        item.transaction_date ?? item.created_at ?? item.updated_at
      ).getTime()
    )
  );
  let divisor = 1;

  while (Math.floor(maxTimestamp / divisor) > 0) {
    items = countingSort({
      array: items as TDatabaseExpense[],
      divisor,
      cmp
    },);
    divisor *= 10;
  }

  return items;
}

type CountingSort = {
  array: TDatabaseExpense[];
  divisor: number;
  cmp: Ordering
};

/**
 * The countingSort() function uses an array of counts to count the number of items with
 * the current digit and then concatenates the counts to create the sorted output array.
 */
function countingSort(props: CountingSort): TDatabaseExpense[] {
  const counts = Array.from({ length: 10 }, () => [] as TDatabaseExpense[]);
  const output: TDatabaseExpense[] = [];

  for (const item of props.array) {
    const digit = Math.floor((
      new Date(
        item.transaction_date ?? item.created_at ?? item.updated_at
      ).getTime() / props.divisor
    ) % 10);

    counts[digit].push(item);
  }

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
