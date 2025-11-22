import { Link, Outlet } from 'react-router-dom';
import { az } from '../i18n/az';
import { ProtectedRoute } from './ProtectedRoute';
import { SessionWarning } from './SessionWarning';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <SessionWarning />
      <div className="min-h-screen bg-black flex">
        {/* Sidebar */}
        <aside className="w-64 glass-strong border-r border-primary/20 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Admin Panel</h2>
          </div>

          <nav className="flex-1 p-4 space-y-3">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-primary/10 hover:border-primary/30"
            >
              <span className="material-symbols-outlined text-primary text-xl">dashboard</span>
              <span>{az.dashboard}</span>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-primary/10 hover:border-primary/30"
            >
              <span className="material-symbols-outlined text-primary text-xl">category</span>
              <span>Kateqoriyalar</span>
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-primary/10 hover:border-primary/30"
            >
              <span className="material-symbols-outlined text-primary text-xl">inventory</span>
              <span>{az.products}</span>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-primary/10 hover:border-primary/30"
            >
              <span className="material-symbols-outlined text-primary text-xl">bar_chart</span>
              <span>{az.analytics}</span>
            </Link>

            {/* Super Admin Only Links */}
            {user?.role === 'super_admin' && (
              <>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-primary/10 hover:border-primary/30"
                >
                  <span className="material-symbols-outlined text-primary text-xl">group</span>
                  <span>İstifadəçilər</span>
                </Link>

                <Link
                  to="/admin/secret-branding"
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all font-semibold text-white border border-red-500/20 hover:border-red-500/40 bg-red-500/10"
                >
                  <span className="material-symbols-outlined text-red-400 text-xl">lock</span>
                  <span className="text-red-400">Gizli Panel</span>
                </Link>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-primary/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl glass hover-lift transition-all text-red-500 font-semibold border border-red-500/20 hover:border-red-500/40"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>{az.logout}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};
