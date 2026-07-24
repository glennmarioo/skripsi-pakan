'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { AdminNavbar } from './components/AdminNavbar';
import { ProductManager } from './components/ProductManager';
import { OrderManager } from './components/OrderManager';
import { SettingsManager } from './components/SettingsManager';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export interface ProductFormData {
  name: string;
  price: string;
  protein: string;
  age_category: string;
  description: string;
  stock: number;
  image_url: string;
}

export interface OrderData {
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
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  
  // Product State
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  
  // Order State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
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
      setIsLoadingProducts(false);
    }
  };

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
    if (activeTab === 'products') fetchProducts();
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

  const handleProductSubmit = async (e: React.FormEvent) => {
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
        fetchProducts();
      } else {
        toast.error(data.detail || "Gagal menyimpan produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan produk");
    }
  };

  const handleDeleteProduct = async (name: string) => {
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminNavbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'products' && (
              <ProductManager 
                products={products}
                isLoading={isLoadingProducts}
                onAdd={openAddModal}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrderManager 
                orders={orders}
                isLoading={isLoadingOrders}
                onRefresh={fetchOrders}
                onConfirm={confirmOrder}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsManager />
            )}
          </div>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <Input 
            label="Nama Produk" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Contoh: BR11" 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Harga (Teks)" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="Rp 450.000" 
              required 
            />
            <Input 
              label="Stok" 
              name="stock" 
              type="number" 
              value={formData.stock.toString()} 
              onChange={handleInputChange} 
              min="0" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Protein" 
              name="protein" 
              value={formData.protein} 
              onChange={handleInputChange} 
              placeholder="21%" 
              required 
            />
            <Input 
              label="Kategori Umur" 
              name="age_category" 
              value={formData.age_category} 
              onChange={handleInputChange} 
              placeholder="Starter (0-4 weeks)" 
              required 
            />
          </div>
          
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows={3} 
              className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400 text-slate-900 border-slate-200 hover:bg-white" 
              placeholder="Penjelasan singkat fungsi pakan..."
            />
          </div>
          
          <Input 
            label="Tautan Gambar (URL) opsional" 
            name="image_url" 
            value={formData.image_url} 
            onChange={handleInputChange} 
            placeholder="https://example.com/image.jpg" 
          />
          
          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" onClick={closeModal} variant="outline">
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Produk
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
