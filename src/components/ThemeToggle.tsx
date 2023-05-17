import { createSignal, Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createThemeToggle } from "../lib/theme-toggle";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle(): JSX.Element {
  const { isDarkMode, handleSwitchDarkMode } = createThemeToggle();
  const modeTitle = (isDarkMode: boolean) => isDarkMode ? "dark" : "light";
  const [mode, setMode] = createSignal(modeTitle(isDarkMode));

  // function handleOnClick(ev: MouseEvent & { currentTarget: HTMLButtonElement; target: Element; }): void {
  function handleOnClick(ev: Event): void {
    ev.preventDefault()
    if (mode() === "dark") {
      setMode("light")
    } else {
      setMode("dark")
    }
    handleSwitchDarkMode()
  }

  return (
    <div
      id="themeToggle"
      onClick={ev => handleOnClick(ev)}
      role="button"
    >
      <div
        class="flex gap-1 cursor-pointer">
        <div class="">
          <Show when={mode() === 'light'}>
            <MoonIcon />
          </Show>
          <Show when={mode() === "dark"}>
            <SunIcon />
          </Show>
        </div>
        <label for="themeToggle" class="cursor-pointer  w-full flex-shrink-0" >Use {mode() === "dark" ? "light" : "dark"} theme </label>
      </div>
    </div>
  )
}


