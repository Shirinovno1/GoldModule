import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, defaultTheme, applyTheme } from '../config/theme';
import { fetchConfig } from '../services/api';

interface ThemeContextType {
  theme: ThemeConfig;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  loading: true,
  error: null,
  darkMode: true,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const config = await fetchConfig();
        setTheme(config);
        applyTheme(config);
      } catch (err) {
        console.error('Failed to load theme configuration:', err);
        setError('Failed to load configuration');
        // Use default theme on error
        applyTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, error, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
