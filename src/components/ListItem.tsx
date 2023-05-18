////\@ts-nocheck
import { cn } from "@/lib/cn";
import {
  createEffect,
  createSignal,
  lazy,
  mergeProps,
  onCleanup,
  onMount,
  Setter,
  Show,
} from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { asDateComponents, asDayOfWeek } from "../lib/date";
import { TDatabaseExpense } from "../lib/types-supabase";
import { CrossIcon } from "./icons";

type ListItemProps = {
  item: TDatabaseExpense;
  setIsItemModalOpen: Setter<boolean>;
};

export function ListItem(props: ListItemProps): JSX.Element {
  const [showModal, setShowModal] = createSignal(false);
  const [itemsState, setItemState] = createSignal(props.item);
  const transaction_date =
    itemsState().transaction_date ?? itemsState().updated_at;

  // REFACTOR: fmtDate... etc with this parse...
  const dateTransaction = new Date(transaction_date ?? "");
  const [fmtDate, setFmtDate] = createSignal(transaction_date ?? ""); //Note: dow we need to set individually? or  use a store?

  const { date, month, year } = asDateComponents(dateTransaction);
  const initialDate = [
    year,
    month.toString().padStart(2, "0"),
    date.toString().padStart(2, "0"),
  ]
    .join("-")
    .toString();

  const dayDate = new Date(fmtDate()).getDate().toString().padStart(2, "0");
  const dayName = asDayOfWeek(new Date(fmtDate())).weekDay.slice(0, 3); // const dayName = asDayOfWeek(new Date(fmtDate()).getDay()).weekDay.slice(0, 3);

  const merged = mergeProps({ ownerName: "John", month: 4 }, props);

  let modalRef: HTMLDivElement | ((el: HTMLDivElement) => void) | undefined;
  let formInputNameRef: HTMLInputElement | undefined;

  createEffect(() => {
    if (showModal() && modalRef) {
      document.addEventListener("keydown", handleEscapeKey);

      if (formInputNameRef) {
        formInputNameRef.focus();
      }
    }
    onCleanup(() => {
      document.removeEventListener("keydown", handleEscapeKey);
    });
  }); // PERF: Overall, using onMount() and onCleanup() is a recommended approach for adding and removing event listeners in SolidJS, as it promotes better performance and ensures proper cleanup.

  /**
   * Close the modal if the parent overlay is clicked outside of modal form.
   */
  function handleToggleModal(
    ev: MouseEvent & { currentTarget: HTMLDivElement; target: Element }
  ): void {
    if (!modalRef) return; // ev.preventDefault(); // NOTE: avoids submitting form?
    const rect = (modalRef as HTMLDivElement).getBoundingClientRect();
    const mouse = { x: ev.clientX, y: ev.clientY };
    const isClickedOutside =
      mouse.x < rect.left ||
      mouse.x > rect.right ||
      mouse.y < rect.top ||
      mouse.y > rect.bottom;
    if (isClickedOutside) {
      props.setIsItemModalOpen(false);
      setShowModal(false);
    }
  }

  function handleEscapeKey(this: Document, ev: KeyboardEvent) {
    if (showModal() && ev.key === "Escape") {
      props.setIsItemModalOpen(false);
      setShowModal(false);
    }
  }

  function handleOpenModal(): void {
    props.setIsItemModalOpen(true);
    setShowModal(!showModal());
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        class={cn(
          "grid w-full grid-cols-4 items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-muted hover:shadow"
        )}
      >
        <div class="grid grid-cols-2 gap-1">
          <div class="flex gap-0.5">
            <span class="text-xs!">{dayName}</span>
            <span class="text-xs!">{dayDate}</span>
          </div>
        </div>
        <div class="text-start">{itemsState().name}</div>
        <div class="text-start text-muted-foreground">
          {itemsState().description ?? ""}
        </div>
        <div class="grid grid-cols-2">
          <div class="text-end">{itemsState().amount}</div>
          <div class="id">{itemsState().is_cash ? "Cash" : "Other"}</div>
        </div>
      </button>

      <Show when={showModal()}>
        {/* TODO: rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={(ev) => handleToggleModal(ev)}
          class="absolute inset-0 z-50 grid place-content-center bg-background/50 bg-blend-overlay backdrop-blur-sm @container"
        >
          <div
            id="modalRef"
            ref={modalRef}
            class="w-full max-w-md place-self-center rounded-2xl border bg-card p-8 shadow"
          >
            <form action="">
              <div class="relative grid gap-4 p-2 [&>input]:border-transparent [&>input]:border-b-muted">
                <button
                  onClick={(ev) => setShowModal(false)}
                  class="absolute -right-5 -top-5 text-muted-foreground"
                  type="submit"
                >
                  <div class="scale-75">
                    <CrossIcon />
                  </div>
                </button>
                <input
                  ref={formInputNameRef}
                  type="text"
                  class="form-input"
                  value={merged.item.name}
                />
                <textarea
                  class="form-textarea border-transparent border-b-muted"
                  value={props.item.description ?? ""}
                />
                <input
                  type="date"
                  class="form-input"
                  // style={{ background: "hsl(var(--muted))", "border-color": "transparent" }}
                  value={initialDate}
                />
                <input
                  type="number"
                  class="form-input"
                  value={props.item.amount}
                />
                <div class="form-input flex items-center gap-2 border-transparent bg-background">
                  <label for="isCash" class="text-sm text-muted-foreground">
                    Cash:{" "}
                  </label>
                  <input
                    id="isCash"
                    type="checkbox"
                    class="form-checkbox"
                    checked={props.item.is_cash}
                  />
                </div>
                <div class="flex w-full justify-between px-2">
                  <div class="shell"></div>
                  <div class="flex gap-4">
                    <button
                      onClick={(ev) => setShowModal(false)}
                      class="text-destructive"
                      type="submit"
                    >
                      Delete
                    </button>
                    <button class="" type="button">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </>
  );
}
