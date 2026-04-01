import React from "react";
import "../App.css";

export default function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    // Check initial theme
    const isLight = document.documentElement.classList.contains("light-theme");
    setIsDark(!isLight);
  }, []);

  const handleToggle = () => {
    window.toggleTheme();
    setIsDark(!isDark);
  };

  return (
    <div className="sticky-toolbar">
      <button
        className="theme-toggle"
        onClick={handleToggle}
        title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
