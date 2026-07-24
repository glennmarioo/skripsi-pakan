'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../context/CartContext';
import { motion, Variants } from 'framer-motion';
import { Skeleton } from './ui/Skeleton';

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <section className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton variant="text" className="h-8 w-64 mb-2" />
            <Skeleton variant="text" className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-4">
                    <Skeleton variant="text" className="h-6 w-24 rounded-full" />
                    <Skeleton variant="text" className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton variant="text" className="h-6 w-3/4 mb-3" />
                  <Skeleton variant="text" className="h-6 w-1/4 mb-3" />
                  <Skeleton variant="text" className="h-16 w-full" />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
                  <Skeleton variant="text" className="h-10 w-24" />
                  <Skeleton variant="text" className="h-10 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="katalog" className="py-12 border-t border-slate-200 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchQuery.trim()
              ? `Hasil Pencarian: "${searchQuery}" (${filteredProducts.length})`
              : 'Etalase Pakan Unggas'
            }
          </h2>
          <p className="text-sm text-slate-500 mt-1">Berdasarkan pembaruan data inventaris terbaru.</p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-error-50 border border-error-200 text-error-700 rounded-xl">
            <div className="text-sm font-medium mb-1">Error: {error}</div>
            <div className="text-xs opacity-80">Pastikan backend server sedang berjalan</div>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div key={`${product.name}-${index}`} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : searchQuery.trim() ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
            <div className="text-slate-600 font-medium mb-1">Tidak ada produk ditemukan</div>
            <div className="text-slate-400 text-sm">Coba kata kunci lain atau periksa ejaan</div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
            <div className="text-slate-600 font-medium mb-1">Belum ada produk tersedia</div>
            <div className="text-slate-400 text-sm">Produk akan dimuat dari server</div>
          </motion.div>
        )}
      </div>
    </section>
  );
};