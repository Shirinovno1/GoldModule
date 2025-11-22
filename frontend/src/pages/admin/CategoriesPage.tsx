import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  subcategories?: Category[];
}

export const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    image: '',
    sortOrder: 0,
    isActive: true,
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await api.get('/admin/categories');
      return response.data.data.categories;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/admin/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      resetForm();
      alert('Kateqoriya uğurla yaradıldı!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || 'Xəta baş verdi');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      resetForm();
      alert('Kateqoriya uğurla yeniləndi!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || 'Xəta baş verdi');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      alert('Kateqoriya uğurla silindi!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || 'Xəta baş verdi');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentCategory: '',
      image: '',
      sortOrder: 0,
      isActive: true,
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategory: category.parentCategory || '',
      image: category.image || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (category: Category) => {
    if (category.productCount > 0) {
      alert('Bu kateqoriyada məhsullar var. Əvvəlcə məhsulları silin.');
      return;
    }
    if (category.subcategories && category.subcategories.length > 0) {
      alert('Bu kateqoriyanın alt kateqoriyaları var. Əvvəlcə onları silin.');
      return;
    }
    if (confirm(`"${category.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
      deleteMutation.mutate(category._id);
    }
  };

  const mainCategories = categories?.filter((cat: Category) => !cat.parentCategory) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-bold text-white">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kateqoriyalar
          </h1>
          <p className="text-gray-400">Məhsul kateqoriyalarını idarə edin</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-xl font-bold hover-lift shadow-lg"
        >
          + Yeni Kateqoriya
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingCategory ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-white">
                  Kateqoriya Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Məsələn: Qızıl Zərgərlik"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">
                  Açıqlama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Kateqoriya haqqında qısa məlumat"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">
                  Kateqoriya Şəkli (URL)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">
                    Ana Kateqoriya
                  </label>
                  <select
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Ana Kateqoriya</option>
                    {mainCategories.map((cat: Category) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">
                    Status
                  </label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="true">Aktiv</option>
                    <option value="false">Deaktiv</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-lg font-bold hover-lift disabled:opacity-50"
                >
                  {editingCategory ? 'Yenilə' : 'Yarat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid gap-6">
        {mainCategories.map((category: Category) => (
          <div key={category._id} className="glass rounded-3xl p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-lg border border-primary/30"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="text-gray-400">
                      {category.productCount} məhsul • Sıralama: {category.sortOrder}
                    </p>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  category.isActive 
                    ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                    : 'bg-red-900/30 text-red-400 border border-red-500/30'
                }`}>
                  {category.isActive ? 'Aktiv' : 'Deaktiv'}
                </span>
                <button
                  onClick={() => handleEdit(category)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Redaktə
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={category.productCount > 0 || (category.subcategories && category.subcategories.length > 0)}
                >
                  Sil
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mt-4 pl-6 border-l-2 border-primary/20">
                <h4 className="text-sm font-bold text-gray-300 mb-2">Alt Kateqoriyalar:</h4>
                <div className="space-y-2">
                  {category.subcategories.map((sub: Category) => (
                    <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {sub.image && (
                          <img 
                            src={sub.image} 
                            alt={sub.name}
                            className="w-8 h-8 object-cover rounded border border-primary/30"
                          />
                        )}
                        <div>
                          <span className="font-semibold text-white">
                            {sub.name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {sub.productCount} məhsul
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Redaktə
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          disabled={sub.productCount > 0}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {mainCategories.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block">category</span>
          <h3 className="text-xl font-bold text-gray-500 mb-2">Hələ kateqoriya yoxdur</h3>
          <p className="text-gray-400 mb-6">İlk kateqoriyanızı yaradın</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-xl font-bold hover-lift"
          >
            Kateqoriya Yarat
          </button>
        </div>
      )}
    </div>
  );
};