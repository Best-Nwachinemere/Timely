import React from "react";

const ThemeToggle: React.FC = () => {
  const isDark = document.documentElement.classList.contains("dark");

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      className="px-3 py-1 rounded bg-muted hover:bg-accent transition"
      onClick={toggleTheme}
    >
      {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;