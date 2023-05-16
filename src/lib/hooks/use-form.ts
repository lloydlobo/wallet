// @aource https://codesandbox.io/s/solidjs-submit-form-with-store-6kh4c?from-embed=&file=%2Fsrc%2FuseForm.ts

import { createStore } from "solid-js/store";
import { insertRowsDB } from "../db/controllers";
import { TDatabaseExpense } from "../types-supabase";

const submit = async (formStore: Partial<TDatabaseExpense>) => {
  // Filter out unnecessary data.
  const dataToSubmit: Partial<TDatabaseExpense> = {
    amount: formStore.amount,
    created_at: formStore.created_at,
    description: formStore.description,
    is_cash: formStore.is_cash,
    name: formStore.name,
    transaction_date: formStore.transaction_date,
    updated_at: formStore.updated_at,
  }; // owner: "", id: (expenses()?.length ?? -1) + 1,
  console.log(`submitting ${JSON.stringify(dataToSubmit)}`);

  // NOTE: Submit to back-end server or database.
  const VITE_SUPABASE_OWNER = import.meta.env.VITE_SUPABASE_OWNER;
  const now = new Date;
  const dataWithOwnerToSubmit: Partial<TDatabaseExpense> = {
    name: formStore.name,
    description: formStore.description,
    amount: formStore.amount,
    is_cash: formStore.is_cash,
    owner: VITE_SUPABASE_OWNER,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    transaction_date: formStore.transaction_date ?? now.toISOString(),
  }
  await insertRowsDB([dataWithOwnerToSubmit])
}

export function useForm() {
  const now = new Date().toISOString();
  const [formStore, setFormStore] = createStore<Partial<TDatabaseExpense>>({
    amount: 0,
    created_at: now,
    description: null, // id: (expenses()?.length ?? -1) + 1,
    is_cash: false,
    name: "", // owner: "",
    transaction_date: null,
    updated_at: now,
  });


  // Reusable function to update the store based on the name of the property field.
  const updateFormField = (fieldName: string) => (ev: Event) => {
    const inputElement = ev?.currentTarget as HTMLInputElement;
    if (inputElement.type === "checkbox") {
      setFormStore({
        [fieldName]: !!inputElement.checked
      })
    } else {
      setFormStore({
        [fieldName]: inputElement.value
      })
    }
  }

  const clearField = (fieldName: string) => {
    // FIXME: Would it automatically parse non-string values, like boolean of is_cash?
    setFormStore({
      [fieldName]: ""
    });
  };

  return { formStore, submit, updateFormField, clearField };
}

