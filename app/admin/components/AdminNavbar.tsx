import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
            Admin Portal
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 text-sm font-medium transition-colors">
            <span>Lihat Website</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-white shadow-sm transition-colors">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Admin Utama</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">admin@ciptasama.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
