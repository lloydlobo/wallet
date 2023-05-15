import {
  batch,
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  JSXElement,
  lazy,
  Show,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore, SetStoreFunction, Store } from "solid-js/store";
import styles from "./App.module.css";
import { PlusIcon } from "./components/icons";
import { ListItem } from "./components/ListItem";
import { ThemeToggle } from "./components/ThemeToggle";
import { Ordering } from "./lib/enums";
import { radixSort } from "./lib/radix-sort";
import {
  createLocalStore,
  createLocalStoreTodos,
  removeIndex,
} from "./lib/store";
import { supabase } from "./lib/supabase-client";
import { Database, TDatabaseExpense } from "./lib/types-supabase";
import { useForm } from "./lib/hooks/use-form";

const DB_NAME_EXPENSES = "expenses";

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

const ErrorMessage = (props: {
  error:
  | number
  | boolean
  | Node
  | JSX.ArrayElement
  | JSX.FunctionElement
  | (string & {})
  | null
  | undefined;
}) => <span class="error-message">{props.error}</span>;

// Note: Effects are meant primarily for side effects that read but don't write to the reactive system:
// it's best to avoid setting signals in effects, which without care can cause additional rendering
// or even infinite effect loops. Instead, prefer using createMemo to compute new values that depend
// on other reactive values, so the reactive system knows what depends on what, and can optimize accordingly
const App: Component = () => {
  // TODO: Create `createLocalStore<TDatabaseExpenses[]>(...)`
  const { formStore, updateFormField, submit, clearField } = useForm();
  const [expenses, setExpenses] = createSignal<TDatabaseExpense[] | null>(null);
  const [groupedState, setGroupedState] = createSignal<unknown | null>(null);
  const [isFormOpen, setIsFormOpen] = createSignal(false);

  const handleSubmitForm = (
    ev: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ): void => {
    ev.preventDefault();
    submit(formStore);
    setIsFormOpen(false);
  };

  // createEffect(() => { if (formStore.sameAsAddress) { clearField("shippingAddress") } })

  const [todos, setTodos] = createLocalStoreTodos<TodoItem[]>("todos", []);

  // const [currentExpense, setCurrentExpense] = createSignal<TDatabaseExpense>({} as TDatabaseExpense);
  // const { validate, formSubmit, errors } = useForm({ errorClass: "error-input" });
  // const [fields, setFields] = createStore();
  // const [userId, setUserId] = createSignal();
  // const [user] = createResource(userId, fetchUser);

  let entries;
  createEffect(async () => {
    const data = await getDB();
    if (!data) return;
    setExpenses(data);
    const items = expenses();
    if (!items) return;
    const grouped = groupedItems(radixSort(items, Ordering.Greater));
    if (!grouped) return;
    entries = Object.entries(grouped);
    setGroupedState(entries);
  });


  /**
   * Group the items based on months and years using the reduce() method.
   * @param items - Array of TDatabaseExpense items to be grouped.
   * @returns An object where keys represent month and year combinations, and values are arrays of TDatabaseExpense
   * items for each group.
   */
  const groupedItems = (items: TDatabaseExpense[] | null) => {
    if (items) {
      return items.reduce(
        (acc: { [key: string]: TDatabaseExpense[] }, item) => {
          const month = new Date(item.transaction_date ?? "").toLocaleString(
            "default",
            { month: "long" }
          );
          const year = new Date(item.transaction_date ?? "")
            .getFullYear()
            .toString();
          const key = `${month} ${year}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        },
        {}
      );
    }
  };


  function handleShowFormSubmit(
    ev: MouseEvent & { currentTarget: HTMLInputElement; target: Element }
  ): void {
    ev.preventDefault();
    setIsFormOpen((prev) => true);
    (document.getElementById("formName") as HTMLElement).focus();
  }

  return (
    <div class="@container h-screen">
      <div class="container border! h-full flex flex-col justify-between max-w-lg @md:max-w-3xl space-y-0 mx-auto py-8!">
        <header class="py-6">
          <div class="flex justify-between">
            <div class="logo">wallet</div>
            <div class="nav-end grid gap-4 grid-flow-col">
              <a class={styles.link} href="/">
                Refresh
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div class={styles.list_window}>
          <div class="debug hidden">
            <Show when={formStore}>
              <div class="max-w-xl overflow-x-auto w-fit">
                <pre>
                  {JSON.stringify(formStore, null, 2)}
                </pre>
              </div>
            </Show>
          </div>
          <Show when={groupedState()}>
            <For
              each={groupedState() as unknown[] as [string, TDatabaseExpense[]]}
            >
              {(items) => (
                <section class="bg-card rounded-xl border! p-4! space-y-1">
                  <h2 class="text-sm tracking-tighter text-muted-foreground">
                    {items[0] as string}
                  </h2>
                  <div class="group_items">
                    <Show when={items[1] as unknown as TDatabaseExpense[]}>
                      <For each={items[1] as unknown as TDatabaseExpense[]}>
                        {(item) => <ListItem item={item} />}
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
                      onChange={(e) =>
                        setTodos(i(), "done", e.currentTarget.checked)
                      }
                      data-tooltip={`Consolidate ${todo.title}`}
                      data-placement="right"
                      class="form-checkbox  bg-background rounded"
                    />
                    <input
                      type="text"
                      value={todo.title}
                      onChange={(e) =>
                        setTodos(i(), "title", e.currentTarget.value)
                      }
                      class="form-input bg-background w-full "
                    />
                    <button
                      class=""
                      onClick={() => setTodos((t) => removeIndex(t, i()))}
                      data-tooltip={`Delete ${todo.title}`}
                    >
                      x
                    </button>
                  </div>
                )}
              </For>
            </div>
          </section>

          {/*
            <input type="number" min="1" placeholder="Enter Numeric Id" onInput={(e) => setUserId(e.currentTarget.value)} />
            <span>{user.loading && "Loading..."}</span>
            <div> <pre>{JSON.stringify(user(), null, 2)}</pre> </div>
          */}
        </div>

        <div class="place-self-end flex-shrink-0 top-full m-0 sticky bottom-0 bg-slate-100 dark:bg-slate-900 pb-8 py-4 mx-0 px-12! px-4 left-0 right-0 w-full">
          <Show
            when={isFormOpen()}
            fallback={
              <div class="flex h-fit w-full gap-4 mx-auto">
                <input
                  onClick={(ev) => handleShowFormSubmit(ev)}
                  type="text"
                  placeholder="Add new expense&#x2026;"
                  class="border shadow-2xl py-4 px-4 rounded-[50px] w-full bg-background"
                />
                <button class="" type="submit">
                  <PlusIcon />
                </button>
              </div>
            }
          >
            <form
              onSubmit={(ev) => handleSubmitForm(ev)}
              class="flex h-fit w-full gap-4 mx-auto"
            >
              <div class="border shadow-2xl py-2 px-4 [&>*>*]:border-transparent gap-2 [&>*>*]:border-b-muted rounded-[50px] w-full bg-background max-w-3xl!">
                <div class={styles.formControl}>
                  <label for="formName">Name</label>
                  <input
                    id="formName"
                    type="text"
                    autofocus={true}
                    placeholder="Expense"
                    value={formStore.name}
                    onInput={updateFormField("name")} // use onChange for less control on reactivity or more performance.
                    required // use:validate={[userNameExists]} value={newTitle()} onInput={(e) => setTitle(e.currentTarget.value)}
                  />
                  {/*
                {errors.email && <ErrorMessage error={errors.email} />}
                */}
                </div>
                <div class={styles.formControl}>
                  <label for="formAmount">Amount</label>
                  <input
                    value={formStore.amount}
                    onInput={updateFormField("amount")}
                    id="formAmount"
                    type="number"
                    placeholder="Amount"
                    class="form-input"
                  />
                </div>
                {/*
                {errors.confirmPassword && <ErrorMessage error={errors.confirmPassword} />}
                */}
                <div class={styles.formControl}>
                  <label for="formAmount">Transaction Date</label>
                  <input
                    value={formStore.transaction_date ?? ""}
                    onChange={updateFormField("transaction_date")}
                    type="date" placeholder="Amount" class="w-fit" />
                </div>
                <div class={styles.formControl}>
                  <label for="formAmount">Description</label>
                  <textarea
                    value={formStore.description ?? ""}
                    onInput={updateFormField("description")}
                    placeholder="Description"
                    class="form-textarea h-12"
                  />
                </div>
                <div class={styles.formControl}>
                  <label for="isCashCheckbox">Cash</label>
                  <input
                    checked={formStore.is_cash}
                    onChange={updateFormField("is_cash")}
                    type="checkbox"
                    id="isCashCheckbox"
                  // class="form-checkbox dark:invert dark:bg-background rounded"
                  />
                </div>
              </div>
              <div class="grid">
                <button title="Submit form" class="" type="submit">
                  <PlusIcon />
                </button>
                <button
                  class=""
                  type="button"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setIsFormOpen(false);
                    for (const key of Object.keys(formStore)) {
                      clearField(key);
                    } // [ "amount", "created_at", "description", "is_cash", "name", "transaction_date", "updated_at" ]
                  }}
                >
                  <div title="Reset form" class="rotate-[45deg]">
                    <PlusIcon />
                  </div>
                </button>
              </div>
            </form>
          </Show>
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
      <div>
        <h2 class="text-xl font-bold">Lorem</h2>
        <p>
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
          cillum sint consectetur cupidatat.
        </p>
        <button type="button">Read more</button>
      </div>
    </div>
  );
}

function Cards(): JSX.Element {
  return (
    <section class="m-8 @container grid grid-cols-2 w-full mx-auto max-w-4xl gap-12 ">
      <Card />
      <Card />
      <Card />
    </section>
  );
}

const EMAILS = ["johnsmith@outlook.com", "mary@gmail.com", "djacobs@move.org"];

function fetchUserName(name: string): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(EMAILS.indexOf(name) > -1), 200);
  });
}
