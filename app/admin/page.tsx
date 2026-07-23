'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Product } from '../../context/CartContext';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  price: string;
  protein: string;
  age_category: string;
  description: string;
  stock: number;
  image_url: string;
}

interface OrderData {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  items: string;
  total_price: number;
  status: string;
  created_at: string;
}

const initialFormState: ProductFormData = {
  name: '',
  price: '',
  protein: '',
  age_category: '',
  description: '',
  stock: 0,
  image_url: '',
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchProducts = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        toast.error("Gagal mengambil data produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const confirmOrder = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/orders/${id}/confirm`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Pesanan dikonfirmasi!");
        fetchOrders();
      } else {
        toast.error("Gagal mengkonfirmasi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductFormData) => {
    setEditingProduct(product.name);
    setFormData(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = editingProduct 
      ? `${apiUrl}/api/admin/products/${encodeURIComponent(editingProduct)}`
      : `${apiUrl}/api/admin/products`;
    
    const method = editingProduct ? 'PUT' : 'POST';

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        closeModal();
        fetchProducts(); // Refresh data
      } else {
        toast.error(data.detail || "Gagal menyimpan produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan produk");
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    const token = localStorage.getItem('admin_token');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/admin/products/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.detail || "Gagal menghapus produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">Cipta Sama Abadi<span className="text-brand-500">.</span></h1>
              <span className="hidden sm:inline-block px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">Admin Portal</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/" className="text-slate-300 hover:text-white text-sm font-medium transition-colors hidden sm:block">
                Lihat Website
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-sm shadow-sm">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold leading-tight">Admin Utama</p>
                  <p className="text-xs text-slate-400">admin@ciptasama.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-base transition-colors ${activeTab === 'products' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              Katalog Produk
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-base transition-colors ${activeTab === 'orders' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              Pesanan Masuk
            </button>
          </nav>
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Dasbor Manajemen Pakan</h2>
                <p className="text-sm text-slate-500 mt-1">Panel kontrol data inventaris dan katalog pakan unggas.</p>
              </div>
              <div className="space-x-4">
                <button 
                  onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                >
                  Logout
                </button>
                <button 
                  onClick={openAddModal}
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium text-sm"
                >
                  + Tambah Produk
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-6">Nama Produk</th>
                      <th className="py-3 px-6">Harga</th>
                      <th className="py-3 px-6">Protein</th>
                      <th className="py-3 px-6">Kategori Umur</th>
                      <th className="py-3 px-6">Stok</th>
                      <th className="py-3 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          Memuat data katalog...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          Tidak ada produk ditemukan.
                        </td>
                      </tr>
                    ) : (
                      products.map((product, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6 font-medium text-slate-900">
                            <div className="flex items-center">
                              {product.image_url && (
                                <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                              )}
                              {product.name}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold">{product.price}</td>
                          <td className="py-4 px-6 text-slate-500">{product.protein || 'N/A'}</td>
                          <td className="py-4 px-6 text-slate-500">{product.age_category}</td>
                          <td className="py-4 px-6 text-slate-500">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-3">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="text-slate-500 hover:text-slate-900 font-medium"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(product.name)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Pesanan Masuk</h2>
              <button 
                onClick={fetchOrders}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
              >
                Muat Ulang
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID & Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Pesanan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingOrders ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          Memuat data pesanan...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          Belum ada pesanan masuk.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        let parsedItems = [];
                        try { parsedItems = JSON.parse(order.items); } catch(e){}
                        
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="font-bold">#{order.id}</div>
                              <div className="text-gray-500 text-xs">{order.created_at}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="font-semibold">{order.customer_name}</div>
                              <div className="text-gray-500">{order.phone}</div>
                              <div className="text-gray-400 text-xs mt-1 truncate max-w-xs">{order.address}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <ul className="list-disc list-inside">
                                {parsedItems.map((it: any, i: number) => (
                                  <li key={i} className="truncate max-w-xs">{it.name} (x{it.quantity})</li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              Rp {order.total_price.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status === 'confirmed' ? 'Dikonfirmasi' : 'Tertunda'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {order.status === 'pending' && (
                                <button 
                                  onClick={() => confirmOrder(order.id)}
                                  className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded shadow-sm transition-colors"
                                >
                                  Konfirmasi
                                </button>
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
          </>
        )}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-800 text-white px-6 py-4">
              <h3 className="text-lg font-bold">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: BR11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Teks)</label>
                  <input required type="text" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Rp 450.000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                  <input required type="text" name="protein" value={formData.protein} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="21%" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Umur</label>
                  <input required type="text" name="age_category" value={formData.age_category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Starter (0-4 weeks)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Penjelasan singkat fungsi pakan..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Gambar (URL) opsional</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm">
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
