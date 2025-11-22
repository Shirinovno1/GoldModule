import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';



export const AboutPage = () => {
  const { theme } = useTheme();
  
  const { data: aboutContent = {
    title: 'Haqqımızda',
    content: 'Biz ən yüksək keyfiyyətli qızıl məhsulları təqdim etməyə sadiqik. Hər bir məhsulumuz sertifikatlaşdırılmış təmizlik və orijinallıqla gəlir.',
  } } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const response = await api.get('/content/about');
      return response.data.success && response.data.data?.about 
        ? response.data.data.about 
        : {
            title: 'Haqqımızda',
            content: 'Biz ən yüksək keyfiyyətli qızıl məhsulları təqdim etməyə sadiqik. Hər bir məhsulumuz sertifikatlaşdırılmış təmizlik və orijinallıqla gəlir.',
          };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              {aboutContent.title}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {aboutContent.image && (
              <div className="rounded-xl overflow-hidden">
                <img
                  src={aboutContent.image}
                  alt={aboutContent.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {aboutContent.content}
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  verified
                </span>
                <h3 className="text-xl font-semibold mb-2">Sertifikatlaşdırılmış</h3>
                <p className="text-sm opacity-80">
                  Bütün məhsullarımız rəsmi sertifikatlarla təmin edilir
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  local_shipping
                </span>
                <h3 className="text-xl font-semibold mb-2">Sığortalı Çatdırılma</h3>
                <p className="text-sm opacity-80">
                  Təhlükəsiz və sığortalı çatdırılma xidməti
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  support_agent
                </span>
                <h3 className="text-xl font-semibold mb-2">Ekspert Dəstəyi</h3>
                <p className="text-sm opacity-80">
                  Peşəkar məsləhət və dəstək xidməti
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center p-8 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
              <h2 className="text-2xl font-bold mb-4">Sualınız var?</h2>
              <p className="mb-6 opacity-80">
                Bizimlə əlaqə saxlayın və ekspertlərimiz sizə kömək etsinlər
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {theme.phoneNumber && (
                  <a
                    href={`tel:${theme.phoneNumber}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Zəng edin
                  </a>
                )}
                {theme.whatsappNumber && (
                  <a
                    href={`https://wa.me/${theme.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
