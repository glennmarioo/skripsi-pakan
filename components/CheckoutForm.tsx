'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CheckoutFormData) => Promise<void>;
  isProcessing: boolean;
  cartItems: any[];
  total: number;
}

export interface CheckoutFormData {
  nama: string;
  phone: string;
  alamat: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  cartItems,
  total,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    nama: '',
    phone: '',
    alamat: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat pengiriman wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit(formData);
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Form Pengiriman</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nama ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor HP *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="08123456789"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap Pengiriman *
            </label>
            <textarea
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.alamat ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jl. Contoh No. 123, Kota, Kode Pos"
            />
            {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Ringkasan Pesanan</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>Rp {(parseFloat(item.product.price.replace('Rp ', '').replace('.', '')) * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:bg-[#128C7E] disabled:bg-green-300 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <span>{isProcessing ? 'Memproses...' : 'Pesan via WhatsApp'}</span>
            {!isProcessing && <span className="text-xl">💬</span>}
          </button>
        </form>
      </div>
    </div>
  );
};