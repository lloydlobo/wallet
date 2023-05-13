import { JSX } from "solid-js/jsx-runtime";
import { createThemeToggle } from "../lib/theme-toggle";
import styles from "../components/ThemeToggle.module.css";

export function ThemeToggle(): JSX.Element {
  const { isDarkMode, handleSwitchDarkMode } = createThemeToggle();
  const modeTitle = isDarkMode ? "dark" : "light";
  console.log(modeTitle);

  return (
    <div title={modeTitle} class="relative rounded-full mx-3">
      <input
        checked={isDarkMode ?? true}
        onClick={handleSwitchDarkMode}
        type="checkbox"
        id="themeToggle"
        class={`${styles.themeToggle}`}
      />
      <label for="themeToggle" />
    </div>
  )
}


