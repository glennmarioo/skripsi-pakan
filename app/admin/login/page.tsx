'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save token to localStorage
        localStorage.setItem('admin_token', data.token);
        toast.success('Login berhasil!');
        router.push('/admin');
      } else {
        toast.error(data.detail || 'Username atau password salah');
      }
    } catch (error) {
      toast.error('Gagal terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/20 rotate-3">
            <Lock className="w-8 h-8 text-white -rotate-3" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Masuk ke sistem manajemen PT Cipta Sama Abadi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="px-8 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-none dark:border dark:border-slate-800 transition-colors">
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              className="w-full"
              size="lg"
            >
              Masuk ke Dashboard
            </Button>
          </form>
        </Card>
        
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} PT Cipta Sama Abadi. All rights reserved.
        </p>
      </div>
    </div>
  );
}
