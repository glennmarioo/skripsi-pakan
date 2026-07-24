import React from 'react';
import { useCart, Product } from '../context/CartContext';
import { toast } from 'sonner';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

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
    <Card hoverable className="flex flex-col h-full group overflow-hidden">
      {product.image_url ? (
        <div className="w-full h-48 bg-slate-100 overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
          <span className="text-slate-400 font-medium">Tidak ada gambar</span>
        </div>
      )}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-4">
            <Badge variant="brand">{product.age_category}</Badge>
            <Badge variant={product.stock && product.stock < 20 ? 'warning' : 'neutral'}>
              Stok: {product.stock}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-brand-600 transition-colors">{product.name}</h3>
          <span className="inline-block text-xs text-slate-500 font-medium mb-3 bg-slate-100 px-2 py-1 rounded-md">Protein: {product.protein}</span>
          <p className="text-sm text-slate-500 line-clamp-3">{product.description}</p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Harga / Sak</span>
            <span className="text-base font-bold text-slate-900">{product.price}</span>
          </div>
          <Button
            onClick={handleAddToCart}
            variant="secondary"
            size="sm"
          >
            Pesan
          </Button>
        </div>
      </div>
    </Card>
  );
};