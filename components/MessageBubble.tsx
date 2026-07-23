import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, RecommendedProduct } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

interface MiniProductCardProps {
  product: RecommendedProduct;
}

const MiniProductCard: React.FC<MiniProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartProduct = {
      name: product.name,
      price: typeof product.price === 'number' ? `Rp ${product.price.toLocaleString('id-ID')}` : product.price,
      stock: product.stock,
      age_category: '', // Not available in recommended products
      protein: '', // Not available in recommended products
      description: '', // Not available in recommended products
      image_url: product.image_url,
    };
    addToCart(cartProduct);
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      {product.image_url && (
        <div className="mb-3 w-full h-32 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
          <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        </div>
      )}
      <h4 className="font-bold text-slate-900 mb-1 text-sm">{product.name}</h4>
      <div className="flex justify-between items-center mb-3">
        <p className="text-brand-600 font-bold text-sm">{typeof product.price === 'number' ? `Rp ${product.price.toLocaleString('id-ID')}` : product.price}</p>
        <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-full">Stok: {product.stock}</span>
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full bg-slate-900 text-white font-medium py-2 px-3 rounded-lg text-xs hover:bg-slate-800 shadow-sm transition-colors"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''} items-end mb-4`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm ${
        message.role === 'user' ? 'bg-slate-900 text-white' : 'bg-brand-500 text-white'
      }`}>
        {message.role === 'user' ? 'U' : 'AI'}
      </div>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          message.role === 'user'
            ? 'bg-slate-900 text-white rounded-br-sm shadow-sm'
            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white' : 'prose-slate'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.role === 'assistant' && message.recommended_products && message.recommended_products.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.recommended_products.map((product, index) => (
              <MiniProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};