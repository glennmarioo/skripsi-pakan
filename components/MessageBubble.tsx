import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, RecommendedProduct } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { Button } from './ui/Button';

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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:border-brand-300 transition-colors">
      {product.image_url && (
        <div className="mb-3 w-full h-32 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
          <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        </div>
      )}
      <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">{product.name}</h4>
      <div className="flex justify-between items-center mb-3">
        <p className="text-brand-600 dark:text-brand-400 font-bold text-sm">{typeof product.price === 'number' ? `Rp ${product.price.toLocaleString('id-ID')}` : product.price}</p>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">Sisa {product.stock}</span>
      </div>
      <Button
        onClick={handleAddToCart}
        variant="secondary"
        size="sm"
        className="w-full"
      >
        Tambah ke Keranjang
      </Button>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} items-end mb-4`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
        message.role === 'user' ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-brand-500 text-white'
      }`}>
        {message.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm transition-colors ${
          message.role === 'user'
            ? 'bg-slate-900 dark:bg-slate-800 text-white rounded-br-sm shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm'
        }`}
      >
        <div className={`prose prose-sm max-w-none leading-relaxed ${message.role === 'user' ? 'prose-invert text-white' : 'prose-slate dark:prose-invert'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        
        {message.role === 'assistant' && message.recommended_products && message.recommended_products.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.recommended_products.map((product, index) => (
              <MiniProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};