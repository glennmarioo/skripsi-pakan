'use client';

import React from 'react';
import Image from 'next/image';
import { useCart, Product } from '../context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA4IDMwQzIuOSAxOCAxLjEgMTcgMSAxNlY0QzEgMi45IDIuOSAyIDQgMkMxMC4yIDIgMTIgMkgxMlpNMTIgMTJDMTMuNjUgMTIgMTUgMTMuMzUgMTUgMTVWMTVDMTUgMTYuNjUgMTMuNjUgMTggMTIgMThDMTMuNjUgMTggMTUgMTYuNjUgMTUgMTVWMTVDMTUgMTMuMzUgMTMuNjUgMTIgMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo="}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.age_category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
            Protein: {product.protein}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-700">{product.price}</span>
          <span className={`text-sm font-medium ${product.stock && product.stock < 20 ? 'text-red-600' : 'text-gray-700'}`}>
            Stok: {product.stock} sak
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full mt-auto bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};