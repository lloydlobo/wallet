export function createThemeToggle() {
  let isDarkMode = true;

  const browser = typeof window !== 'undefined';
  if (browser) {
    const isLocalThemeDark = localStorage.theme === 'dark';
    if (
      isLocalThemeDark ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      isDarkMode = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDarkMode = false;
    }
  }

  isDarkMode ? 'dark' : 'light';

  // ev.preventDefault(); // prevent toogle from changing colors.
  function handleSwitchDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return { isDarkMode, handleSwitchDarkMode };
}
