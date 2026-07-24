import React, { useState } from 'react';
import { ProductFormData } from '../page';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface ProductManagerProps {
  products: ProductFormData[];
  isLoading: boolean;
  onEdit: (product: ProductFormData) => void;
  onDelete: (name: string) => void;
  onAdd: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, isLoading, onEdit, onDelete, onAdd }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dasbor Manajemen Pakan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Panel kontrol data inventaris dan katalog pakan unggas.</p>
        </div>
        <Button onClick={onAdd} variant="primary">
          + Tambah Produk
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Protein</th>
                <th className="py-4 px-6">Kategori Umur</th>
                <th className="py-4 px-6">Stok</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-3"></div>
                    Memuat data katalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Tidak ada produk ditemukan.</p>
                    <p className="text-xs">Silakan tambahkan produk baru.</p>
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 transition-colors">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">IMG</span>
                          )}
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">{product.price}</td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">{product.protein || '-'}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{product.age_category}</td>
                    <td className="py-4 px-6">
                      <Badge variant={product.stock > 10 ? 'success' : 'error'}>
                        {product.stock} Sak
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button onClick={() => onEdit(product)} variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button onClick={() => onDelete(product.name)} className="bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 border-error-200 dark:border-error-500/20 hover:bg-error-100 dark:hover:bg-error-500/20 hover:border-error-300 dark:hover:border-error-500/30 transition-colors" size="sm">
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
