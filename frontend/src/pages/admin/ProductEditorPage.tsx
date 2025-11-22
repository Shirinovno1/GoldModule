import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { az } from '../../i18n/az';

export const ProductEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    weight: '',
    purity: '',
    category: '',
    status: 'active',
    featured: false,
    images: [] as any[],
  });

  const { data: product } = useQuery({
    queryKey: ['product-edit', id],
    queryFn: async () => {
      if (isNew) return null;
      const response = await api.get(`/products/${id}`);
      return response.data.data.product;
    },
    enabled: !isNew,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/admin/categories');
      return response.data.data.categories;
    },
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else if (isNew && categories && categories.length > 0) {
      // Set first category as default for new products
      setFormData(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [product, categories, isNew]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isNew) {
        return api.post('/admin/products', data);
      } else {
        return api.put(`/admin/products/${id}`, data);
      }
    },
    onSuccess: () => {
      alert('Məhsul uğurla yadda saxlanıldı!');
      navigate('/admin/products');
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show loading state
    const loadingAlert = `${files.length} şəkil yüklənir...`;
    console.log(loadingAlert);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      console.log(`Adding file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`);
      formData.append('images', file);
    });

    try {
      const response = await api.post('/admin/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.data.images],
        }));

        // Show success message
        let successMessage = `${response.data.data.images.length} şəkil uğurla yükləndi!`;
        if (response.data.warnings && response.data.warnings.length > 0) {
          successMessage += `\n\nXəbərdarlıqlar:\n${response.data.warnings.join('\n')}`;
        }
        alert(successMessage);
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      
      let errorMessage = 'Şəkil yükləmə xətası';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error.message;
        
        // Add details if available
        if (error.response.data.error.details) {
          errorMessage += `\n\nƏtraflı məlumat: ${error.response.data.error.details}`;
        }
      } else if (error.message) {
        errorMessage = `Şəbəkə xətası: ${error.message}`;
      }
      
      alert(errorMessage);
    }

    // Clear the input so the same files can be selected again if needed
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        {isNew ? az.addProduct : az.editProduct}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{az.name}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{az.description}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{az.price} ({az.currency})</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{az.weight}</label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="10 qram"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{az.purity}</label>
            <input
              type="text"
              value={formData.purity}
              onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
              placeholder="99.99%"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kateqoriya</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              required
            >
              <option value="">Kateqoriya seçin</option>
              {categories?.map((category: any) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5"
            />
            <span>Seçilmiş məhsul</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.status === 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'draft' })}
              className="w-5 h-5"
            />
            <span>Aktiv</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Şəkillər</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/tiff,image/bmp,image/gif"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
          />
          <div className="mt-2 text-sm text-gray-500">
            <p>Dəstəklənən formatlar: JPEG, PNG, WebP, TIFF, BMP, GIF</p>
            <p>Maksimum fayl ölçüsü: 100MB | Maksimum fayl sayı: 20</p>
            <p className="text-orange-500 mt-1">⚠️ HEIC formatı dəstəklənmir - JPG və ya PNG istifadə edin</p>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {formData.images.map((img: any, idx: number) => (
              <div key={idx} className="relative">
                <img src={img.thumbnail} alt="" className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    images: formData.images.filter((_, i) => i !== idx)
                  })}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Yadda saxlanılır...' : az.save}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-700 rounded-lg font-semibold hover:opacity-90"
          >
            {az.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};
