import { useTalentProfile } from "@/hooks/useTalentProfile";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>("dark"); // Default to dark to prevent flash
  const { profile } = useTalentProfile(user);


  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    if (profile?.theme === "light" || profile?.theme === "dark") {
      setTheme(profile.theme);
      localStorage.setItem("theme", profile.theme);
    } else {
      const storedTheme = localStorage.getItem("theme") as Theme | null;

      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const systemTheme: Theme = prefersDark ? "dark" : "light";
        setTheme(systemTheme);
        localStorage.setItem("theme", systemTheme);
      }
    }
  }, [profile]);

  // Update theme class on document element
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Update body class for admin layout fixes
    if (theme === "light") {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");

      // Apply specific light theme styles
      document.body.style.setProperty("--background-color", "#f8f9fa");
      document.body.style.setProperty("--card-bg", "#ffffff");
      document.body.style.setProperty("--text-color", "#333333");
      document.body.style.setProperty("--border-color", "#e2e8f0");
      document.body.style.setProperty("--muted-color", "#64748b");
      document.body.style.setProperty("--highlight-color", "#f59e0b");
      document.body.style.setProperty("--admin-bg", "#fff");
      document.body.style.setProperty("--admin-text", "#374151");
      document.body.style.setProperty("--admin-border", "#e5e7eb");
      document.body.style.setProperty("--admin-highlight", "#f59e0b");
    } else {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");

      // Reset to default dark theme values
      document.body.style.removeProperty("--background-color");
      document.body.style.removeProperty("--card-bg");
      document.body.style.removeProperty("--text-color");
      document.body.style.removeProperty("--border-color");
      document.body.style.removeProperty("--muted-color");
      document.body.style.removeProperty("--highlight-color");
      document.body.style.removeProperty("--admin-bg");
      document.body.style.removeProperty("--admin-text");
      document.body.style.removeProperty("--admin-border");
      document.body.style.removeProperty("--admin-highlight");
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
