import { Component, createEffect, createSignal, batch, For, Show, JSXElement } from 'solid-js';
import { ListItem } from './components/ListItem';
import { supabase } from './lib/supabase-client';
import type { Expense } from './lib/types';
const DB_NAME_EXPENSES = 'expenses';
import { createLocalStore, removeIndex } from "./lib/store";
import styles from './App.module.css';
import logo from './logo.svg'
import { JSX } from "solid-js/jsx-runtime";
import { ThemeToggle } from './components/ThemeToggle';

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
    <div class="@container h-screen">
      <div class="container max-w-lg @md:max-w-3xl space-y-8 mx-auto py-8!">
        <header>
          <div class="flex justify-between">
            <div class="logo">wallet</div>
            <div class="nav-end grid gap-4 grid-flow-col">
              <a class={styles.link} href="/" >Refresh</a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div
          // TODO: Style the overflowing vertical scroll bar.
          style={{
            "--tw-scrollbar-width": "10px",
            "--tw-scrollbar-color": "black",
            "--tw-scrollbar-track-color": "white",
            "--tw-scrollbar-thumb-color": "black",
          }}
          class=" grid max-h-[88vh] mx-0 min-h-[88vh] overflow-y-auto space-y-6 rounded-3xl bg-slate-100 dark:bg-slate-900">
          <section class="bg-background m-4 p-8  rounded-3xl">
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

          <section class="bg-background m-4 p-8 scroll-m-8 rounded-3xl">
            {/* figure acts as a container to make any content scrollable horizontally. */}
            <Show when={expenses() !== null}>
              <div>
                <For each={expenses()}>
                  {item => <ListItem item={item} />}
                </For>
              </div>
            </Show>
          </section>


          <section class="place-self-end m-0 sticky bottom-0 bg-slate-100 dark:bg-slate-900 rounded-none pb-8  py-4 mx-0 px-12 left-0 right-0 w-full">
            <form onSubmit={addTodo} class="flex h-fit w-full gap-4 mx-auto">
              <input
                placeholder="enter todo and click +"
                required
                value={newTitle()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                class="border p-4 rounded-[50px] bg-background w-full max-w-xl"
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
