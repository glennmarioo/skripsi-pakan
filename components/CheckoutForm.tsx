'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Form Pengiriman" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nama Lengkap *"
          placeholder="Masukkan nama lengkap"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          error={errors.nama}
        />

        <Input
          label="Nomor HP *"
          type="tel"
          placeholder="08123456789"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Alamat Lengkap Pengiriman *
          </label>
          <textarea
            value={formData.alamat}
            onChange={(e) => handleChange('alamat', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 ${
              errors.alamat 
                ? 'border-error-500 focus:ring-error-500 bg-error-50/50 dark:bg-error-500/10' 
                : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
            }`}
            placeholder="Jl. Contoh No. 123, Kota, Kode Pos"
          />
          {errors.alamat && (
            <span className="text-xs font-medium text-error-600 dark:text-error-400 animate-fade-in-up">
              {errors.alamat}
            </span>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-2">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.product.name} <span className="text-slate-400 dark:text-slate-500">x{item.quantity}</span></span>
                <span className="font-medium text-slate-900 dark:text-slate-300">Rp {(parseFloat(item.product.price.replace('Rp ', '').replace('.', '')) * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 flex justify-between font-bold text-slate-900 dark:text-white">
            <span>Total Bayar:</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isProcessing}
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white mt-4"
          size="lg"
        >
          {isProcessing ? 'Memproses...' : 'Pesan via WhatsApp 💬'}
        </Button>
      </form>
    </Modal>
  );
};