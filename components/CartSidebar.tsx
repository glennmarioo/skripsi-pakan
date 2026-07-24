'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutForm, CheckoutFormData } from './CheckoutForm';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

export const CartSidebar: React.FC = () => {
  const { state, dispatch, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    try {
      setIsCheckingOut(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      let waNumber = "6287819281389"; // fallback
      try {
        const res = await fetch(`${apiUrl}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          waNumber = data.whatsapp_number || waNumber;
        }
      } catch (e) {
        console.error("Failed to fetch WA number", e);
      }
      
      let orderId = "";
      try {
        const orderData = {
          customer_name: formData.nama,
          phone: formData.phone,
          address: formData.alamat,
          items: JSON.stringify(state.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          }))),
          total_price: state.total
        };
        const orderRes = await fetch(`${apiUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        if (orderRes.ok) {
          const orderJson = await orderRes.json();
          orderId = orderJson.id.toString();
        }
      } catch (e) {
        console.error("Failed to save order to DB", e);
      }

      let message = `*HALO CIPTASAMA ABADI* 🐔\n`;
      if (orderId) {
        message += `*ORDER ID: #${orderId}*\n\n`;
      }
      message += `Saya ingin memesan pakan berikut:\n\n`;
      
      state.items.forEach((item, index) => {
        message += `${index + 1}. ${item.product.name} (x${item.quantity}) - ${item.product.price}\n`;
      });
      
      message += `\n*TOTAL: Rp ${state.total.toLocaleString('id-ID')}*\n\n`;
      message += `*Data Pengiriman:*\n`;
      message += `Nama: ${formData.nama}\n`;
      message += `No HP: ${formData.phone}\n`;
      message += `Alamat: ${formData.alamat}\n\n`;
      message += `Mohon info ongkos kirimnya ya. Terima kasih!`;
      
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
      
      window.open(waUrl, '_blank');
      
      clearCart();
      dispatch({ type: 'CLOSE_CART' });
      setShowCheckoutForm(false);
      
      toast.success(
        `Dialihkan ke WhatsApp! Lanjutkan pesanan Anda di sana.`,
        {
          duration: 5000,
          style: {
            background: '#10b981', // success color
            color: 'white',
            border: 'none',
          },
        }
      );
    } catch (error) {
      toast.error(`Terjadi kesalahan saat memproses pesanan.`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCloseCheckoutForm = () => {
    setShowCheckoutForm(false);
  };

  return (
    <>
      <AnimatePresence>
        {state.isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full w-full max-w-md bg-white shadow-floating flex flex-col pointer-events-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Keranjang</h2>
                <button
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {state.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="font-medium">Keranjang masih kosong</p>
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="space-y-6"
                  >
                    {state.items.map((item) => (
                      <motion.div 
                        key={item.product.name} 
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        className="flex items-center space-x-4 border-b border-slate-100 pb-6 last:border-0"
                      >
                        <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                          {item.product.image_url ? (
                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-xs text-slate-400">Pakan</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 leading-tight">{item.product.name}</h3>
                          <p className="text-sm font-semibold text-brand-600 mt-1">{item.product.price}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.product.name })}
                            className="text-error-500 hover:text-error-700 text-xs font-medium"
                          >
                            Hapus
                          </button>
                          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                            <button
                              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { name: item.product.name, quantity: item.quantity - 1 } })}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { name: item.product.name, quantity: item.quantity + 1 } })}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
              
              {state.items.length > 0 && (
                <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-slate-600">Total</span>
                    <span className="font-bold text-slate-900">Rp {state.total.toLocaleString('id-ID')}</span>
                  </div>
                  <Button
                    onClick={handleCheckoutClick}
                    className="w-full"
                    size="lg"
                  >
                    Lanjut Checkout
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CheckoutForm
        isOpen={showCheckoutForm}
        onClose={handleCloseCheckoutForm}
        onSubmit={handleCheckoutSubmit}
        isProcessing={isCheckingOut}
        cartItems={state.items}
        total={state.total}
      />
    </>
  );
};