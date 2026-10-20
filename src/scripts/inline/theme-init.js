// Mark JS as available before paint so reveal-on-scroll can hide its start
// state (it degrades to fully visible when this class is absent).
document.documentElement.classList.add("js");

function initTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  let colorTheme = localStorage.getItem("colorTheme");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }

  // Initial theme setup
  if (!colorTheme) {
    colorTheme = prefersDark.matches ? "dark" : "light";
    localStorage.setItem("colorTheme", colorTheme);
  }
  applyTheme(colorTheme);

  // Listen for system theme changes
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("colorTheme")) {
      const newTheme = e.matches ? "dark" : "light";
      applyTheme(newTheme);
      localStorage.setItem("colorTheme", newTheme);
    }
  });
}

// runs on initial page load
initTheme();
