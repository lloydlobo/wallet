import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";

/*
 * 
  const addExpense = (e: SubmitEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newExp: TDatabaseExpense = {
      amount: 0,
      created_at: now,
      description: null,
      id: (expenses()?.length ?? -1) + 1,
      is_cash: true,
      name: newTitle(),
      owner: "",
      transaction_date: now,
      updated_at: now,
    };
    batch(() => {
      setExp(exp.length, newExp);
      setTitle("");
    }); // Holds changes inside the block before the reactive context is updated *@param* `fn` — wraps the reactive updates that should be batched  *@returns* — the return value from `fn`
  };
 * */

export function createLocalStoreTodos<T extends object>(
  name: string,
  init: T,
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name);
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init,
  );

  createEffect(() => localStorage.setItem(name, JSON.stringify(state)));

  return [state, setState];
}

export function removeIndex<T>(array: readonly T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

// Make all properties in T optional
export type LocalStoreExpenses<T> = Partial<T>;

//   This type is tricky to use so should be avoided if possibleUse `Record<string, unknown>`
// instead deno-lint (ban-types) [5, 49]
// T extends Record<string, unknown> | object,
// export function createLocalStore<T extends Record<string, unknown>>(
export function createLocalStore<T extends object>(
  key: string,
  init: T,
): [Store<T>, SetStoreFunction<T>] {
  const localState: string | null = localStorage.getItem(key);
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init,
  );
  createEffect(() => localStorage.setItem(key, JSON.stringify(state)));

  return [state, setState];
}
