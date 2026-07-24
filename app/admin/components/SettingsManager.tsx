import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

export const SettingsManager: React.FC = () => {
  const [waNumber, setWaNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setWaNumber(data.whatsapp_number || '');
        }
      } catch (error) {
        toast.error('Gagal memuat pengaturan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('admin_token');
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ whatsapp_number: waNumber })
      });
      if (res.ok) {
        toast.success('Pengaturan berhasil disimpan!');
      } else {
        toast.error('Gagal menyimpan pengaturan.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Sistem</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasi variabel global untuk operasional aplikasi.</p>
      </div>

      <Card className="p-6 bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">Integrasi WhatsApp</h3>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full max-w-md"></div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <Input
              label="Nomor WhatsApp Admin (Checkout)"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="6281234567890"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gunakan kode negara (contoh: 62) tanpa tanda plus (+).</p>
            <Button 
              onClick={handleSave} 
              isLoading={isSaving}
              variant="primary"
            >
              Simpan Pengaturan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
