import { batch, Component, createEffect, createResource, createSignal, For, JSXElement, lazy, Show } from 'solid-js';
import { JSX } from "solid-js/jsx-runtime";
import styles from './App.module.css';
import { PlusIcon } from './components/icons';
import { ListItem } from './components/ListItem';
import { ThemeToggle } from './components/ThemeToggle';
import { createLocalStore, removeIndex } from "./lib/store";
import { supabase } from './lib/supabase-client';
import type { Expense } from './lib/types';
import { radixSort } from './lib/radix-sort';
import { Ordering } from "./lib/enums";
import { Database, TDatabaseExpense } from './lib/types-supabase';
import logo from './logo.svg';

const DB_NAME_EXPENSES = 'expenses';

async function getDB(): Promise<TDatabaseExpense[] | null | undefined> {
  try {
    const { data } = await supabase.from(DB_NAME_EXPENSES).select();
    return data as TDatabaseExpense[];
  } catch (err) {
    console.error(err);
  }
}
async function insertDB() {
  try {
    const { data } = await supabase.from(DB_NAME_EXPENSES).insert({
      name: "Ramen",
      description: "NA",
      amount: 4,
    });

  } catch (err) {
    console.error(err);
  }
}

type TodoItem = { title: string; done: boolean };
// fetcher: ResourceFetcher<true, unknown, unknown>, options: InitializedResourceOptions<unknown, true>
const fetchUser = async (id: unknown) =>
  (await fetch(`https://swapi.dev/api/people/${id}/`)).json();
