import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { ContactButtons } from '../components/ContactButtons';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { az } from '../i18n/az';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.data.product;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20">Məhsul tapılmadı</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-primary">Ana Səhifə</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">{az.products}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden">
              {product.images[selectedImage] && (
                <img
                  src={product.images[selectedImage].large}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.thumbnail}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold font-serif mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary">
                {product.price.toLocaleString('az-AZ')} {az.currency}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {az.weight}: {product.weight}
              </p>
            </div>

            <div className="mb-8">
              <ContactButtons productName={product.name} />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{az.description}</h3>
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{az.specifications}</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <dt className="text-gray-600 dark:text-gray-400">{az.purity}</dt>
                    <dd className="font-semibold">{product.purity}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <dt className="text-gray-600 dark:text-gray-400">{az.weight}</dt>
                    <dd className="font-semibold">{product.weight}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <dt className="text-gray-600 dark:text-gray-400">{az.category}</dt>
                    <dd className="font-semibold">{az[product.category as keyof typeof az] || product.category}</dd>
                  </div>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <dt className="text-gray-600 dark:text-gray-400">{key}</dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold font-serif mb-8">Oxşar Məhsullar</h2>
          {/* Will be populated with related products */}
        </div>
      </div>
    </div>
  );
};
