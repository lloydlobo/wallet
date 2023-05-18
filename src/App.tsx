import styles from "@/App.module.css";
import {
  ActivityIcon,
  CrossIcon,
  HamburgerIcon,
  PlusIcon,
  SettingsIcon,
} from "@/components/icons";
import { ListItem } from "@/components/ListItem";
import { ThemeToggle } from "@/components/ThemeToggle";
import { asHTMLInputDateValue } from "@/lib/date";
import { getDB } from "@/lib/db/controllers";
import { Ordering } from "@/lib/enums";
import { useForm } from "@/lib/hooks/use-form";
import { radixSort } from "@/lib/radix-sort";
import { TDatabaseExpense } from "@/lib/types-supabase";
import {
  Component,
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Skeleton } from "./components/ui/skeleton";

type TGroupedExpense = [string, TDatabaseExpense[]];

async function fetchUser(id: unknown) {
  return (await fetch(`https://swapi.dev/api/people/${id}/`)).json();
} // fetcher: ResourceFetcher<true, unknown, unknown>, options: InitializedResourceOptions<unknown, true>

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

/**
 * Group the items based on months and years using the reduce() method.
 * @param items - Array of TDatabaseExpense items to be grouped.
 * @returns An object where keys represent month and year combinations, and values are arrays of TDatabaseExpense
 * items for each group.
 */
function groupedItems(items: TDatabaseExpense[] | null) {
  if (items) {
    return items.reduce((acc: { [key: string]: TDatabaseExpense[] }, item) => {
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
    }, {});
  }
}

