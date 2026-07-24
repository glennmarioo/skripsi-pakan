import React from 'react';
import { OrderData } from '../page';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface OrderManagerProps {
  orders: OrderData[];
  isLoading: boolean;
  onRefresh: () => void;
  onConfirm: (id: number) => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, isLoading, onRefresh, onConfirm }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pesanan Masuk</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftar pesanan dari pelanggan melalui WhatsApp.</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          Muat Ulang
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">
                <th className="py-4 px-6">ID & Waktu</th>
                <th className="py-4 px-6">Pelanggan</th>
                <th className="py-4 px-6">Item Pesanan</th>
                <th className="py-4 px-6">Total Bayar</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-3"></div>
                    Memuat data pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm mx-auto p-6 transition-colors">
                      <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Belum ada pesanan masuk.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  let parsedItems = [];
                  try { parsedItems = JSON.parse(order.items); } catch(e){}
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">#{order.id}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-medium">{order.created_at}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">{order.customer_name}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">{order.phone}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 max-w-[150px] truncate" title={order.address}>{order.address}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-2 rounded-lg transition-colors">
                          {parsedItems.map((it: any, i: number) => (
                            <div key={i} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex justify-between gap-4">
                              <span className="truncate max-w-[120px]">{it.name}</span>
                              <span className="text-slate-400 dark:text-slate-500 font-bold">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-600 dark:text-brand-400 bg-slate-50/50 dark:bg-slate-800/20">
                        Rp {order.total_price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={order.status === 'confirmed' ? 'success' : 'warning'}>
                          {order.status === 'confirmed' ? 'Dikonfirmasi' : 'Tertunda'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {order.status === 'pending' && (
                          <Button 
                            onClick={() => onConfirm(order.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            size="sm"
                          >
                            Konfirmasi
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