const App: Component = () => {
  const [userId, setUserId] = createSignal();
  const [expenses, setExpenses] = createSignal<TDatabaseExpense[] | null>(null);
  const [user] = createResource(userId, fetchUser);
  const [groupedState, setGroupedState] = createSignal<unknown | null>(null);
  const [newTitle, setTitle] = createSignal("");
  const [todos, setTodos] = createLocalStore<TodoItem[]>("todos", []);

  // TODO: Effects are meant primarily for side effects that read but don't write to the reactive system
  // : it's best to avoid setting signals in effects, which without care can cause additional rendering
  // or even infinite effect loops. Instead, prefer using createMemo to compute new values that depend
  // on other reactive values, so the reactive system knows what depends on what, and can optimize accordingly
  let entries;
  createEffect(async () => {
    const data = await getDB();
    if (!data) return;
    setExpenses(data);
    const items = expenses();
    if (items) {
      // const grouped = groupedTodos(sortByDate(items));
      const grouped = groupedTodos(radixSort(items, Ordering.Greater));
      if (grouped) {
        entries = Object.entries(grouped);
        setGroupedState(entries);
        console.log({ entries, entries_type: typeof entries });
      }
    }
  })

  const addTodo = (e: SubmitEvent) => {
    e.preventDefault();
    batch(() => {
      setTodos(todos.length, {
        title: newTitle(),
        done: false,
      });
      setTitle("");
    });
  };

  const sortByDate = (items: TDatabaseExpense[] | null) => {
    const data = items;
    if (data) {
      data.sort((a, b) => {
        // TODO: add another field for business logic i.e. the transaction_date
        const aTimestampz = new Date(a.transaction_date ?? a.created_at ?? a.updated_at).getTime();
        const bTimestampz = new Date(b.transaction_date ?? b.created_at ?? b.updated_at).getTime();
        console.log({ date_a: aTimestampz, date_b: bTimestampz });
        return -1 * (aTimestampz - bTimestampz); // latest at top.
      });
    }
    return data;
  }

  /**
   * Group the items based on months and years using the reduce() method.
   * @param items - Array of TDatabaseExpense items to be grouped.
   * @returns An object where keys represent month and year combinations, and values are arrays of TDatabaseExpense
   * items for each group.
   */
  const groupedTodos = (items: TDatabaseExpense[] | null) => {
    if (items) {
      return items.reduce((acc: { [key: string]: TDatabaseExpense[]; }, item) => {
        const month = new Date(item.transaction_date ?? "").toLocaleString("default", { month: "long" });
        const year = new Date(item.transaction_date ?? "").getFullYear().toString();
        const key = `${month} ${year}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
    }
  };



  // const items = expenses();
  // const grouped = groupedTodos(sortByDate(items));

  return (
    <div class="@container h-screen">
      <div class="container border! h-full flex flex-col justify-between max-w-lg @md:max-w-3xl space-y-0 mx-auto py-8!">
        <header class="py-6">
          <div class="flex justify-between">
            <div class="logo">wallet</div>
            <div class="nav-end grid gap-4 grid-flow-col">
              <a class={styles.link} href="/" >Refresh</a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div class={styles.list_window}>
          <Show when={groupedState()}>
            <For each={groupedState() as unknown[] as [string, TDatabaseExpense[]]}>
              {items => (
                <section class="bg-card rounded-xl border! p-4! space-y-1">
                  <h2 class="text-sm tracking-tighter text-muted-foreground">{items[0] as string}</h2>
                  <div class="group_items">
                    <Show when={items[1] as unknown as TDatabaseExpense[]}>
                      <For each={items[1] as unknown as TDatabaseExpense[]}>
                        {item => <ListItem item={item} />}
                      </For>
                    </Show>
                  </div>
                </section>
              )}
            </For>
          </Show>

          <section class="hidden">
            <div class="grid gap-2">
              <For each={todos}>
                {(todo, i) => (
                  <div class="flex gap-4 w-full mx-auto items-center">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={(e) => setTodos(i(), "done", e.currentTarget.checked)}
                      data-tooltip={`Consolidate ${todo.title}`}
                      data-placement="right"
                      class="form-checkbox  bg-background rounded"
                    />
                    <input
                      type="text"
                      value={todo.title}
                      onChange={(e) => setTodos(i(), "title", e.currentTarget.value)}
                      class="form-input bg-background w-full "
                    />
                    <button class="" onClick={() => setTodos((t) => removeIndex(t, i()))}
                      data-tooltip={`Delete ${todo.title}`}
                    >
                      x
                    </button>
                  </div>
                )}
              </For>
            </div>
          </section>

          <section class="hidden">
            <input
              type="number"
              min="1"
              placeholder="Enter Numeric Id"
              onInput={(e) => setUserId(e.currentTarget.value)}
            />
            <span>{user.loading && "Loading..."}</span>
            <div>
              <pre>{JSON.stringify(user(), null, 2)}</pre>
            </div>
          </section>
        </div>

        <div
          class="place-self-end flex-shrink-0 top-full m-0 sticky bottom-0 bg-slate-100 dark:bg-slate-900 pb-8 py-4 mx-0 px-12 left-0 right-0 w-full"
        >
          <form onSubmit={addTodo} class="flex h-fit w-full gap-4 mx-auto">
            <input
              placeholder="enter todo and click +"
              required
              value={newTitle()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              class="border p-4 rounded-[50px] bg-background w-full max-w-xl"
            />
            <button class="" type="submit"><PlusIcon /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;

function Card(): JSX.Element {
  return (
    <div class="w-full min-h-[40%] items-center gap-2 m-6 bg-slate-100 rounded-xl p-6 @xl:flex">
      <div class="bg-slate-300 @xl:w-1/4 @xl:h-full aspect-video mb-4 w-full object-cover" />
      {/*<img src={logo} alt="solid" class="@xl:w-1/4" />*/}
      <div >
        <h2 class="text-xl font-bold">Lorem</h2>
        <p>Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.</p>
        <button type='button'>Read more</button>
      </div>
    </div>
  )
}

function Cards(): JSX.Element {
  return (
    <section class="m-8 @container grid grid-cols-2 w-full mx-auto max-w-4xl gap-12 ">
      <Card />
      <Card />
      <Card />
    </section>
  )
}
