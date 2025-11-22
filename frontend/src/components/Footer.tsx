import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export const Footer = () => {
  const { theme } = useTheme();
  
  const { data: categories } = useQuery({
    queryKey: ['categories-footer'],
    queryFn: async () => {
      const response = await api.get('/categories/public');
      return response.data.data.categories;
    },
  });

  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-primary/20">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-base">Mağaza</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              <li><Link to="/products" className="hover:text-primary">Hamisi</Link></li>
              {categories?.map((category: any) => (
                <li key={category._id}>
                  <Link to={`/products?category=${category._id}`} className="hover:text-primary">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-base">Haqqımızda</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              <li><Link to="/about" className="hover:text-primary">Bizim Hekayə</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Əlaqə</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-base">Əlaqə</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 font-semibold">
              <li>Telefon: {theme.contact.phone}</li>
              <li>WhatsApp: {theme.contact.whatsapp}</li>
              {theme.contact.email && <li>E-poçt: {theme.contact.email}</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-base">Bizi İzləyin</h4>
            <div className="flex gap-3">
              {theme.instagramUrl && (
                <a 
                  href={theme.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover-lift hover:text-pink-500 transition-all"
                  aria-label="Instagram"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                </a>
              )}
              {theme.facebookUrl && (
                <a 
                  href={theme.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover-lift hover:text-blue-500 transition-all"
                  aria-label="Facebook"
                >
                  <span className="material-symbols-outlined">public</span>
                </a>
              )}
              {theme.tiktokUrl && (
                <a 
                  href={theme.tiktokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover-lift hover:text-black dark:hover:text-white transition-all"
                  aria-label="TikTok"
                >
                  <span className="material-symbols-outlined">music_note</span>
                </a>
              )}
              {theme.youtubeUrl && (
                <a 
                  href={theme.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover-lift hover:text-red-500 transition-all"
                  aria-label="YouTube"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-gray-700 dark:text-gray-300 font-semibold">
          <p>© {new Date().getFullYear()} {theme.businessName}. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
};
