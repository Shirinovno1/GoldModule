import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { az } from '../i18n/az';

export const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const { data, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const params = category ? `?category=${category}` : '';
      const response = await api.get(`/products${params}`);
      return response.data.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-public'],
    queryFn: async () => {
      const response = await api.get('/categories/public');
      return response.data.data.categories;
    },
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold font-serif mb-8">{az.allProducts}</h1>
        
        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {/* "All" filter - not a category, shows all products */}
          <Link
            to="/products"
            className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              !category
                ? 'bg-primary text-black' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Hamisi
          </Link>
          
          {/* Actual categories from database */}
          {categories?.map((cat: any) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                category === cat._id
                  ? 'bg-primary text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : data?.products.length === 0 ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-400">
            {az.noProducts}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.products.map((product: any) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                  {product.images[0] && (
                    <img
                      src={product.images[0].medium}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.purity}</p>
                  <p className="text-lg font-bold text-primary">{product.price.toLocaleString('az-AZ')} {az.currency}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
