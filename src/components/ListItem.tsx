////\@ts-nocheck
import { createEffect, createSignal, lazy, mergeProps, onCleanup, onMount, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { asDateComponents, asDayOfWeek } from "../lib/date";
import { TDatabaseExpense } from "../lib/types-supabase";

type ListItemProps = {
  item: TDatabaseExpense;
}

export function ListItem(props: ListItemProps): JSX.Element {
  const [showModal, setShowModal] = createSignal(false);
  const [itemsState, setItemState] = createSignal(props.item);
  const transaction_date = itemsState().transaction_date ?? itemsState().updated_at;

  // REFACTOR: fmtDate... etc with this parse...
  const dateTransaction = new Date(transaction_date ?? "");
  const { date, month, year } = asDateComponents(dateTransaction);
  const initialDate = [year, month.toString().padStart(2, '0'), date.toString().padStart(2, '0')].join("-").toString()

  const [fmtDate, setFmtDate] = createSignal(transaction_date ?? "");//Note: dow we need to set individually? or  use a store?
  const dayDate = new Date(fmtDate()).getDate().toString().padStart(2, '0');
  const dayName = asDayOfWeek(new Date(fmtDate()).getDay()).weekDay.slice(0, 3);

  const merged = mergeProps({ ownerName: "John", month: 4 }, props);

  let modalRef: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;

  /** 
   * Close the modal if the parent overlay is clicked outside of modal form.
   */
  function handleToggleModal(ev: MouseEvent & { currentTarget: HTMLDivElement; target: Element; }): void {
    if (!modalRef) {
      return
    } // ev.preventDefault(); // NOTE: avoids submitting form?

    const rect = (modalRef as HTMLDivElement).getBoundingClientRect();
    const mouse = { x: ev.clientX, y: ev.clientY, };
    const isClickedOutside = mouse.x < rect.left ||
      mouse.x > rect.right ||
      mouse.y < rect.top ||
      mouse.y > rect.bottom;

    if (isClickedOutside) {
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

  createEffect(() => {
    if (showModal() && modalRef) { document.addEventListener("keydown", handleEscapeKey); }
    onCleanup(() => { document.removeEventListener("keydown", handleEscapeKey); })
  }) // PERF: Overall, using onMount() and onCleanup() is a recommended approach for adding and removing event listeners in SolidJS, as it promotes better performance and ensures proper cleanup.
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
                <input type="text" class="form-input" value={merged.item.name} />
                <textarea class="form-textarea border-b-muted border-transparent" value={props.item.description ?? ""} />
                <input type="date" class="form-input"
                  // style={{ background: "hsl(var(--muted))", "border-color": "transparent" }}
                  value={initialDate} />
                <input type="number" class="form-input" value={props.item.amount} />
                <div class="flex bg-background border-transparent form-input items-center gap-2">
                  <label for="isCash" class="text-muted-foreground text-sm">Cash: </label>
                  <input id="isCash" type="checkbox" class="form-checkbox" checked={props.item.is_cash} />
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
