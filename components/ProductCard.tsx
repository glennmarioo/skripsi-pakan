import React from 'react';
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
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
            {product.age_category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stock && product.stock < 20 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
            Stok: {product.stock}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{product.name}</h3>
        <span className="inline-block text-xs text-slate-500 font-medium mb-2 border border-slate-200 px-2 py-0.5 rounded-md">Protein: {product.protein}</span>
        <p className="text-sm text-slate-500 line-clamp-3">{product.description}</p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Harga / Sak</span>
          <span className="text-base font-bold text-slate-900">{product.price}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
        >
          Pesan
        </button>
      </div>
    </div>
  );
};