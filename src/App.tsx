import { Component, createEffect, createSignal, batch, For, Show } from 'solid-js';
import { ListItem } from './components/ListItem';
import { supabase } from './lib/supabase-client';
import type { Expense } from './lib/types';
const DB_NAME_EXPENSES = 'expenses';
import { createLocalStore, removeIndex } from "./lib/store";
import styles from './App.module.css';

async function getDB(): Promise<Expense[] | null | undefined> {
  try {
    const { data } = await supabase.from(DB_NAME_EXPENSES).select();
    return data as Expense[];
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
const App: Component = () => {
  const [expenses, setExpenses] = createSignal<Expense[] | null>(null);

  // TODO: Effects are meant primarily for side effects that read but don't write to the reactive system: it's best to avoid setting signals in effects, which without care can cause additional rendering or even infinite effect loops. Instead, prefer using createMemo to compute new values that depend on other reactive values, so the reactive system knows what depends on what, and can optimize accordingly.
  createEffect(async () => {
    const data = await getDB();
    if (!data) return;
    setExpenses(data);
  });
  const [newTitle, setTitle] = createSignal("");
  const [todos, setTodos] = createLocalStore<TodoItem[]>("todos", []);

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
  return (
    <div>
      <div class="container max-w-lg md:max-w-2xl space-y-8 mx-auto py-8">
        <a class={styles.link} href="/" >Refresh</a>

        <div class="[&>section]:m-4 scroll-m-8 grid max-h-[88vh] min-h-[88vh] overflow-y-scroll [&>section]:rounded-3xl space-y-6 rounded-3xl bg-slate-100 dark:bg-slate-900!">
          <section class="bg-white p-8 scroll-m-8">
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
                    />
                    <input
                      type="text"
                      value={todo.title}
                      onChange={(e) => setTodos(i(), "title", e.currentTarget.value)}
                      class="w-full"
                    />
                    <button class="outline! warning! secondary" onClick={() => setTodos((t) => removeIndex(t, i()))}
                      data-tooltip={`Delete ${todo.title}`}
                    >
                      x
                    </button>
                  </div>
                )}
              </For>
            </div>
          </section>

          <section class="bg-white p-8">
            {/* figure acts as a container to make any content scrollable horizontally. */}
            <Show when={expenses() !== null}>
              <div>
                <For each={expenses()}>
                  {item => <ListItem item={item} />}
                </For>
              </div>
            </Show>
          </section>


          <section class="place-self-end m-0 sticky bottom-0 bg-slate-100 rounded-none pb-8  py-4 px-12 left-0 right-0 w-full">
            <form onSubmit={addTodo} class="flex h-fit w-full gap-4 mx-auto">
              <input
                placeholder="enter todo and click +"
                required
                value={newTitle()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                class="border border-slate-300 p-4 rounded-[50px] w-full max-w-xl"
              />
              <button class="" type="submit">+</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;

