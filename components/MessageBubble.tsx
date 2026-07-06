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
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      {product.image_url && (
        <div className="mb-2 w-full h-32 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
          <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        </div>
      )}
      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
      <p className="text-blue-700 font-bold mb-2">{typeof product.price === 'number' ? `Rp ${product.price.toLocaleString('id-ID')}` : product.price}</p>
      <p className="text-sm text-gray-600 mb-2">Stok: {product.stock}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg text-sm hover:bg-blue-700 shadow-sm transition-all"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-700 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-white' : 'prose-blue'}`}>
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