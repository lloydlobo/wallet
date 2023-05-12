import { JSX } from "solid-js/jsx-runtime";
import type { Expense } from "../lib/types";

type ListItemProps = {
  item: Expense;
}

function spliceOwnerAvatarID(s: string): string {
  return s.slice(0, 8);
}

export function ListItem({ item }: ListItemProps): JSX.Element {
  return (
    <>
      <div style={{ "grid-template-columns": "repeat(4, 1fr)" }} class="grid justify-between mx-auto place-self-center items-center">
        <span class="contrast">{item.amount}</span>
        <span class="ins">{item.name}</span>
        <span class="secondary">{item.description}</span>
        <span>{spliceOwnerAvatarID(item.owner)}</span>
      </div>
    </>
  )
}


                // <div class={styles.item}>
                //   <span class={styles.avatar} style={"font-size: 0.7rem"}>{spliceOwnerAvatarID(item.owner)}</span>
                //   <span>{item.amount}</span>
                //   <span>{item.name}</span>
                //   <span>{item.description}</span>
                // </div>
