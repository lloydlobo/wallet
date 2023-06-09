import { Databases } from '../enums';
import { supabase } from '../supabase-client';
import { TDatabaseExpense, TUpdateExpense } from '../types-supabase';

export async function getDB(): Promise<TDatabaseExpense[] | null | undefined> {
  try {
    const { data } = await supabase.from(Databases.DB_NAME_EXPENSES).select();
    return data as TDatabaseExpense[];
  } catch (err) {
    console.error(err);
  }
}

export async function getName() {
  const { data: expenses, error } = await supabase.from('expenses').select('name');
  // console.log(expenses)
}

export async function insertRowsDB<T extends object>(rows: T[]) {
  const { data, error } = await supabase.from('expenses').insert(rows);
  if (error) {
    console.error('Error inserting row:', error);
    return;
  }

  // console.log('New row inserted:', data)
}

type TDeleteRow = {
  id: string;
};
export async function deleteRowsDB(props: TDeleteRow) {
  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', props.id)
    // .eq("some_column", "someValue")
    .select();
  // console.log(data, error)
}

type TUpdateRowsDB = {
  from: TUpdateExpense;
  to: TUpdateExpense;
};

// .update({ name: 'Coca Cola' })
// .eq('name', 'Coke')
// .update({ name: "Coke" })
// .eq("name", "Coca Cola")
export async function updateRowsDB(props: TUpdateRowsDB) {
  // console.log({ props })
  const { data, error } = await supabase
    .from('expenses')
    .update(props.to)
    .eq('id', props.from.id)
    .select(); // Note: to update the record and return it use `.select()`.
  // console.log(data, error)
  return data;
}

export async function insertDB() {
  try {
    const { data } = await supabase.from(Databases.DB_NAME_EXPENSES).insert({
      name: 'Ramen',
      description: 'NA',
      amount: 4,
    });
  } catch (err) {
    console.error(err);
  }
}
