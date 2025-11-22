import { useTheme } from '../context/ThemeContext';

export const ContactPage = () => {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Bizimlə Əlaqə
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg opacity-80">
              Suallarınız və ya sorğularınız üçün bizimlə əlaqə saxlayın
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Phone */}
            {theme.phoneNumber && (
              <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      call
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Telefon</h3>
                    <p className="opacity-80 mb-4">
                      Bizimlə birbaşa əlaqə saxlayın
                    </p>
                    <a
                      href={`tel:${theme.phoneNumber}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
                    >
                      {theme.phoneNumber}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {theme.whatsappNumber && (
              <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="material-symbols-outlined text-green-500 text-4xl">
                      chat
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                    <p className="opacity-80 mb-4">
                      WhatsApp vasitəsilə mesaj göndərin
                    </p>
                    <a
                      href={`https://wa.me/${theme.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors font-medium"
                    >
                      {theme.whatsappNumber}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            {theme.contactEmail && (
              <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      mail
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="opacity-80 mb-4">
                      Bizə email göndərin
                    </p>
                    <a
                      href={`mailto:${theme.contactEmail}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium break-all"
                    >
                      {theme.contactEmail}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram */}
            {theme.instagramUrl && (
              <div className="p-8 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="material-symbols-outlined text-pink-500 text-4xl">
                      photo_camera
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Instagram</h3>
                    <p className="opacity-80 mb-4">
                      Bizi Instagram-da izləyin
                    </p>
                    <a
                      href={theme.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors font-medium"
                    >
                      Instagram
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Business Hours */}
          <div className="p-8 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                schedule
              </span>
              <h2 className="text-2xl font-bold mb-4">İş Saatları</h2>
              <div className="space-y-2 text-lg">
                <p>Bazar ertəsi - Cümə: 09:00 - 18:00</p>
                <p>Şənbə: 10:00 - 16:00</p>
                <p className="opacity-60">Bazar: Bağlı</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Məhsullarımıza baxın</h2>
            <p className="mb-6 opacity-80">
              Geniş qızıl məhsul çeşidimizi kəşf edin
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Mağazaya keçin
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
