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
          <h2 className="text-2xl font-bold text-slate-900">Dasbor Manajemen Pakan</h2>
          <p className="text-sm text-slate-500 mt-1">Panel kontrol data inventaris dan katalog pakan unggas.</p>
        </div>
        <Button onClick={onAdd} variant="primary">
          + Tambah Produk
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Nama Produk</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Protein</th>
                <th className="py-4 px-6">Kategori Umur</th>
                <th className="py-4 px-6">Stok</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-3"></div>
                    Memuat data katalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto p-6">
                      <p className="font-medium text-slate-700 mb-1">Tidak ada produk ditemukan.</p>
                      <p className="text-xs">Silakan tambahkan produk baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">IMG</span>
                          )}
                        </div>
                        {product.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">{product.price}</td>
                    <td className="py-4 px-6 font-medium text-slate-500 bg-slate-50/50">{product.protein || '-'}</td>
                    <td className="py-4 px-6 text-slate-600">{product.age_category}</td>
                    <td className="py-4 px-6">
                      <Badge variant={product.stock > 10 ? 'success' : 'error'}>
                        {product.stock} Sak
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button onClick={() => onEdit(product)} variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button onClick={() => onDelete(product.name)} className="bg-error-50 text-error-600 border-error-200 hover:bg-error-100 hover:border-error-300" size="sm">
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
