import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #D4AF37 0%, #C5A572 100%)',
        boxShadow: darkMode
          ? '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
          : '0 2px 8px rgba(212, 175, 55, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
        border: darkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)'
      }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          transform: darkMode ? 'translateX(28px)' : 'translateX(0)',
          background: darkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        {darkMode ? (
          <span className="material-symbols-outlined text-sm" style={{ color: '#1a1a1a' }}>dark_mode</span>
        ) : (
          <span className="material-symbols-outlined text-sm" style={{ color: '#D4AF37' }}>light_mode</span>
        )}
      </span>
    </button>
  );
};
