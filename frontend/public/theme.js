(function () {
  const STORAGE_KEY = "sellerRep-theme";
  const root = document.documentElement;

  // Load saved theme preference
  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light") {
      root.classList.add("light-theme");
    } else if (savedTheme === "dark") {
      root.classList.remove("light-theme");
    } else {
      // Default: check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (!prefersDark) {
        root.classList.add("light-theme");
      }
    }
  }

  // Toggle theme
  window.toggleTheme = function () {
    const isLight = root.classList.contains("light-theme");
    if (isLight) {
      root.classList.remove("light-theme");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.add("light-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  };

  loadTheme();
})();
