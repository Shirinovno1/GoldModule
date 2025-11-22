import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Header = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b-2 border-primary/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 md:h-24 items-center justify-between">
          {/* Logo & Business Name */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2 sm:gap-3">
              {theme.logo ? (
                <img 
                  src={theme.logo} 
                  alt={theme.businessName} 
                  className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] drop-shadow-sm" 
                />
              ) : (
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl md:text-4xl drop-shadow-sm">verified</span>
              )}
              <div className="flex flex-col min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black font-serif text-white leading-tight truncate">
                  {theme.businessName}
                </h1>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-primary/80 leading-none whitespace-nowrap">
                  Premium Qızıl
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-base font-bold hover:text-primary transition-colors text-white">
              Mağaza
            </Link>
            <Link to="/about" className="text-base font-bold hover:text-primary transition-colors text-white">
              Haqqımızda
            </Link>
            <Link to="/contact" className="text-base font-bold hover:text-primary transition-colors text-white">
              Əlaqə
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="flex items-center justify-center h-12 w-12 rounded-xl hover:bg-primary/10 transition-colors touch-target"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-2xl text-white">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t-2 border-primary/20 glass">
            <nav className="flex flex-col gap-4">
              <Link
                to="/products"
                className="text-lg font-bold hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-primary/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                🛍️ Mağaza
              </Link>
              <Link
                to="/about"
                className="text-lg font-bold hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-primary/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                ℹ️ Haqqımızda
              </Link>
              <Link
                to="/contact"
                className="text-lg font-bold hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-primary/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                📞 Əlaqə
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
