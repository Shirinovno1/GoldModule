import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ContactButtons } from '../components/ContactButtons';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { az } from '../i18n/az';

export const HomePage = () => {
  const [heroContent, setHeroContent] = useState<any>({
    headline: 'Saf Zəriflik, Əbədi Dəyər',
    subheadline: 'Zəriflik və Dəyər',
    description: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get('/products?featured=true&limit=8');
      
      // Load hero content
      try {
        const heroRes = await api.get('/content/hero');
        if (heroRes.data.success && heroRes.data.data?.hero) {
          setHeroContent(heroRes.data.data.hero);
        }
      } catch (err) {
        console.error('Failed to load hero content:', err);
      }
      
      return response.data.data.products;
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section with Background Image Support */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-black">
        {/* Background Image or Premium Pattern */}
        <div className="absolute inset-0 bg-black">
          {/* TODO: Add background image from admin config */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary/40 rounded-full blur-3xl float"></div>
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/40 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
          </div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-2 glass rounded-full border-2 border-primary/40 scroll-reveal">
            <span className="text-primary text-sm font-black tracking-widest">✨ PREMIUM QIZIL KOLLEKSİYASI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-serif text-white mb-6 scroll-zoom drop-shadow-2xl">
            <span className="block mb-2">{heroContent.headline || az.heroTitle}</span>
            <span className="block bg-gradient-to-r from-primary via-yellow-400 to-accent bg-clip-text text-transparent drop-shadow-lg">
              {heroContent.subheadline || 'Zəriflik və Dəyər'}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto scroll-reveal stagger-1 drop-shadow-lg font-bold">
            {heroContent.description || az.heroSubtitle}
          </p>
          
          <div className="scroll-reveal stagger-2">
            <ContactButtons />
          </div>

          {/* Trust badges */}
          <div className="mt-12 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto scroll-reveal stagger-3 px-4">
            <div className="text-center glass rounded-2xl p-6 sm:p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">verified</span>
              </div>
              <p className="text-white text-base sm:text-base font-bold">Sertifikatlaşdırılmış</p>
              <p className="text-white/70 text-sm mt-1">100% Orijinal</p>
            </div>
            <div className="text-center glass rounded-2xl p-6 sm:p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">local_shipping</span>
              </div>
              <p className="text-white text-base sm:text-base font-bold">Sığortalı Çatdırılma</p>
              <p className="text-white/70 text-sm mt-1">Təhlükəsiz</p>
            </div>
            <div className="text-center glass rounded-2xl p-6 sm:p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">support_agent</span>
              </div>
              <p className="text-white text-base sm:text-base font-bold">24/7 Dəstək</p>
              <p className="text-white/70 text-sm mt-1">Həmişə Yanınızda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-black uppercase tracking-widest mb-4 block scroll-reveal">
              SEÇİLMİŞ KOLLEKSİYA
            </span>
            <h2 className="text-5xl md:text-6xl font-black font-serif mb-6 scroll-zoom text-gray-900 dark:text-white">
              {az.featuredCollection}
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-yellow-400 to-accent mx-auto scroll-reveal stagger-1 rounded-full shadow-lg"></div>
          </div>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.map((product: any, index: number) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className={`group glass rounded-3xl overflow-hidden hover-lift parallax scroll-reveal stagger-${(index % 6) + 1}`}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                    {product.images[0] && (
                      <img
                        src={product.images[0].medium}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        ⭐ SEÇİLMİŞ
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-white dark:bg-black backdrop-blur-sm">
                    <h3 className="font-black text-xl mb-2 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-base text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-sm text-primary">verified</span>
                      {product.purity}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black bg-gradient-to-r from-primary via-yellow-500 to-accent bg-clip-text text-transparent">
                        {product.price.toLocaleString('az-AZ')} ₼
                      </p>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300 text-2xl">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-16 scale-up stagger-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover-lift shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>{az.viewAllProducts}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black font-serif mb-6 scroll-zoom text-gray-900 dark:text-white">
              Niyə Bizi Seçməlisiniz?
            </h2>
            <p className="text-xl text-gray-800 dark:text-gray-200 scroll-reveal stagger-1 font-bold">
              Keyfiyyət və etibarlılıq bizim prioritetimizdir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="text-center p-10 glass rounded-3xl hover-lift parallax scroll-reveal stagger-1 border-2 border-primary/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 glow shadow-2xl">
                <span className="material-symbols-outlined text-white text-4xl">diamond</span>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Yüksək Keyfiyyət</h3>
              <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed font-bold">
                Bütün məhsullarımız beynəlxalq standartlara uyğun sertifikatlaşdırılmışdır
              </p>
            </div>

            <div className="text-center p-10 glass rounded-3xl hover-lift parallax scroll-reveal stagger-2 border-2 border-primary/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 glow shadow-2xl">
                <span className="material-symbols-outlined text-white text-4xl">security</span>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Təhlükəsizlik</h3>
              <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed font-bold">
                Sığortalı çatdırılma və tam təhlükəsizlik zəmanəti
              </p>
            </div>

            <div className="text-center p-10 glass rounded-3xl hover-lift parallax scroll-reveal stagger-3 border-2 border-primary/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 glow shadow-2xl">
                <span className="material-symbols-outlined text-white text-4xl">workspace_premium</span>
              </div>
              <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Ekspert Dəstəyi</h3>
              <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed font-bold">
                Peşəkar komandamız hər zaman sizə kömək etməyə hazırdır
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
