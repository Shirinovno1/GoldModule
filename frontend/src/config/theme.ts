export interface ThemeConfig {
  businessName: string;
  logo: string;
  phoneNumber: string;
  whatsappNumber: string;
  contactEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  colors: {
    primary: string;
    accent: string;
    backgroundLight: string;
    backgroundDark: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email?: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const defaultTheme: ThemeConfig = {
  businessName: 'ShirinovGold',
  logo: '',
  phoneNumber: '+1234567890',
  whatsappNumber: '+1234567890',
  contactEmail: '',
  instagramUrl: '',
  facebookUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  colors: {
    primary: '#D4AF37',
    accent: '#B48F40',
    backgroundLight: '#FCFBF8',
    backgroundDark: '#1A1A1A',
  },
  contact: {
    phone: '+1234567890',
    whatsapp: '+1234567890',
  },
  socialMedia: {},
};

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // Apply CSS variables
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background-light', theme.colors.backgroundLight);
  root.style.setProperty('--color-background-dark', theme.colors.backgroundDark);
  
  // Update page title and favicon
  document.title = `${theme.businessName} - Premium Qızıl Satışı`;
  
  // Update favicon if logo exists
  if (theme.logo) {
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = theme.logo;
  }
};
