// @aource https://codesandbox.io/s/solidjs-submit-form-with-store-6kh4c?from-embed=&file=%2Fsrc%2FuseForm.ts

import { createStore } from 'solid-js/store';
import { z } from 'zod';
import { insertRowsDB } from '../db/controllers';
import { TDatabaseExpense, TUpdateExpense } from '../types-supabase';

export function useForm() {
  const now = new Date().toISOString();
  const [formStore, setFormStore] = createStore<TUpdateExpense>({
    amount: 0,
    created_at: now,
    description: null, // id: (expenses()?.length ?? -1) + 1,
    is_cash: false,
    name: '', // owner: "",
    transaction_date: null,
    updated_at: now,
  });

  // Reusable function to update the store based on the name of the property field.
  const updateFormField = (fieldName: string) => (ev: Event) => {
    const field = z.string().parse(fieldName);
    const inputElement = ev?.currentTarget as HTMLInputElement;

    if (inputElement.type === 'checkbox') {
      setFormStore({
        [field]: !!inputElement.checked,
      });
    } else {
      setFormStore({
        [field]: inputElement.value,
      });
    }
  };

  // FIXME: Would it automatically parse non-string values, like boolean of is_cash?
  const clearField = (fieldName: string) => {
    setFormStore({
      [fieldName]: '',
    });
  };

  // PERF: Comparedto react-hook-forms, just use this to return formStore value.
  // NOTE: Submit to back-end server or database.
  const submit = async (onSubmit: (data: TUpdateExpense) => Promise<void>) => {
    const VITE_SUPABASE_OWNER = import.meta.env.VITE_SUPABASE_OWNER;

    const now = new Date();

    // Filter out unnecessary data here. Remove or add fields.
    const dataWithOwnerToSubmit: TUpdateExpense = {
      name: formStore.name,
      description: formStore.description,
      amount: formStore.amount,
      is_cash: formStore.is_cash,
      owner: VITE_SUPABASE_OWNER,
      created_at: formStore.created_at,
      updated_at: now.toISOString(),
      transaction_date: formStore.transaction_date,
    };

    await onSubmit(dataWithOwnerToSubmit);
  };

  return { formStore, setFormStore, submit, updateFormField, clearField };
}
