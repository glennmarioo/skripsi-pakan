'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../context/CartContext';

interface ProductGridProps {
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/products`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to local data if API is not available
        console.log('Using fallback product data...');
        const fallbackProducts = [
          {
            name: "BR11",
            price: "Rp 450.000",
            stock: 85,
            age_category: "Starter (0-4 weeks)",
            protein: "21%",
            description: "Cocok untuk anak ayam (DOC) fase awal/starter. Membantu pertumbuhan tulang dan daging yang cepat."
          },
          {
            name: "BR12",
            price: "Rp 447.500",
            stock: 120,
            age_category: "Grower (4-8 weeks)",
            protein: "19%",
            description: "Cocok untuk ayam fase pembesaran (grower). Menjaga stamina dan pembentukan postur."
          },
          {
            name: "510/DOC",
            price: "Rp 472.500",
            stock: 110,
            age_category: "Starter (0-4 weeks)",
            protein: "23%",
            description: "Cocok untuk anak ayam (DOC) fase awal/starter. Membantu pertumbuhan tulang dan daging yang cepat."
          }
        ];
        setProducts(fallbackProducts);
        setError(null);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };

    fetchProducts();

    const handleCheckoutSuccess = () => {
      fetchProducts(true); // Refetch in background to avoid loading screen flash
    };

    window.addEventListener('checkoutSuccess', handleCheckoutSuccess);
    return () => window.removeEventListener('checkoutSuccess', handleCheckoutSuccess);
  }, []);

  // Filter products based on search query
  const filteredProducts = searchQuery.trim()
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.age_category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error: {error}</div>
            <div className="text-gray-400">Pastikan backend server sedang berjalan</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-center mb-8 text-blue-800">
          {searchQuery.trim()
            ? `Hasil Pencarian: "${searchQuery}" (${filteredProducts.length} produk)`
            : 'Produk Unggulan Kami'
          }
        </h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={`${product.name}-${index}`} product={product} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Tidak ada produk ditemukan</div>
            <div className="text-gray-400">Coba kata kunci lain atau periksa ejaan</div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Belum ada produk tersedia</div>
            <div className="text-gray-400">Produk akan dimuat dari server</div>
          </div>
        )}
      </div>
    </section>
  );
};