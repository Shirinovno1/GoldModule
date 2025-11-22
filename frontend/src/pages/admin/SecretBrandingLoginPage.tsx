import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const SecretBrandingLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/auth/login', { email, password });
      if (response.data.success) {
        // No localStorage storage - session managed by HTTP-only cookies
        const userRole = response.data.data.user?.role;
        
        // Smart routing based on user role
        if (userRole === 'super_admin') {
          // Super admin goes to secret branding page
          navigate('/admin/secret-branding');
        } else {
          // Regular admin goes to dashboard
          navigate('/admin/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Giriş uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pulse"></div>
      </div>

      <div className="relative max-w-md w-full mx-4 px-4 sm:px-0">
        {/* Card with glass effect */}
        <div className="glass rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-xl border-2 border-primary/30 slide-up hover-lift">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8 scale-up">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl hover-lift glow">
              <span className="material-symbols-outlined text-white text-4xl">lock</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-center mb-3 slide-down">
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-accent bg-clip-text text-transparent">
              Gizli Panel
            </span>
          </h1>
          <p className="text-center text-base font-semibold text-gray-300 mb-6 slide-down stagger-1">
            Brending parametrlərinə daxil olun
          </p>
          
          <div className="mb-8 p-4 bg-blue-500/20 border-2 border-blue-500/40 text-blue-400 rounded-2xl slide-down">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined">security</span>
              <span className="font-bold text-sm">Təhlükəsizlik Bildirişi</span>
            </div>
            <p className="text-xs font-semibold">Sessiya 30 dəqiqə sonra avtomatik bitəcək. Yenidən giriş etməli olacaqsınız.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/40 text-red-400 rounded-2xl slide-down font-semibold">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3 slide-right stagger-1">
              <label className="block text-base font-bold text-white">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-black text-white border-2 border-primary/50 rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none font-semibold text-base"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 slide-right stagger-2">
              <label className="block text-base font-bold text-white">
                Şifrə
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xl">
                  key
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-black text-white border-2 border-primary/50 rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 outline-none font-semibold text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-primary via-yellow-400 to-accent text-black rounded-2xl font-black text-lg hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-primary/50 flex items-center justify-center gap-3 scale-up stagger-3"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                  <span>Yüklənir...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">login</span>
                  <span>Daxil ol</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center slide-up stagger-4">
            <p className="text-sm font-semibold text-gray-400">
              🔒 Təhlükəsiz giriş sistemi
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};
