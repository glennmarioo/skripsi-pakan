'use client';

import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const { state, dispatch } = useCart();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
            PT. Cipta Sama Abadi<span className="text-brand-500">.</span>
          </span>
        </div>
        <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari pakan unggas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/login" className="hidden md:inline-flex px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
            Panel Sistem
          </a>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};