import { useTheme } from '../context/ThemeContext';

interface ContactButtonsProps {
  productName?: string;
  variant?: 'fixed' | 'inline';
}

export const ContactButtons = ({ productName, variant = 'inline' }: ContactButtonsProps) => {
  const { theme } = useTheme();

  const handleCall = () => {
    window.location.href = `tel:${theme.contact.phone}`;
  };

  const handleWhatsApp = () => {
    const message = productName 
      ? `Hi, I'm interested in ${productName}`
      : 'Hi, I would like to inquire about your products';
    const url = `https://wa.me/${theme.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const buttonClasses = variant === 'fixed'
    ? 'fixed bottom-6 right-6 z-50 flex flex-col gap-4'
    : 'flex flex-col sm:flex-row gap-6 justify-center';

  return (
    <div className={buttonClasses}>
      <button
        onClick={handleCall}
        className="btn-premium group relative flex items-center justify-center gap-4 h-20 px-12 bg-gradient-to-br from-primary via-yellow-500 to-accent text-black font-black text-xl hover-lift shadow-2xl touch-target scale-up"
        style={{
          borderRadius: '60px',
          boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
        }}
      >
        <span className="material-symbols-outlined text-3xl relative z-10">call</span>
        <span className="relative z-10">Zəng Et</span>
      </button>
      <button
        onClick={handleWhatsApp}
        className="btn-premium group relative flex items-center justify-center gap-4 h-20 px-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white font-black text-xl hover-lift shadow-2xl touch-target scale-up stagger-1"
        style={{
          borderRadius: '60px',
          boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
      >
        <svg className="h-7 w-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.45 16.86L2.05 22L7.31 20.62C8.75 21.41 10.36 21.86 12.04 21.86C17.5 21.86 21.95 17.41 21.95 11.95C21.95 6.49 17.5 2 12.04 2Z" />
        </svg>
        <span className="relative z-10">WhatsApp</span>
      </button>
    </div>
  );
};
