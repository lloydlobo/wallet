import { JSX } from "solid-js/jsx-runtime";
import type { Accessor, Setter } from "solid-js/types/reactive/signal";
import { Component, onCleanup, createSignal } from "solid-js";

type CounterProps = {
  appState: Accessor<{
    count: number;
  }>;
  setAppState: Setter<{
    count: number;
  }>;
};

export function Counter({ appState, setAppState }: CounterProps): JSX.Element {
  const [click, setClick] = createSignal(0);

  const onClickAdd = (
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => {
    ev.preventDefault();
    setClick(click() + 1);
    setAppState({ ...appState(), count: appState().count + 1 });
  };
  const onClickSubtract = (
    ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => {
    ev.preventDefault();
    setClick(click() + 1);
    setAppState({ ...appState(), count: appState().count - 1 });
  };

  // onCleanup - run an effect once before the reactive scope is disposed
  onCleanup(() => setClick(0));

  return (
    <>
      <div>{click()}</div>
      <div>{appState().count}</div>
      <button type="button" onclick={onClickAdd}>
        +
      </button>
      <button type="button" onclick={onClickSubtract}>
        -
      </button>
    </>
  );
}
