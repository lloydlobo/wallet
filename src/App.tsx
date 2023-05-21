import styles from '@/App.module.css';
import {
  ActivityIcon,
  CrossIcon,
  HamburgerIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from '@/components/icons';
import { ListItem } from '@/components/ListItem';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { assert } from '@/lib/assert';
import { cn } from '@/lib/cn';
import { asHTMLInputDateValue } from '@/lib/date';
import { getDB, insertRowsDB } from '@/lib/db/controllers';
import { Ordering } from '@/lib/enums';
import { useForm } from '@/lib/hooks/create-form';
import { radixSort } from '@/lib/radix-sort';
import { supabase } from '@/lib/supabase-client';
import { TRowExpense, TUpdateExpense } from '@/lib/types-supabase';
import {
  Accessor,
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Setter,
  Show,
} from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { z } from 'zod';
import { ExampleHeaderAuth } from './lib/auth/session';
import { isEqual } from './lib/is-equal';

type TGroupedExpense = [string, TRowExpense[]];

const App: Component = () => {
  const { formStore, updateFormField, submit: handleSubmit, clearField } = useForm();

  const [expenses, setExpenses] = createSignal<TRowExpense[] | null>(null);
  const [groupedState, setGroupedState] = createSignal<TGroupedExpense[] | null>(null); // prettier-ignore

  const [isFormOpen, setIsFormOpen] = createSignal<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = createSignal<boolean>(true);
  const [isItemModalOpen, setIsItemModalOpen] = createSignal<boolean>(false); // Child modal of each list item prop drilled.

  const [userId, setUserId] = createSignal();
  const [user, { mutate, refetch }] = createResource(userId, fetchUser);

  let asideOverlayRef: HTMLDivElement | undefined;

  onMount(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', onKeydownShortcuts);

    if (isSmScreen() && isAsideOpen()) {
      toggleSidebar(); // alert("triggered")
    }

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeydownShortcuts);
    });
  });

  createEffect(() => {
    if (!isItemModalOpen() && isAsideOpen()) {
      asideOverlayRef?.addEventListener('touchstart', toggleSidebar);
      asideOverlayRef?.addEventListener('mousedown', toggleSidebar);
    }

    onCleanup(() => {
      asideOverlayRef?.removeEventListener('touchstart', toggleSidebar);
      asideOverlayRef?.removeEventListener('mousedown', toggleSidebar);
    });
  });

  createEffect(async () => {
    const data = await getDB();
    if (!data) return;
    setExpenses(data);

    const items = expenses();
    if (!items) return;
    const grouped = getGroupedItems(radixSort(items, Ordering.Greater));
    if (!grouped) return;
    setGroupedState(Object.entries(grouped));

    onCleanup(() => {
      setExpenses(null);
      setGroupedState(null);
    });
  });

  const isSmScreen = (): boolean => window.innerWidth <= 720;
  const toggleSidebar = () => setIsAsideOpen((prev) => !prev);
  const onKeydownShortcuts = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      setIsAsideOpen(false);
    } else if (ev.ctrlKey && ev.shiftKey && ev.key === 'E') {
      toggleSidebar(); // setIsAsideOpen(true);
    } else if (ev.ctrlKey && ev.key === 'k') {
      ev.preventDefault(); // Avoid browser focus on address bar.
      alert('Command'); //  TODO: Use cmdk like command-pallete.
    }
  };
  function handleResize(this: Window, _ev: UIEvent) {
    if (isSmScreen() && isAsideOpen()) {
      toggleSidebar(); // alert("if-" + window.innerWidth)
    } else if (!isSmScreen && !isAsideOpen()) {
      toggleSidebar(); // alert("else-if-" + window.innerWidth)
    } else {
      // alert("else-" + window.innerWidth)
    }
  }

  const onSubmit = async (data: TUpdateExpense) => {
    // console.log({ data })
    await insertRowsDB([data]);
  };

  async function handleSubmitForm(
    ev: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) {
    ev.preventDefault();
    await handleSubmit(onSubmit); // NOTE: Logic to handle submiting to server.
    setIsFormOpen(false);
  }

  function handleShowForm(
    ev: MouseEvent & { currentTarget: HTMLInputElement; target: Element }
  ): void {
    ev.preventDefault();
    setIsFormOpen((_prev) => true);
    (document.getElementById('formName') as HTMLElement).focus();
  }

  /**
   * Group the items based on months and years using the reduce() method.
   * @param items - Array of TRowExpense items to be grouped.
   * @returns An object where keys represent month and year combinations, and values are arrays of TRowExpense
   * items for each group.
   */
  function getGroupedItems(
    items: TRowExpense[] | null
  ): { [key: string]: TRowExpense[] } | undefined {
    return items?.reduce((acc: { [key: string]: TRowExpense[] }, item) => {
      const itemDate = new Date(item.transaction_date ?? item.created_at ?? item.updated_at);

      const month = itemDate.toLocaleString('default', { month: 'long' });
      const year = z.coerce.string().parse(itemDate.getFullYear());

      const key = `${month} ${year}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);

      return acc;
    }, {});
  }

  return (
    <div class="flex h-screen max-h-screen flex-col overflow-y-clip ">
      <Header toggleSidebar={toggleSidebar} />
      <div class="relative">
        <Aside isAsideOpen={isAsideOpen()} ref={asideOverlayRef} />
      </div>
      <div class="mx-auto absolute z-20 left-1/2 right-1/2 top-4">
        <Button variant={"ghost"} withClass={"border"} onClick={ev => {
          ev.preventDefault()
        }}>Search</Button>
      </div>


      <dialog class="bg-card/50 backdrop-blur border rounded-xl absolute w-full h-full">
        <form action="" method="dialog">
          <input type="text" onInput={ev => {
            ev.preventDefault();//use debounce here.  
            setUserId(ev.currentTarget.value);
          }} />
        </form>
      </dialog>

      {/* TODO: Style scroll bar from App.module.css */}
      <main
        class={`${styles.workWindow} ${isAsideOpen() ? 'md:ms-[233px]' : ''
          } md:mt-8! flex-1 flex-grow overflow-y-auto bg-muted px-2 pt-6 md:mx-16 md:rounded-t-3xl md:px-6`}
      >
        <Workspace groupedState={groupedState()} setIsItemModalOpen={setIsItemModalOpen} />
      </main>

      <footer
        class={`${isAsideOpen() ? 'md:ms-[233px]' : ''
          } bg-muted px-8 pb-2 md:mx-16 md:mb-6 md:rounded-b-3xl`}
      >
        {/* TODO: Call the setter state function before passing them as props. */}
        <FormCreateExpense
          isFormOpen={isFormOpen}
          handleShowForm={handleShowForm}
          handleSubmitForm={handleSubmitForm}
          formStore={formStore}
          updateFormField={updateFormField}
          setIsFormOpen={setIsFormOpen}
          clearField={clearField}
        />
      </footer>
    </div>
  );
};

export default App;

type CreateNewExpenseProps = {
  isFormOpen: Accessor<boolean>;
  handleShowForm: (ev: MouseEvent & { currentTarget: HTMLInputElement; target: Element }) => void;
  handleSubmitForm: (
    ev: Event & { submitter: HTMLElement } & {
      currentTarget: HTMLFormElement;
      target: Element;
    }
  ) => Promise<void>;
  formStore: Partial<TRowExpense>;
  updateFormField: (fieldName: string) => (ev: Event) => void;
  setIsFormOpen: Setter<boolean>;
  clearField: (fieldName: string) => void;
};

type WorkspaceProps = {
  groupedState: TGroupedExpense[] | null;
  setIsItemModalOpen: Setter<boolean>;
};
function Workspace(props: WorkspaceProps) {
  // Add your additional props here
  type SkeletonSectionProps = JSX.HTMLAttributes<HTMLElement> & {
    withClass?: string;
  };

  const SkeletonSection = (props: SkeletonSectionProps): JSX.Element => (
    <section
      class={cn(
        'justify-center! mx-auto flex items-center space-x-4 rounded-xl bg-card p-6 transition-all',
        props.withClass
      )}
      style={{ 'padding-block': '2rem' }}
      {...props}
    >
      <Skeleton class={'h-12 w-12 rounded-full'} />
      <div class="space-y-2">
        <Skeleton class={'h-4 w-[250px]'} />
        <Skeleton class={'h-4 w-[200px]'} />
      </div>
    </section>
  );

  return (
    <Show
      when={props.groupedState}
      fallback={
        <For each={Array.from({ length: 4 })}>{(_) => <SkeletonSection withClass="mb-2" />}</For>
      }
    >
      {/* TODO:Use zod to validate or use better types. */}
      <For each={props.groupedState as unknown[] as [string, TRowExpense[]]}>
        {(items) => (
          <section class="mx-1 mb-4 h-fit space-y-1 rounded-3xl bg-card p-6">
            <h2 class="tracking-tighter text-muted-foreground">{items[0].toString()}</h2>
            <div class="group_items">
              <Show when={items[1] as unknown as TRowExpense[]}>
                <For each={items[1] as unknown as TRowExpense[]}>
                  {(item: TRowExpense) => (
                    <ListItem item={item} setIsItemModalOpen={props.setIsItemModalOpen} />
                  )}
                </For>
              </Show>
            </div>
          </section>
        )}
      </For>
    </Show>
  );
}

function FormCreateExpense(props: CreateNewExpenseProps) {
  // class="top-full! px-12! sticky bottom-0 left-0 right-0 m-0 mx-0 w-full flex-shrink-0 place-self-end bg-background px-4 py-4 pb-8"
  return (
    <div class="">
      <Show
        when={props.isFormOpen()}
        fallback={
          <div class="mx-auto flex h-fit w-full gap-4 bg-muted py-4">
            <input
              type="text"
              onClick={(ev) => props.handleShowForm(ev)}
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
          onSubmit={(ev) => props.handleSubmitForm(ev)}
          class="mx-auto flex h-fit w-full gap-4 bg-muted"
        >
          <div class="max-w-3xl! w-full gap-2 rounded-[50px] border bg-background px-4 py-2 [&>*>*]:border-transparent [&>*>*]:border-b-muted">
            <div class={styles.formControl}>
              <label for="formName">Name</label>
              <input
                id="formName"
                type="text"
                autofocus={true}
                placeholder="Expense"
                value={props.formStore.name}
                onInput={props.updateFormField('name')} // use onChange for less control on reactivity or more performance.
                required // use:validate={[userNameExists]} value={newTitle()} onInput={(e) => setTitle(e.currentTarget.value)}
              />
              {/*
        {errors.email && <ErrorMessage error={errors.email} />}
        */}
            </div>
            <div class={styles.formControl}>
              <label for="formAmount">Amount</label>
              <input
                // value={props.formStore.amount} // Note: Unitialized value so we don't see a 0
                onInput={props.updateFormField('amount')}
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
                value={props.formStore.transaction_date ?? asHTMLInputDateValue(new Date())}
                onChange={props.updateFormField('transaction_date')}
                type="date"
                placeholder="Amount"
                class="w-fit"
              />
            </div>
            <div class={styles.formControl}>
              <label for="formAmount">Description</label>
              <textarea
                value={props.formStore.description ?? ''}
                onInput={props.updateFormField('description')}
                placeholder="Description"
                class="form-textarea h-12"
              />
            </div>
            <div class={styles.formControl}>
              <label for="isCashCheckboxCreate">Cash</label>
              <input
                checked={props.formStore.is_cash}
                onChange={props.updateFormField('is_cash')}
                type="checkbox"
                id="isCashCheckboxCreate"
              />
            </div>
          </div>
          <div class="grid">
            <button data-create title="Submit form" class="" type="submit">
              <PlusIcon />
            </button>
            <button
              class=""
              data-clear
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                props.setIsFormOpen(false);
                for (const key of Object.keys(props.formStore)) {
                  props.clearField(key);
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
  );
}

type AsideProps = {
  // isAsideOpen: Accessor<boolean>;
  isAsideOpen: boolean;
  ref: HTMLDivElement | undefined;
};
function Aside(props: AsideProps): JSX.Element {
  return (
    <aside
      class={`${styles.aside} transition-transform ${props.isAsideOpen ? `${styles.open} ` : ''}`}
    >
      {/* Sidebar Overlay */}
      <div
        ref={props.ref}
        aria-label="aside-backdrop"
        class={`${props.isAsideOpen
          ? cn(
            `${styles.open} opacity-70 blur-none transition-all duration-150 delay-0  ease-linear`
          )
          : '-translate-x-full opacity-0 blur-2xl transition-all duration-100 delay-0  '
          } ease absolute inset-0 -z-10 h-screen w-screen bg-muted/70 bg-blend-overlay md:hidden`}
      />

      {/* Sidebar Content */}
      <div class="z-10 flex h-full flex-col justify-between bg-background pb-20">
        <div class="mt-2 grid text-lg [&>*]:tracking-wide [&>button]:rounded-e-full">
          <button type="button" class={cn(styles.button)}>
            <ActivityIcon class="hover:animate-icon-spinslide" />
            <div class="settings">Activity</div>
          </button>
          <button type="button" class={styles.button}>
            <SettingsIcon />
            <div class="settings">Settings</div>
          </button>
        </div>

        <div class="border border-transparent border-t-muted-foreground/50 ">
          <button
            class={`${styles.button} my-2 rounded-e-full text-lg  [&_svg]:hover:animate-icon-spinslide `}
            type="button"
          >
            <ThemeToggle />
          </button>
        </div>
      </div>
    </aside>
  );
}

type TLoginCredential = {
  email: string;
  password: string;
};
/** @see https://supabase.com/docs/reference/javascript/auth-signinwithpassword */
async function signInWithEmailServer(credential: TLoginCredential) {
  const email = z.string().parse(credential.email);
  const password = z.string().parse(credential.password);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}
async function signOutServer() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

type HeaderProps = { toggleSidebar: () => boolean };
// TODO: Add modal popup to register or let user login.
// TODO: Create or refactor extract modal dialog from the 2 previos dialogs we created.
function Header(props: HeaderProps): JSX.Element {
  const [isUserAuthorized, setIsUserAuthorized] = createSignal<boolean>(false);
  const [showLoginForm, setShowLoginForm] = createSignal(false);
  const [credentials, setCredentials] = createSignal({
    email: '',
    password: '',
  });

  const toggleUserAuthState = () => setIsUserAuthorized((prev) => !prev);
  const toggleShowLoginForm = () => setShowLoginForm((prev) => !prev);

  async function onLoginClick(
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ): Promise<void> {
    ev.preventDefault();
    toggleShowLoginForm();
  }
  async function onLogoutClick(
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ): Promise<void> {
    ev.preventDefault();

    const { error } = await signOutServer();
    console.log(error);
    if (!error) {
      toggleUserAuthState();
    } else {
      console.error(error);
    }
  }
  // type TSupabaseData={
  //   session:any,
  //   user:any,
  // }

  async function handleLoginForm(
    ev: Event & { submitter: HTMLElement } & { currentTarget: HTMLFormElement; target: Element }
  ): Promise<void> {
    ev.preventDefault();

    // const formData = new FormData(ev.currentTarget);
    // console.log({ formData: formData.values() })

    const credential: TLoginCredential = {
      email: credentials().email,
      password: credentials().password,
    };
    // assert(isEqual(1, 1), new Error("1 is not equal to 1"));

    const { data, error } = await signInWithEmailServer(credential); // Need trycatch?
    console.log(data);
    if (!error) {
      toggleUserAuthState();
      toggleShowLoginForm();
      console.log({ data });
    } else {
      console.error(error);
    }
  }

  return (
    <header
      class={`${styles.header} border! mb-1! sticky! h-24! top-0 z-10 overflow-x-clip px-6 py-4`}
    >
      <ExampleHeaderAuth />
      <div class="flex w-full  items-center  justify-between overflow-x-visible">
        <div class="flex place-content-center items-center justify-center gap-4">
          <button
            type="button"
            // eslint-disable-next-line no-unused-vars
            onClick={_ev => props.toggleSidebar()}
            title="Main Menu\nCtrl-Shift-E"
            class="z-10 grid place-self-center border border-transparent"
          >
            <HamburgerIcon />
          </button>
          <div class="relative flex items-center gap-[6px] leading-none">
            <div class="logo text-xl capitalize leading-none text-foreground/70 ">wallet</div>
            <span class="rounded-sm px-1 py-0.5 text-[11px] font-semibold text-blue-500 opacity-95 outline outline-[2.3px] outline-blue-500/70">
              Beta
            </span>
          </div>
        </div>

        <div class="nav-end flex place-content-center items-center justify-center gap-4">
          <Show when={showLoginForm()}>
            <form onSubmit={(ev) => handleLoginForm(ev)} action="" class="flex items-center gap-2">
              <div class="basis-1/3">
                <label for="formInputEmail" class="text-muted-foreground">
                  Email
                </label>
                <Input
                  id="formInputEmail"
                  value={credentials().email}
                  type="email"
                  autofocus
                  onInput={(ev) =>
                    setCredentials((prev) => ({ ...prev, email: ev.currentTarget.value }))
                  }
                />
              </div>
              <div class="basis-1/3">
                <label for="formInputPassword" class="text-muted-foreground">
                  Password
                </label>
                <Input
                  id="formInputPassword"
                  type="password"
                  value={credentials().password}
                  onInput={(ev) => {
                    setCredentials((prev) => ({ ...prev, password: ev.currentTarget.value }));
                  }}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Show>

          <Show
            when={isUserAuthorized()}
            fallback={
              <Button
                onClick={onLoginClick}
                disabled={showLoginForm()}
                type="button"
                variant={'link'}
              >
                <Tooltip
                  withClass="sr-only translate-x-8 translate-y-2"
                  text="Login"
                  transition={'default'}
                >
                  Login
                </Tooltip>
              </Button>
            }
          >
            <Button
              role="menu"
              asChild
              variant={'link'}
              aria-label="User Menu"
              onClick={onLogoutClick}
              type="button"
              withClass="transition-all duration-100 ease-out [&_svg]:hover:outline"
            >
              <Tooltip
                withClass="translate-x-8 translate-y-2"
                transition={'default'}
                text={(() => {
                  const username = 'User';
                  const useremail = 'user@gmail.com';
                  const authProvider = 'Google Account';
                  return `${authProvider}\n${username}\n${useremail}`;
                })()}
              >
                <label for="logoutIcon" class="sr-only">
                  Logout
                </label>
                <UserIcon
                  id="logoutIcon"
                  class="outline-3 w-fit rounded-full outline-accent-foreground/50 transition-all duration-100 ease-in"
                />
              </Tooltip>
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}

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
