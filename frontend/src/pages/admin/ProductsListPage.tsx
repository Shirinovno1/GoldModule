import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { az } from '../../i18n/az';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ProductsListPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products-list'],
    queryFn: async () => {
      const response = await api.get('/products?limit=100');
      return response.data.data.products;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`"${name}" məhsulunu silmək istədiyinizə əminsiniz?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{az.products}</h1>
        <Link
          to="/admin/products/new"
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          {az.addProduct}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Şəkil</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Qiymət</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Kateqoriya</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    {product.images[0] && (
                      <img
                        src={product.images[0].thumbnail}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.price} {az.currency}</td>
                  <td className="px-6 py-4">{az[product.category as keyof typeof az]}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'active' ? 'Aktiv' : 'Qeyri-aktiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {az.edit}
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      {az.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
