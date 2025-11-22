import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { az } from '../../i18n/az';

export const DashboardPage = () => {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data.data.analytics;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await api.get('/products?limit=5');
      return response.data.data.products;
    },
  });

  return (
    <div className="space-y-10 p-4 sm:p-6">
      <div className="slide-down">
        <h1 className="text-5xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Xoş gəldiniz
        </h1>
        <p className="text-xl font-bold text-gray-900 dark:text-white">Biznesinizin icmalı</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl hover-lift scale-up stagger-1 border-2 border-primary/20">
          <p className="text-gray-700 dark:text-gray-300 text-base font-bold mb-3">Ümumi Ziyarətçilər</p>
          <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {analytics?.totalSessions || 0}
          </p>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl hover-lift scale-up stagger-2 border-2 border-primary/20">
          <p className="text-gray-700 dark:text-gray-300 text-base font-bold mb-3">Məhsul Baxışları</p>
          <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {analytics?.totalProductViews || 0}
          </p>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl hover-lift scale-up stagger-3 border-2 border-primary/20">
          <p className="text-gray-700 dark:text-gray-300 text-base font-bold mb-3">Sorğular</p>
          <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {analytics?.totalInquiries || 0}
          </p>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl hover-lift scale-up stagger-4 border-2 border-primary/20">
          <p className="text-gray-700 dark:text-gray-300 text-base font-bold mb-3">Konversiya</p>
          <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {analytics?.conversionRate?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/categories"
          className="glass rounded-3xl p-8 hover-lift shadow-2xl transition-all scale-up stagger-1 border-2 border-primary/20"
        >
          <span className="material-symbols-outlined text-5xl mb-4 text-primary block">category</span>
          <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">Kateqoriyalar</h3>
          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Kateqoriyaları idarə et</p>
        </Link>
        <Link
          to="/admin/products/new"
          className="bg-gradient-to-br from-primary to-accent text-black rounded-3xl p-8 hover-lift shadow-2xl transition-all scale-up stagger-2 border-2 border-primary/30"
        >
          <span className="material-symbols-outlined text-5xl mb-4 block">add_circle</span>
          <h3 className="text-2xl font-black mb-2">{az.addProduct}</h3>
          <p className="text-base font-bold opacity-80">Yeni məhsul əlavə et</p>
        </Link>
        <Link
          to="/admin/products"
          className="glass rounded-3xl p-8 hover-lift shadow-2xl transition-all scale-up stagger-3 border-2 border-primary/20"
        >
          <span className="material-symbols-outlined text-5xl mb-4 text-primary block">inventory</span>
          <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">{az.products}</h3>
          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Məhsulları idarə et</p>
        </Link>
        <Link
          to="/admin/analytics"
          className="glass rounded-3xl p-8 hover-lift shadow-2xl transition-all scale-up stagger-4 border-2 border-primary/20"
        >
          <span className="material-symbols-outlined text-5xl mb-4 text-primary block">bar_chart</span>
          <h3 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">{az.analytics}</h3>
          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Statistikaya bax</p>
        </Link>
      </div>

      {/* Recent Products */}
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-primary/20 slide-up">
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Son Məhsullar
        </h2>
        <div className="space-y-4">
          {products?.map((product: any, index: number) => (
            <div 
              key={product._id} 
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 glass rounded-2xl hover-lift transition-all border border-primary/10 scale-up stagger-${(index % 6) + 1}`}
            >
              {product.images[0] && (
                <img
                  src={product.images[0].thumbnail}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-2xl shadow-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">{product.name}</h3>
                <p className="text-base font-bold text-primary">{product.price} {az.currency}</p>
              </div>
              <Link
                to={`/admin/products/${product._id}`}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-xl hover-lift font-black shadow-lg text-center"
              >
                {az.edit}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
