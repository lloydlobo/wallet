import { CrossIcon } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { stylesInput, Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/cn';
import { asDayOfWeek, asHTMLInputDateValue } from '@/lib/date';
import { deleteRowsDB, insertRowsDB, updateRowsDB } from '@/lib/db/controllers';
import { useForm } from '@/lib/hooks/create-form';
import { TDatabaseExpense, TRowExpense, TUpdateExpense } from '@/lib/types-supabase';
import { createEffect, createSignal, onCleanup, Setter } from 'solid-js'; // mergeProps, // const merged = mergeProps({ ownerName: "John", month: 4 }, props);
import { JSX } from 'solid-js/jsx-runtime';
import { z } from 'zod';

type ListItemProps = {
  item: TRowExpense;
  setIsItemModalOpen: Setter<boolean>;
};

// const closeDialog = ( ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => { props.setIsItemModalOpen(false); return setIsDialogOpen(false); };
export function ListItem(props: ListItemProps): JSX.Element {
  const { formStore, setFormStore, updateFormField, submit: handleSubmit, clearField } = useForm();

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);

  const dateTransaction = new Date(getAnyDate());

  let formInputNameRef: HTMLInputElement | undefined;
  let formTextareaRef: HTMLTextAreaElement | undefined;
  let itemDialogRef: HTMLDialogElement | undefined;
  let itemDialogOutputRef: HTMLOutputElement | undefined;
  let confirmItemDialogBtnRef: HTMLButtonElement | undefined;
  let openItemDialogBtnRef;
  let closeItemDialogBtnRef;

  createEffect(() => {
    itemDialogRef?.addEventListener('close', onCloseDialogEvent);
    onCleanup(() => {
      itemDialogRef?.removeEventListener('close', onCloseDialogEvent);
    });
  });

  // TODO: use this wisely.
  // FIXME: Is this avoiding updating the item?
  function clearAllFields() {
    for (const key of Object.keys(formStore)) {
      clearField(key);
    }
  }

  function getAnyDate(): string {
    return props.item.transaction_date ?? props.item.created_at ?? props.item.updated_at;
  }

  function onDeleteForm(ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) {
    ev.preventDefault();
    onDelete(ev);
    itemDialogRef?.close();
    setIsDialogOpen(false);
    setShowModal(false);
    // clearAllFields();
  }

  function onDelete(ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) {
    ev.preventDefault();
    deleteRowsDB({ id: z.coerce.string().parse(props.item.id) });
    setIsDialogOpen(false);
    return setShowModal(false);
  }

  function onCloseDialogEvent(this: HTMLDialogElement, _ev: Event) {
    if (!itemDialogOutputRef) return;
    itemDialogOutputRef.value =
      itemDialogRef?.returnValue === 'default'
        ? 'No return value'
        : `ReturnValue:${itemDialogRef?.returnValue}.`;
    props.setIsItemModalOpen(false);
    // clearAllFields();
  }

  // `show()` <- Displays the dialog element. vs
  // `showModal()` Displays the dialog as modal -> itemDialogRef?.showModal();
  const openDialog = (_ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    itemDialogRef?.showModal(); // itemDialogRef?.show();
    props.setIsItemModalOpen(true); // Note: Tell parent that our dialog is open, used to signal that `Escape` key doesn't close <aside> when <dialog> is open.
    setFormStore(props.item); // NOTE: Links formStore content to the one we selected.
    return setIsDialogOpen(true); // TODO: can we user this setters state totell parent if modal is closed?
  };

  const onSubmitUpdateCallback = async (data: TUpdateExpense) => {
    const toUpdate = data;
    const idToUpdate = props.item.id;
    toUpdate.id = idToUpdate;
    const updated = await updateRowsDB({ from: props.item, to: data });
    // TODO: Mutate global store expense of id `idToUpdate`.
    // clearAllFields();
  };

  async function onConfirm(
    _ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) {
    const data = await updateRowsDB({
      from: { id: props.item.id },
      to: props.item,
    });
    await handleSubmit(onSubmitUpdateCallback); // NOTE: Logic to handle submiting to server.
    // console.log(data) // Mutate global store with update row.
    itemDialogRef?.close('TODO: add `selectEl.value`'); // Send the input value to dialog -> output.
    props.setIsItemModalOpen(false);
    // clearAllFields();
  }

  function onCloseModal(ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) {
    ev.preventDefault();
    itemDialogRef?.close();
    setIsDialogOpen(false);
    setShowModal(false);
    // clearAllFields();
  }

  return (
    <>
      <button
        type="button"
        id="showDialog"
        onClick={(ev) => openDialog(ev)}
        ref={openItemDialogBtnRef}
        class={cn(
          'grid w-full grid-cols-4 items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-muted hover:shadow'
        )}
      >
        <div class="grid grid-cols-2 gap-1">
          <div class="flex gap-0.5">
            <span class="">{asDayOfWeek(dateTransaction).weekDay.slice(0, 3)}</span>
            <span class="">{dateTransaction.getDate().toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div class="text-start">{props.item.name}</div>
        <div class="text-start text-muted-foreground">{props.item.description ?? ''}</div>
        <div class="grid grid-cols-2">
          <div class="text-end">{props.item.amount}</div>
          <div class="id">{props.item.is_cash ? 'Cash' : 'Other'}</div>
        </div>
      </button>

      {/* Opening dialogs via HTMLDialogElement.show() is preferred over the toggling of the boolean open attribute. open={isDialogOpen()} // Because this dialog was opened via the open attribute, it is non-modal. */}
      <dialog
        id="openItemDialog"
        ref={itemDialogRef}
        class="inset-0 z-50 w-full max-w-md overflow-x-clip rounded-2xl border bg-card text-foreground @container"
      >
        <form method="dialog" action="" class="">
          <div class="flex flex-col space-y-2">
            <div class="flex w-full justify-between py-3">
              <h2 data-title class="font-semibold text-muted-foreground" title={props.item.name}>
                {' '}
                Edit{' '}
              </h2>
              <button
                type="button"
                title="Reset form"
                ref={closeItemDialogBtnRef}
                id="closeItemDialogBtn"
                value="cancel"
                formmethod="dialog"
                class="place-self-end text-muted-foreground"
                onClick={onCloseModal}
              >
                <CrossIcon class="scale-[61%]" />
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
                required
                id="formName"
                withClass="border-blue-400"
                value={formStore.name} // value={formStore.name}
                onChange={updateFormField('name')} // use onChange for less control on reactivity or more performance.
              />
              <Input
                onChange={updateFormField('amount')}
                id="formAmount"
                type="number"
                placeholder="Amount"
                class="form-input"
                required
                value={formStore.amount}
                withClass="font-mono"
              />
              <Textarea
                onChange={updateFormField('description')}
                placeholder="Description"
                value={formStore.description ?? ''}
                ref={formTextareaRef}
              />
              <Input
                onChange={updateFormField('transaction_date')}
                type="date"
                placeholder="Amount"
                id="formDate"
                // TODO: Manually convert date from formStore.transaction_date with asHTMLInputDateValue
                class={cn('form-input', stylesInput, 'block')}
                value={asHTMLInputDateValue(
                  new Date(
                    formStore.transaction_date ??
                      formStore.created_at ??
                      formStore.updated_at ??
                      props.item.updated_at
                  )
                )}
              />{' '}
              {/* Hack: Bypass default flex with block to place datepicker at end. */}
              <div class="form-input flex items-start justify-between gap-2 border-transparent bg-background">
                <div class="flex flex-col space-y-1">
                  <label for="isCashCheckbox">Cash</label>
                  <span class="relative text-xs text-muted-foreground/70">
                    Transaction done with cash or credit.
                  </span>
                </div>
                <Input
                  type="checkbox"
                  withClass="form-checkbox"
                  onChange={updateFormField('is_cash')}
                  id="isCashCheckbox"
                  checked={formStore.is_cash}
                />
              </div>
            </div>
            <div
              data-actions
              class="@md:[&_button]:min-w-[4rem]! flex w-full flex-col place-content-end justify-end gap-4 px-2 @sm:flex-row"
            >
              <button onClick={onDeleteForm} class="basis-1/6 text-destructive" type="button">
                Delete
              </button>
              <button
                type="submit"
                id="confirmBtn"
                onClick={onConfirm}
                ref={confirmItemDialogBtnRef}
                value="default"
                class="basis-1/6"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </dialog>
      {/* TODO: Remove after we figure out returns of modal dialog*/}
      <output data-debug class="sr-only! opacity-50" ref={itemDialogOutputRef} />
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

// Note: Opening dialogs via HTMLDialogElement.show() is preferred over the toggling of
// the boolean open attribute. open={isDialogOpen()} // Because this dialog was opened via
// the open attribute, it is non-modal.
export function Dialog(props: DialogProps) {
  // <Dialog itemDialogRef={itemDialogRef} closeItemDialogBtnRef={closeItemDialogBtnRef} props={props} handleConfirmBtn={handleConfirmBtn} confirmItemDialogBtnRef={confirmItemDialogBtnRef} />
  return (
    <dialog
      id="openItemDialog"
      ref={props.itemDialogRef}
      class="z-50 aspect-video w-full max-w-md rounded-2xl border bg-card text-foreground"
    >
      <form method="dialog" action="">
        <div class="grid">
          <button
            type="button"
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
            type="button"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}

// {/* Temporary overlay when dialogue is open */}
//
// {/* Disabled for refactoring form to use dialog instead of modal */}
// <Show when={false && showModal()}>
//   {/* TODO: rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
//   <div onClick={(ev) => handleToggleModal(ev)} class="absolute inset-0 z-50 grid place-content-center bg-background/50 bg-blend-overlay backdrop-blur-sm @container" >
//     <div id="modalRef" ref={modalRef} class="w-full max-w-md place-self-center rounded-2xl border bg-card p-8 shadow" >
//       <form action="">
//         <div class="relative grid gap-4 p-2 [&>input]:border-transparent [&>input]:border-b-muted">
//           <button onClick={(ev) => setShowModal(false)} class="absolute -right-5 -top-5 text-muted-foreground" type="submit" >
//             <div class="scale-75"> <CrossIcon /> </div>
//           </button>
//           <input ref={formInputNameRef} type="text" class="form-input" value={merged.item.name} />
//           <textarea class="form-textarea border-transparent border-b-muted" value={props.item.description ?? ""} />
//           <input type="date" class="form-input" value={initialDate} />
//           <input type="number" class="form-input" value={props.item.amount} />
//           <div class="form-input flex items-center gap-2 border-transparent bg-background">
//             <label for="isCash" class="text-sm text-muted-foreground"> Cash:{" "} </label>
//             <input id="isCash" type="checkbox" class="form-checkbox" checked={props.item.is_cash} />
//           </div>
//           <div class="flex w-full justify-between px-2">
//             <div class="shell"></div>
//             <div class="flex gap-4">
//               <button onClick={(ev) => setShowModal(false)} class="text-destructive" type="submit" > Delete </button>
//               <button class="" type="button"> Save </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
// </Show>
