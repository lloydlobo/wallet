/* @source https://github.com/lxsmnsyc/solid-headless/blob/next/packages/terracotta/src/utils/types.ts */

/**
 * Represents a reference with a value of type `T`.
 * @template T The type of the referenced value.
 * @example
 * ```
 * function createFooState<T>(options: BarStateOptions<T>): BazStateProperties<T> {
 *   const [active, setActive] = createSignal<Ref<T>>();
 *   // ...
 * }
 * ```
 * @syntax
 * ```
 * interface Ref<T> { value: T }
 * ```
 */
export interface Ref<T> {
  /** The referenced value. */
  value: T;
}

/**
 * Utility type to prettify a given type `T`.
 * This type preserves the original properties and their types without adding any additional
 * changes.
 *
 * This type can be used to ensure type compatibility when you want to pass an object with
 * additional properties to a function or assign it to a variable.
 * @template T The type to be prettified.
 * @syntax
 * ```
 * {
 *   [K in keyof T]: T[K]
 * } & {}
 * ```
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Utility type to merge the properties of type `A` and exclude the properties of type `B` from
 * the merged result.
 *
 * This type can be useful when you want to combine multiple types while excluding duplicate
 * properties.
 * @template A The first type to merge.
 * @template B The second type to merge.
 * @syntax
 * ```
 * A & Omit<B, keyof A>
 * ```
 */
export type OmitAndMerge<A, B> = A & Omit<B, keyof A>;