const App: Component = () => {
  const { formStore, updateFormField, submit, clearField } = useForm();

  const [expenses, setExpenses] = createSignal<TDatabaseExpense[] | null>(null);
  const [groupedState, setGroupedState] = createSignal<
    TGroupedExpense[] | null
  >(null);

  const [isFormOpen, setIsFormOpen] = createSignal<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = createSignal<boolean>(true);
  const [isItemModalOpen, setIsItemModalOpen] = createSignal(false);

  const breakpointSM = 640; // tailwind sm:640px.

  let asideRef: HTMLDivElement | undefined;
  let asideOverlayRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (
      !isItemModalOpen() &&
      isAsideOpen() &&
      asideRef instanceof HTMLElement
    ) {
      document.addEventListener("keydown", closeAsideOnEscape);
      if (asideOverlayRef) {
        asideOverlayRef.addEventListener(
          "touchstart",
          closeAsideOnOverlayInteraction
        );
        asideOverlayRef.addEventListener(
          "mousedown",
          closeAsideOnOverlayInteraction
        );
      }
    }

    onCleanup(() => {
      document.removeEventListener("keydown", closeAsideOnEscape);
      if (asideOverlayRef) {
        asideOverlayRef.removeEventListener(
          "touchstart",
          closeAsideOnOverlayInteraction
        );
        asideOverlayRef.removeEventListener(
          "mousedown",
          closeAsideOnOverlayInteraction
        );
      }
    });
  });

  createEffect(async () => {
    const data = await getDB();
    if (!data) return;
    setExpenses(data);
    const items = expenses();
    if (!items) return;
    const grouped = groupedItems(radixSort(items, Ordering.Greater));
    if (!grouped) return;
    setGroupedState(Object.entries(grouped));
  });

  const isSmScreen = (): boolean => !(window.innerWidth >= breakpointSM);
  onMount(() => {
    if (isSmScreen() && isAsideOpen()) {
      toggleSidebar();
    }
    window.addEventListener("resize", handleResize);
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  const toggleSidebar = () => setIsAsideOpen((prev) => !prev);
  const closeAsideOnOverlayInteraction = () => setIsAsideOpen(false);
  const handleOpenAsideMenu = () => setIsAsideOpen(!isAsideOpen());
  const closeAsideOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsAsideOpen(false);
    }
  };
  function handleResize(this: Window, ev: UIEvent) {
    if (isSmScreen() && isAsideOpen()) {
      toggleSidebar();
    } else if (!isSmScreen && !isAsideOpen()) {
      toggleSidebar();
    }
  }

  async function handleSubmitForm(
    ev: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) {
    ev.preventDefault();
    await submit(formStore);
    setIsFormOpen(false);
  }

  function handleShowForm(
    ev: MouseEvent & { currentTarget: HTMLInputElement; target: Element }
  ): void {
    ev.preventDefault();
    setIsFormOpen((_prev) => true);
    (document.getElementById("formName") as HTMLElement).focus();
  }

  return (
    <div class={`h-screen @container ${styles.app} ${styles.open}`}>
      <header class={`${styles.header} border! z-10 mb-1! px-8 py-4`}>
        <div class="flex w-full items-center justify-between">
          <div class="flex place-content-center items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleOpenAsideMenu}
              title="Main Menu"
              class="z-10 grid place-self-center border border-transparent"
            >
              <HamburgerIcon />
            </button>
            <div class="relative flex items-center gap-[6px] leading-none">
              <div class="logo text-xl capitalize leading-none text-foreground/70 ">
                wallet
              </div>
              <span class="rounded-sm px-1 py-0.5 text-[11px] font-semibold text-blue-500 opacity-95 outline outline-[2.3px] outline-blue-500/70">
                Beta
              </span>
            </div>
          </div>

          <div class="nav-end grid grid-flow-col items-center gap-4">
            <button class="text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24 + 12}
                height={24 + 12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-user-circle-2"
                data-darkreader-inline-stroke=""
                style="--darkreader-inline-stroke:currentColor;"
              >
                <path d="M18 20a6 6 0 0 0-12 0"></path>
                <circle cx="12" cy="10" r="4"></circle>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* <Show when={isAsideOpen()}> */}
      <div class="relative">
        <aside
          class={`${styles.aside} transition-transform ${isAsideOpen() ? styles.open + "" : ""
            }`}
        >
          {/* Sidebar Overlay */}
          <div
            ref={asideOverlayRef}
            aria-label="aside-backdrop"
            class={`${isAsideOpen()
              ? styles.open + "delay-0 blur-none duration-150 ease-linear opacity-70  transition-all"
              : "-translate-x-full delay-0 blur-2xl transition-all opacity-0 duration-100  "
              } absolute inset-0 -z-10 h-screen w-screen bg-muted/70 bg-blend-overlay ease md:hidden`}
          />

          {/* Sidebar Content */}
          <div
            ref={asideRef}
            class="z-10 flex h-full flex-col justify-between bg-background pb-20"
          >
            <div class="mt-2 grid text-lg [&>*]:tracking-wide [&>button]:rounded-e-full">
              <button class={styles.button}>
                <ActivityIcon />
                <div class="settings">Activity</div>
              </button>
              <button class={styles.button}>
                <SettingsIcon />
                <div class="settings">Settings</div>
              </button>
            </div>

            <div class="border border-transparent border-t-muted-foreground/50 ">
              <button class={`${styles.button} my-2 rounded-e-full  text-lg `}>
                <ThemeToggle />
              </button>
            </div>
          </div>
        </aside>

        {/* 
      </Show>
      */}

        {/* PERF: Use margin inline start to position main content wrt aside, for smooth transitions */}
        <main
          class={`${styles.main} ${isAsideOpen() ? styles.open + " @md:max-w-4xl" : "@md:max-w-[62rem]"
            } container flex h-full flex-col justify-between space-y-0 px-8 3xl:w-full bg-muted`}
        >
          <div class={styles.list_window}>
            <Show when={formStore}>
              <pre class="debug hidden">
                {JSON.stringify(formStore, null, 2)}
              </pre>
            </Show>

            <Show
              when={groupedState()}
              fallback={
                <For each={Array.from({ length: 4 })}>
                  {(_) => (
                    <section
                      class="justify-center! mx-auto flex items-center space-x-4 rounded-xl bg-card transition-all"
                      style={{ "padding-block": "2rem" }}
                    >
                      <Skeleton class={"h-12 w-12 rounded-full"} />
                      <div class="space-y-2">
                        <Skeleton class={"h-4 w-[250px]"} />
                        <Skeleton class={"h-4 w-[200px]"} />
                      </div>
                    </section>
                  )}
                </For>
              }
            >
              <For
                each={
                  groupedState() as unknown[] as [string, TDatabaseExpense[]]
                }
              >
                {(items) => (
                  <section class="border! p-4! space-y-1 rounded-xl bg-card">
                    <h2 class="text-sm! tracking-tighter text-muted-foreground">
                      {items[0] as string}
                    </h2>
                    <div class="group_items">
                      <Show when={items[1] as unknown as TDatabaseExpense[]}>
                        <For each={items[1] as unknown as TDatabaseExpense[]}>
                          {(item) => (
                            <ListItem
                              item={item}
                              setIsItemModalOpen={setIsItemModalOpen}
                            />
                          )}
                        </For>
                      </Show>
                    </div>
                  </section>
                )}
              </For>
            </Show>

            {/*
            <input type="number" min="1" placeholder="Enter Numeric Id" onInput={(e) => setUserId(e.currentTarget.value)} />
            <span>{user.loading && "Loading..."}</span>
            <div> <pre>{JSON.stringify(user(), null, 2)}</pre> </div>
          */}
          </div>

          <div
          // class="top-full! px-12! sticky bottom-0 left-0 right-0 m-0 mx-0 w-full flex-shrink-0 place-self-end bg-background px-4 py-4 pb-8"
          >
            <Show
              when={isFormOpen()}
              fallback={
                <div class="mx-auto flex h-fit w-full bg-muted  pt-4 gap-4">
                  <input
                    type="text"
                    onClick={(ev) => handleShowForm(ev)}
                    placeholder="Add new expense&#x2026;"
                    class="w-full rounded-[50px] border bg-background px-4 py-4"
                  />
                  <button type="submit">
                    <PlusIcon />
                  </button>
                </div>
              }
            >
              <form
                onSubmit={(ev) => handleSubmitForm(ev)}
                class="mx-auto bg-muted flex h-fit w-full gap-4"
              >
                <div class="max-w-3xl! w-full gap-2 rounded-[50px] border bg-background px-4 py-2 [&>*>*]:border-transparent [&>*>*]:border-b-muted">
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
                      // value={formStore.amount}
                      onInput={updateFormField("amount")}
                      id="formAmount"
                      type="number"
                      placeholder="Amount"
                      class="form-input"
                      required
                    />
                  </div>
                  {/*
                {errors.confirmPassword && <ErrorMessage error={errors.confirmPassword} />}
                */}
                  <div class={styles.formControl}>
                    <label for="formAmount">Transaction Date</label>

                    <input
                      value={
                        formStore.transaction_date ??
                        asHTMLInputDateValue(new Date())
                      }
                      onChange={updateFormField("transaction_date")}
                      type="date"
                      placeholder="Amount"
                      class="w-fit"
                    />
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
                    <div title="Reset form" class="">
                      <CrossIcon />
                    </div>
                  </button>
                </div>
              </form>
            </Show>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

// function Card(): JSX.Element {
//   return (
//     <div class="w-full min-h-[40%] items-center gap-2 m-6 bg-slate-100 rounded-xl p-6 @xl:flex">
//       <div class="bg-slate-300 @xl:w-1/4 @xl:h-full aspect-video mb-4 w-full object-cover" />
//       {/*<img src={logo} alt="solid" class="@xl:w-1/4" />*/}
//       <div>
//         <h2 class="text-xl font-bold">Lorem</h2>
//         <p>
//           Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
//           cillum sint consectetur cupidatat.
//         </p>
//         <button type="button">Read more</button>
//       </div>
//     </div>
//   );
// }
//
// function Cards(): JSX.Element {
//   return (
//     <section class="m-8 @container grid grid-cols-2 w-full mx-auto max-w-4xl gap-12 ">
//       <Card />
//       <Card />
//       <Card />
//     </section>
//   );
// }

// const EMAILS = ["johnsmith@outlook.com", "mary@gmail.com", "djacobs@move.org"];
//
// function fetchUserName(name: string): Promise<unknown> {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(EMAILS.indexOf(name) > -1), 200);
//   });
// }

// <section class="hidden">
//   <div class="grid gap-2">
//     <For each={todos}>
//       {(todo, i) => (
//         <div class="flex gap-4 w-full mx-auto items-center">
//           <input
//             type="checkbox"
//             checked={todo.done}
//             onChange={(e) =>
//               setTodos(i(), "done", e.currentTarget.checked)
//             }
//             data-tooltip={`Consolidate ${todo.title}`}
//             data-placement="right"
//             class="form-checkbox  bg-background rounded"
//           />
//           <input
//             type="text"
//             value={todo.title}
//             onChange={(e) =>
//               setTodos(i(), "title", e.currentTarget.value)
//             }
//             class="form-input bg-background w-full "
//           />
//           <button
//             class=""
//             onClick={() => setTodos((t) => removeIndex(t, i()))}
//             data-tooltip={`Delete ${todo.title}`}
//           >
//             x
//           </button>
//         </div>
//       )}
//     </For>
//   </div>
// </section>
