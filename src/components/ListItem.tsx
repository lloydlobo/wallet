// // @ts-nocheck
import { createEffect, createSignal, lazy, onCleanup, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { TDatabaseExpense } from "../lib/types-supabase";

type ListItemProps = {
  item: TDatabaseExpense;
}

function parseDate(value: string | number | Date): { year: number; month: number; date: number; } {
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date format');
  }
  const month = d.getMonth();
  const date = d.getDate();
  const year = d.getFullYear();
  return {
    year,
    month,
    date,
  }
}

enum Week {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4, // 2023/5/11 - Thursday - getDay() = 4
  Friday = 5,
  Saturday = 6,
}

function parseWeekNumberToText(weekDay: number) {
  let input = weekDay;
  if (weekDay >= 7) {
    input = weekDay - 7;
  }
  return {
    asString: Week[input],
    asEnum: Object.values(Week)[input] as Week,
  }

}

export function ListItem({ item }: ListItemProps): JSX.Element {
  const [showModal, setShowModal] = createSignal(false);
  const [itemsState, setItemState] = createSignal(item);
  const transaction_date = itemsState().transaction_date;

  // REFACTOR: fmtDate... etc with this parse...
  const dateTransaction = new Date(transaction_date ?? "");
  const { date, month, year } = parseDate(dateTransaction);
  const initialDate = [year, month.toString().padStart(2, '0'), date.toString().padStart(2, '0')].join("-").toString()

  const [fmtDate, setFmtDate] = createSignal(transaction_date ?? "");//Note: dow we need to set individually? or  use a store?
  const dayDate = new Date(fmtDate()).getDate().toString().padStart(2, '0');
  const dayName = parseWeekNumberToText(new Date(fmtDate()).getDay()).asString.slice(0, 3);


  let modalRef: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  /** 
   * Close the modal if the parent overlay is clicked outside of modal form.
   */
  function handleToggleModal(ev: MouseEvent & { currentTarget: HTMLDivElement; target: Element; }): void {
    // ev.preventDefault(); // NOTE: avoids submitting form?
    if (!modalRef) {
      return
    }
    const rect = (modalRef as HTMLDivElement).getBoundingClientRect();
    const mouse = { x: ev.clientX, y: ev.clientY, };
    if (
      mouse.x < rect.left ||
      mouse.x > rect.right ||
      mouse.y < rect.top ||
      mouse.y > rect.bottom
    ) {
      setShowModal(false);
    }
  }
  function handleEscapeKey(this: Document, ev: KeyboardEvent) {
    if (showModal()) {
      if (ev.key === "Escape") {
        setShowModal(false);
      }
    }
  }

  // PERF: Overall, using onMount() and onCleanup() is a recommended approach for adding and removing event listeners in SolidJS, as it promotes better performance and ensures proper cleanup.
  createEffect(() => {
    if (showModal() && modalRef) { document.addEventListener("keydown", handleEscapeKey); }
    onCleanup(() => { document.removeEventListener("keydown", handleEscapeKey); })
  })
  // onMount(() => { document.addEventListener("keydown", handleEscapeKey); })
  // onCleanup(() => { document.removeEventListener("keydown", handleEscapeKey); })

  return (
    <>
      <button onClick={() => setShowModal(!showModal())} class="grid hover:shadow hover:bg-muted transition-colors py-2 rounded-md px-4 grid-cols-4 justify-between w-full items-center">
        <div class="grid grid-cols-2 gap-1">
          <div class="flex gap-0.5">
            <span class="text-xs">{dayName}</span>
            <span class="text-xs">{dayDate}</span>
          </div>
        </div>
        <div class="id">{itemsState().name}</div>
        <div class="text-muted-foreground">{itemsState().description}</div>
        <div class="grid grid-cols-2">
          <div class="id">{itemsState().amount}</div>
          <div class="id">{itemsState().is_cash ? "Cash" : "Other"}</div>
        </div>
      </button>

      <Show when={showModal()}>
        {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div onClick={ev => handleToggleModal(ev)} class="@container absolute z-50 bg-blend-overlay bg-background/50 grid place-content-center inset-0 backdrop-blur-sm">
          <div ref={modalRef} class="bg-card max-w-md place-self-center p-8 shadow border rounded-2xl w-full">
            <form action="">
              <div class="grid gap-4 [&>input]:border-b-muted [&>input]:border-transparent">
                <input type="text" class="form-input" value={item.name} />
                <textarea class="form-textarea border-b-muted border-transparent" value={item.description ?? ""} />
                <input type="date" class="form-input"
                  // style={{ background: "hsl(var(--muted))", "border-color": "transparent" }}
                  value={initialDate} />
                <input type="number" class="form-input" value={item.amount} />
                <div class="flex bg-background border-transparent form-input items-center gap-2">
                  <label for="isCash" class="text-muted-foreground text-sm">Cash: </label>
                  <input id="isCash" type="checkbox" class="form-checkbox" checked={item.is_cash} />
                </div>
                <div class="grid @md:grid-cols-2 place-self-end justify-end gap-2">
                  <button onClick={(ev) => setShowModal(false)} class="text-destructive" type="submit">Cancel</button>
                  <button class="" type="button">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </>
  )
}
