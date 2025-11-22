import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { az } from '../../i18n/az';

export const LoginPage = () => {
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
        
        // Route based on user role
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Admin Paneli</h1>
        
        <div className="mb-6 p-4 bg-blue-900/30 text-blue-400 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="font-semibold text-sm">Təhlükəsizlik Bildirişi</span>
          </div>
          <p className="text-xs">Sessiya 30 dəqiqə sonra avtomatik bitəcək. Yenidən giriş etməli olacaqsınız.</p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">{az.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">{az.password}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? az.loading : az.login}
          </button>
        </form>
      </div>
    </div>
  );
};
