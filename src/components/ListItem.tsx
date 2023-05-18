////\@ts-nocheck
import { CrossIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { stylesInput, Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { asDateComponents, asDayOfWeek } from "@/lib/date";
import { TDatabaseExpense } from "@/lib/types-supabase";
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

type ListItemProps = {
  item: TDatabaseExpense;
  setIsItemModalOpen: Setter<boolean>;
};

export function ListItem(props: ListItemProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
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
  let formTextareaRef: HTMLTextAreaElement | undefined;
  let openItemDialogBtnRef;
  let closeItemDialogBtnRef;
  let itemDialogRef: HTMLDialogElement | undefined;
  let itemDialogOutputRef: HTMLOutputElement | undefined;
  let confirmItemDialogBtnRef: HTMLButtonElement | undefined;

  createEffect(() => {
    itemDialogRef?.addEventListener("close", onCloseDialogEvent());

    formTextareaRef?.addEventListener("input", (ev) => {
      console.log(ev);
    });
    formInputNameRef?.addEventListener("input", (ev) => {
      console.log(ev);
    });
    // if (showModal() && modalRef) {
    //   document.addEventListener("keydown", handleEscapeKey);
    //   formInputNameRef?.focus();
    // }

    onCleanup(() => {
      itemDialogRef?.removeEventListener("close", onCloseDialogEvent());

      // document.removeEventListener("keydown", handleEscapeKey);
    });
  });

  function onCloseDialogEvent(): (this: HTMLDialogElement, ev: Event) => any {
    return (_ev: Event) => {
      if (itemDialogOutputRef) {
        itemDialogOutputRef.value =
          itemDialogRef?.returnValue === "default"
            ? "No return value"
            : `ReturnValue:${itemDialogRef?.returnValue}.`;
      }
      props.setIsItemModalOpen(false);
    };
  }

  // const closeDialog = ( ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
  //   props.setIsItemModalOpen(false); return setIsDialogOpen(false);
  // };

  const openDialog = (
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => {
    ev.preventDefault();
    // `show()` <- Displays the dialog element. vs `showModal()` Displays the dialog as modal -> itemDialogRef?.showModal();
    itemDialogRef?.show();
    // itemDialogRef?.showModal();
    props.setIsItemModalOpen(true); // Tell parent that our dialog is open, used to signal that `Escape` key doesn't close <aside> when <dialog> is open.
    return setIsDialogOpen(true);
  };

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

  // function handleEscapeKey(this: Document, ev: KeyboardEvent) {
  //   if (showModal() && ev.key === "Escape") {
  //     props.setIsItemModalOpen(false);
  //     setShowModal(false);
  //   }
  // }

  function handleConfirmBtn(
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ): void {
    ev.preventDefault();
    itemDialogRef?.close("TODO: add `selectEl.value`"); // Send the input value to dialog -> output.
    props.setIsItemModalOpen(false);
  }

  // function handleOpenModal(): void { props.setIsItemModalOpen(true); // setShowModal(!showModal()); }

  return (
    <>
      <button
        // onClick={handleOpenModal}
        onClick={(ev) => openDialog(ev)}
        id="showDialog"
        ref={openItemDialogBtnRef}
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

      <dialog
        id="openItemDialog"
        ref={itemDialogRef}
        draggable={true}
        // Opening dialogs via HTMLDialogElement.show() is preferred over the toggling of the boolean open attribute.
        // open={isDialogOpen()} // Because this dialog was opened via the open attribute, it is non-modal.
        // Note: Remove inset-0 to let dialog open under the selected item that toggles it.
        class="inset-0 z-50 aspect-video w-full max-w-md overflow-x-clip rounded-2xl border border bg-card text-foreground"
      >
        <form method="dialog" action="" class="">
          <div class="flex flex-col space-y-2">
            <div class="flex w-full justify-between py-3">
              <h2
                data-title
                class="font-semibold text-muted-foreground"
                title={props.item.name}
              >
                Edit
              </h2>
              <button
                ref={closeItemDialogBtnRef}
                id="closeItemDialogBtn"
                value="cancel"
                formmethod="dialog"
                class="place-self-end text-muted-foreground"
              >
                <div class="scale-[61%]">
                  <CrossIcon />
                </div>
              </button>
            </div>
            <hr class="relative w-full scale-x-110" />

            <div
              data-body
              class="relative grid gap-4 [&>input]:border-transparent [&>input]:border-b-muted"
            >
              <Input
                ref={formInputNameRef}
                type="text"
                autofocus={true}
                value={merged.item.name}
              />
              <Input
                type="number"
                value={props.item.amount}
                className="font-mono"
              />
              <Textarea
                value={props.item.description ?? ""}
                ref={formTextareaRef}
                // class="form-textarea  border-transparent border-b-muted"
              />
              <Input
                type="date"
                // style={{ background: "hsl(var(--muted))", "border-color": "transparent" }}
                class={cn("form-input", stylesInput, "block")} // Hack: Bypass default flex with block to place datepicker at end.
                value={initialDate}
              />
              <div class="form-input flex items-start justify-between gap-2 border-transparent bg-background">
                <label for="isCash" class="grid gap-1">
                  <span>Cash</span>
                  <span class="relative text-xs text-muted-foreground/70">
                    Transaction done with cash or credit.
                  </span>
                </label>
                <Input
                  id="isCash"
                  type="checkbox"
                  className="form-checkbox"
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

                  <button
                    id="confirmBtn"
                    onClick={(ev) => handleConfirmBtn(ev)}
                    ref={confirmItemDialogBtnRef}
                    value="default"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </dialog>
      {/*
      <Dialog itemDialogRef={itemDialogRef} closeItemDialogBtnRef={closeItemDialogBtnRef} props={props} handleConfirmBtn={handleConfirmBtn} confirmItemDialogBtnRef={confirmItemDialogBtnRef}
      />
      */}
      <output data-debug class="sr-only" ref={itemDialogOutputRef}></output>

      {/* Temporary overlay when dialogue is open */}
      {/*
      <Show when={isDialogOpen()}>
        <div
          class={`${cn(
            "overlay absolute inset-0 z-10 h-screen w-screen border bg-background/50 bg-blend-overlay backdrop-blur-sm"
          )}`}
        />
      </Show>
      */}

      {/* Disabled for refactoring form to use dialog instead of modal */}
      <Show when={false && showModal()}>
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

type DialogProps = {
  itemDialogRef: HTMLDialogElement | undefined;
  closeItemDialogBtnRef: undefined;
  props: ListItemProps;
  handleConfirmBtn: (
    ev: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => void;
  confirmItemDialogBtnRef: HTMLButtonElement | undefined;
};

export function Dialog(props: DialogProps) {
  return (
    <dialog
      id="openItemDialog"
      ref={props.itemDialogRef}
      // Opening dialogs via HTMLDialogElement.show() is preferred over the toggling of the boolean open attribute.
      // open={isDialogOpen()} // Because this dialog was opened via the open attribute, it is non-modal.
      class="z-50 aspect-video w-full max-w-md rounded-2xl border bg-card text-foreground"
    >
      <form method="dialog" action="">
        <div class="grid">
          <button
            ref={props.closeItemDialogBtnRef}
            id="closeItemDialogBtn"
            value="cancel"
            formmethod="dialog"
            class="place-self-end"
          >
            <CrossIcon />
          </button>
          <h2 class="text-xl ">Editing [{props.props.item.name}]</h2>
          <p>Dialog content</p>
          <button
            id="confirmBtn"
            onClick={(ev) => props.handleConfirmBtn(ev)}
            ref={props.confirmItemDialogBtnRef}
            value="default"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
