import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useState } from 'react';

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7'); // days

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      
      const response = await api.get('/admin/analytics', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data.data;
    },
  });

  const analytics = analyticsData?.analytics || {};
  const popularProducts = analyticsData?.popularProducts || [];
  const deviceAnalytics = analyticsData?.deviceAnalytics || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analitika</h1>
          <p className="text-gray-600 dark:text-gray-400">Biznesinizin performans statistikası</p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="7">Son 7 gün</option>
          <option value="30">Son 30 gün</option>
          <option value="90">Son 90 gün</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Ümumi Ziyarətçilər</p>
          <p className="text-3xl font-bold">{analytics?.totalSessions || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Unikal: {analytics?.uniqueVisitors || 0}</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-blue-500 text-3xl">pageview</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Səhifə Baxışları</p>
          <p className="text-3xl font-bold">{analytics?.totalPageViews || 0}</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-purple-500 text-3xl">shopping_bag</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Məhsul Baxışları</p>
          <p className="text-3xl font-bold">{analytics?.totalProductViews || 0}</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-green-500 text-3xl">call</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Sorğular</p>
          <p className="text-3xl font-bold">{analytics?.totalInquiries || 0}</p>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">trending_up</span>
          Konversiya Dərəcəsi
        </h2>
        <div className="flex items-end gap-4">
          <div className="text-6xl font-bold gradient-text">
            {analytics?.conversionRate?.toFixed(1) || 0}%
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analytics?.totalInquiries || 0} sorğu / {analytics?.totalSessions || 0} ziyarətçi
            </p>
          </div>
        </div>
        <div className="mt-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
            style={{ width: `${Math.min(analytics?.conversionRate || 0, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">devices</span>
            Cihaz Növləri
          </h3>
          <div className="space-y-3">
            {deviceAnalytics.length > 0 ? (
              deviceAnalytics.map((device: any) => {
                const total = deviceAnalytics.reduce((sum: number, d: any) => sum + d.count, 0);
                const percentage = total > 0 ? ((device.count / total) * 100).toFixed(1) : 0;
                return (
                  <div key={device._id} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {device._id === 'mobile' ? 'Mobil' : 
                       device._id === 'desktop' ? 'Desktop' : 
                       device._id === 'tablet' ? 'Planşet' : device._id}
                    </span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">Məlumat yoxdur</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            Populyar Məhsullar
          </h3>
          <div className="space-y-3">
            {popularProducts.length > 0 ? (
              popularProducts.slice(0, 5).map((item: any, index: number) => (
                <div key={item.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {item.product?.name || 'Məhsul'}
                    </span>
                  </div>
                  <span className="font-semibold">{item.viewCount} baxış</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Məlumat yoxdur</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
