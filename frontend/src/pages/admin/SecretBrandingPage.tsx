import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { SessionWarning } from '../../components/SessionWarning';

export const SecretBrandingPage = () => {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<any>(null);
  const [heroContent, setHeroContent] = useState<any>({
    headline: '',
    subheadline: '',
  });
  const [aboutContent, setAboutContent] = useState<any>({
    title: '',
    content: '',
  });

  const { isLoading, error } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      console.log('Loading config...');
      const response = await api.get('/admin/config');
      console.log('Config loaded:', response.data);
      setConfig(response.data);
      
      // Load hero content
      try {
        const heroRes = await api.get('/content/hero');
        if (heroRes.data.success && heroRes.data.data?.hero) {
          setHeroContent(heroRes.data.data.hero);
        }
      } catch (err) {
        console.error('Failed to load hero content:', err);
      }
      
      // Load about content
      try {
        const aboutRes = await api.get('/content/about');
        if (aboutRes.data.success && aboutRes.data.data?.about) {
          setAboutContent(aboutRes.data.data.about);
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
      }
      
      return response.data;
    },
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/admin/config', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      // Force page reload to update theme context
      window.location.reload();
    },
    onError: (error: any) => {
      console.error('Config update error:', error);
      alert('Xəta baş verdi: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: any }) => {
      const response = await api.put(`/admin/content/${section}`, { data });
      return response.data;
    },
    onSuccess: (_, variables) => {
      alert('Məzmun uğurla yeniləndi!');
      queryClient.invalidateQueries({ queryKey: ['config'] });
      // Invalidate specific content queries
      if (variables.section === 'about') {
        queryClient.invalidateQueries({ queryKey: ['about-content'] });
      }
      if (variables.section === 'hero') {
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      }
    },
    onError: (error: any) => {
      console.error('Content update error:', error);
      alert('Xəta baş verdi: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  const logoUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await api.post('/admin/config/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setConfig({ ...config, logo: data.data.logoUrl });
      queryClient.invalidateQueries({ queryKey: ['config'] });
      alert('Logo uğurla yükləndi!');
      // Force page reload to update theme context
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error: any) => {
      console.error('Logo upload error:', error);
      alert('Logo yükləmə xətası: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(config);
  };

  const handleSaveHeroContent = () => {
    updateContentMutation.mutate({
      section: 'hero',
      data: { hero: heroContent },
    });
  };

  const handleSaveAboutContent = () => {
    updateContentMutation.mutate({
      section: 'about',
      data: { about: aboutContent },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fayl ölçüsü 5MB-dan böyük ola bilməz');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Yalnız şəkil faylları qəbul edilir (JPEG, PNG, GIF, SVG, WebP)');
        return;
      }
      
      logoUploadMutation.mutate(file);
    }
  };

  if (isLoading || !config) return (
    <div className="flex items-center justify-center h-64 bg-black">
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-4">
          {isLoading ? 'Yüklənir...' : 'Konfiqurasiya yüklənmir'}
        </div>
        {error && (
          <div className="text-red-400 text-sm">
            Xəta: {error.message}
          </div>
        )}
        <div className="text-gray-400 text-xs mt-2">
          Debug: isLoading={isLoading.toString()}, config={config ? 'loaded' : 'null'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      <SessionWarning />
      <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="glass border-2 border-red-500/50 rounded-3xl p-8 slide-down">
        <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          🔒 GİZLİ BREND PARAMETRLƏRİ
        </h1>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          Bu səhifə yalnız sizin üçündür. Heç kəs bu səhifədən xəbərdar olmamalıdır!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 shadow-2xl space-y-8 border-2 border-primary/20 slide-up">
        <div>
          <label className="block text-sm font-medium mb-2">Biznes Adı</label>
          <input
            type="text"
            value={config.businessName}
            onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">image</span>
            Logo (Saytın yuxarı hissəsində görünəcək)
          </label>
          <div className="space-y-4 p-4 border-2 border-dashed border-primary/30 rounded-xl">
            {config.logo && (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <img src={config.logo} alt="Logo" className="h-16 w-auto object-contain bg-white p-2 rounded shadow" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">Hazırki Logo</p>
                  <p className="text-xs text-green-600 dark:text-green-500">Bu logo saytın başlığında görünür</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, logo: '' })}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Logoyu Sil
                </button>
              </div>
            )}
            
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
                <div className="text-xs text-blue-700 dark:text-blue-400">
                  <p className="font-semibold mb-1">Logo haqqında:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Tövsiyə olunan ölçü: 300x100 piksel (3:1 nisbəti)</li>
                    <li>Minimum ölçü: 150x50 piksel</li>
                    <li>Maksimum ölçü: 600x200 piksel</li>
                    <li>Fayl formatları: PNG (şəffaf fon), SVG, JPG</li>
                    <li>Maksimum fayl ölçüsü: 5MB</li>
                    <li>Logo saytın başlığında biznes adı ilə birlikdə görünəcək</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Əsas Rəng</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.colors.primary}
                onChange={(e) => setConfig({
                  ...config,
                  colors: { ...config.colors, primary: e.target.value }
                })}
                className="h-12 w-20"
              />
              <input
                type="text"
                value={config.colors.primary}
                onChange={(e) => setConfig({
                  ...config,
                  colors: { ...config.colors, primary: e.target.value }
                })}
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vurğu Rəngi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.colors.accent}
                onChange={(e) => setConfig({
                  ...config,
                  colors: { ...config.colors, accent: e.target.value }
                })}
                className="h-12 w-20"
              />
              <input
                type="text"
                value={config.colors.accent}
                onChange={(e) => setConfig({
                  ...config,
                  colors: { ...config.colors, accent: e.target.value }
                })}
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Telefon</label>
            <input
              type="tel"
              value={config.contact.phone}
              onChange={(e) => setConfig({
                ...config,
                contact: { ...config.contact, phone: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="tel"
              value={config.contact.whatsapp}
              onChange={(e) => setConfig({
                ...config,
                contact: { ...config.contact, whatsapp: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">E-poçt</label>
          <input
            type="email"
            value={config.contact.email || ''}
            onChange={(e) => setConfig({
              ...config,
              contact: { ...config.contact, email: e.target.value }
            })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">share</span>
            Sosial Media Bağlantıları
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500 text-sm">photo_camera</span>
                Instagram URL
              </label>
              <input
                type="url"
                value={config.instagramUrl || ''}
                onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500 text-sm">public</span>
                Facebook URL
              </label>
              <input
                type="url"
                value={config.facebookUrl || ''}
                onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/page"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">music_note</span>
                TikTok URL
              </label>
              <input
                type="url"
                value={config.tiktokUrl || ''}
                onChange={(e) => setConfig({ ...config, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@username"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-sm">play_circle</span>
                YouTube URL
              </label>
              <input
                type="url"
                value={config.youtubeUrl || ''}
                onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Yenilənir...' : 'Parametrləri Yadda Saxla'}
        </button>
      </form>

      {/* Homepage Content Section */}
      <div className="glass rounded-3xl p-8 shadow-2xl space-y-6 border-2 border-primary/20 slide-up">
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          📝 Ana Səhifə Məzmunu
        </h2>
        
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
            Başlıq (Saf Zəriflik, Əbədi Dəyər)
          </label>
          <input
            type="text"
            value={heroContent.headline || ''}
            onChange={(e) => setHeroContent({ ...heroContent, headline: e.target.value })}
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
            placeholder="Saf Zəriflik, Əbədi Dəyər"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
            Alt Başlıq (Zəriflik və Dəyər)
          </label>
          <input
            type="text"
            value={heroContent.subheadline || ''}
            onChange={(e) => setHeroContent({ ...heroContent, subheadline: e.target.value })}
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
            placeholder="Zəriflik və Dəyər"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
            Açıqlama Mətni
          </label>
          <textarea
            value={heroContent.description || ''}
            onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
            placeholder="Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin."
          />
        </div>

        <button
          onClick={handleSaveHeroContent}
          disabled={updateContentMutation.isPending}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
        >
          {updateContentMutation.isPending ? 'Yenilənir...' : 'Ana Səhifə Məzmununu Yadda Saxla'}
        </button>
      </div>

      {/* About Page Content Section */}
      <div className="glass rounded-3xl p-8 shadow-2xl space-y-6 border-2 border-primary/20 slide-up">
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ℹ️ Haqqımızda Səhifəsi
        </h2>
        
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
            Başlıq
          </label>
          <input
            type="text"
            value={aboutContent.title || ''}
            onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
            placeholder="Haqqımızda"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
            Məzmun
          </label>
          <textarea
            value={aboutContent.content || ''}
            onChange={(e) => setAboutContent({ ...aboutContent, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
            placeholder="Biz ən yüksək keyfiyyətli qızıl məhsulları təqdim etməyə sadiqik..."
          />
        </div>

        <button
          onClick={handleSaveAboutContent}
          disabled={updateContentMutation.isPending}
          className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
        >
          {updateContentMutation.isPending ? 'Yenilənir...' : 'Haqqımızda Məzmununu Yadda Saxla'}
        </button>
      </div>

      {/* Contact Page Info */}
      <div className="glass rounded-3xl p-8 shadow-2xl border-2 border-green-500/30 slide-up">
        <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          📞 Əlaqə Səhifəsi
        </h2>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Əlaqə məlumatları yuxarıdakı "Telefon", "WhatsApp", "E-poçt" və "Sosial Media" bölmələrindən idarə olunur.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          Bu məlumatlar həm əlaqə səhifəsində, həm də saytın digər hissələrində istifadə olunur.
        </p>
      </div>
      </div>
    </div>
  );
};
