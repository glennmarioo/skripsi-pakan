import React from 'react';
import { Package, ShoppingBag, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'products' | 'orders' | 'settings') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'products', label: 'Katalog Produk', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: 'Pesanan Masuk', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col z-20 border-r border-slate-800">
      <div className="p-6 h-16 flex items-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white">Cipta Sama Abadi.</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-brand-600 text-white font-medium shadow-md shadow-brand-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error-400 hover:bg-error-500/10 hover:text-error-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
