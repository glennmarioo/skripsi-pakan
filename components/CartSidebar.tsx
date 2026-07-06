'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutForm, CheckoutFormData } from './CheckoutForm';
import { toast } from 'sonner';

export const CartSidebar: React.FC = () => {
  const { state, dispatch, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  if (!state.isCartOpen) return null;

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    try {
      console.log('Attempting checkout with data:', {
        customer: formData,
        items: state.items,
        total: state.total,
      });

      const response = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items: state.items,
          total: state.total,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Checkout result:', result);

      if (result.success) {
        toast.success(
          `Berhasil! Nomor Resi: ${result.resi_number}. Email konfirmasi telah dikirim ke ${formData.email}.`,
          {
            duration: 10000,
            style: {
              background: '#22c55e',
              color: 'white',
              border: 'none',
            },
          }
        );

        clearCart();
        dispatch({ type: 'CLOSE_CART' });
        setShowCheckoutForm(false);
        // Trigger event to refresh product catalog automatically without reloading page
        window.dispatchEvent(new Event('checkoutSuccess'));
      } else {
        toast.error(`Checkout gagal: ${result.message}`, {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Gagal memproses pesanan: ${error.message || 'Connection failed'}. Pastikan backend server sedang berjalan.`, {
        duration: 8000,
        style: {
          background: '#dc2626',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  const handleCloseCheckoutForm = () => {
    setShowCheckoutForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.items.length === 0 ? (
            <p className="text-gray-500 text-center">Keranjang kosong</p>
          ) : (
            state.items.map((item) => (
              <div key={item.product.name} className="flex items-center space-x-4 border-b pb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA4IDMwQzIuOSAxOCAxLjEgMTcgMSAxNlY0QzEgMi45IDIuOSAyIDQgMkMxMC4yIDIgMTIgMkgxMlpNMTIgMTJDMTMuNjUgMTIgMTUgMTMuMzUgMTUgMTVWMTVDMTUgMTYuNjUgMTMuNjUgMTggMTIgMThDMTMuNjUgMTggMTUgMTYuNjUgMTUgMTVWMTVDMTUgMTMuMzUgMTMuNjUgMTIgMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo="
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { name: item.product.name, quantity: item.quantity - 1 } })}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { name: item.product.name, quantity: item.quantity + 1 } })}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.product.name })}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>Rp {state.total.toLocaleString('id-ID')}</span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
            >
              Checkout
            </button>
          </div>
        )}

        <CheckoutForm
          isOpen={showCheckoutForm}
          onClose={handleCloseCheckoutForm}
          onSubmit={handleCheckoutSubmit}
          isProcessing={false}
          cartItems={state.items}
          total={state.total}
        />
      </div>
    </div>
  );
};