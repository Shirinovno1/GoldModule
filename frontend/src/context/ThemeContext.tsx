import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, defaultTheme, applyTheme } from '../config/theme';
import { fetchConfig } from '../services/api';

interface ThemeContextType {
  theme: ThemeConfig;
  loading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  loading: true,
  error: null,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Always apply dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, error }}>
      {children}
    </ThemeContext.Provider>
  );
};
