'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Coffee,
  Check, X, Loader2, Package, Tag, Layers,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { fetchAPI, endpoints, getImageUrl, formatPrice } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function MenuManagement() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    inStock: true,
    order: 0,
    variantTypes: [] as string[]
  });

  const getData = async () => {
    try {
      const [prodData, varData, settings] = await Promise.all([
        fetchAPI(endpoints.products),
        fetchAPI(endpoints.variants),
        fetchAPI(endpoints.settings)
      ]);
      setProducts(prodData);
      setVariants(varData);
      setCurrencySymbol(settings.currencySymbol || '$');
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        inStock: product.inStock,
        order: product.order || 0,
        variantTypes: product.variantTypes?.map((vt: any) => vt._id || vt) || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        inStock: true,
        order: products.length > 0 ? Math.max(...products.map(p => p.order || 0)) + 1 : 0,
        variantTypes: []
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.products}/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.products}`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('category', formData.category);
      data.append('inStock', formData.inStock.toString());
      data.append('order', formData.order.toString());
      data.append('variantTypes', JSON.stringify(formData.variantTypes));
      
      if (imageFile) {
        data.append('image', imageFile);
      } else {
        data.append('imageUrl', formData.imageUrl);
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      setIsModalOpen(false);
      getData();
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchAPI(`${endpoints.products}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      getData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete product');
    }
  };

  const toggleStock = async (product: any) => {
    try {
      await fetchAPI(`${endpoints.products}/${product._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...product, inStock: !product.inStock })
      });
      getData();
    } catch (error: any) {
      alert(error.message || 'Failed to toggle stock');
    }
  };
  
  const handleMoveOrder = async (product: any, direction: 'up' | 'down') => {
    const sortedProducts = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sortedProducts.findIndex(p => p._id === product._id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedProducts.length) return;

    const targetProduct = sortedProducts[targetIndex];

    try {
      let currentOrder = product.order ?? currentIndex;
      let targetOrder = targetProduct.order ?? targetIndex;

      if (currentOrder === targetOrder) {
        currentOrder = currentIndex;
        targetOrder = targetIndex;
      }

      await Promise.all([
        fetchAPI(`${endpoints.products}/${product._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...product, order: targetOrder })
        }),
        fetchAPI(`${endpoints.products}/${targetProduct._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...targetProduct, order: currentOrder })
        })
      ]);

      getData();
    } catch (error: any) {
      alert(error.message || 'Failed to move order');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Menu Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Add, edit, or remove coffee items and variants.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="size-5" /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={getImageUrl(product.imageUrl)} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
              />
              <div className="absolute top-3 right-3 flex gap-2 items-start">
                <button
                  onClick={() => toggleStock(product)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-md ${product.inStock
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                    }`}
                >
                  {product.inStock ? 'In Stock' : 'Sold Out'}
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveOrder(product, 'up'); }}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full text-slate-700 hover:text-primary transition-colors shadow-md border border-primary/10"
                    title="Move Up"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveOrder(product, 'down'); }}
                    className="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full text-slate-700 hover:text-primary transition-colors shadow-md border border-primary/10"
                    title="Move Down"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{product.name}</h3>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">{product.category}</span>
                </div>
                <p className="font-black text-primary text-lg">{formatPrice(product.price)}{currencySymbol}</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4">{product.description}</p>

              <div className="flex flex-wrap gap-1 mb-6">
                {product.variantTypes?.map((vt: any) => (
                  <span key={vt._id} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Tag className="size-2" /> {vt.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-primary/5 flex gap-2">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Edit2 className="size-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/40"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-primary/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price ({currencySymbol})</label>
                    <input
                      type="number" step="0.01"
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="e.g. Cold Drinks"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Display Order</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Image</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        {imageFile ? (
                          <div className="relative size-16 rounded-lg overflow-hidden border border-primary/20 bg-slate-100">
                             <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setImageFile(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg">
                               <X className="size-3" />
                             </button>
                          </div>
                        ) : formData.imageUrl ? (
                          <div className="size-16 rounded-lg overflow-hidden border border-primary/20 bg-slate-100">
                             <img 
                               src={getImageUrl(formData.imageUrl)} 
                               alt="Current" 
                               className="w-full h-full object-cover" 
                             />
                          </div>
                        ) : (
                          <div className="size-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <Package className="size-6" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="bg-slate-50 dark:bg-background-dark border border-dashed border-primary/20 rounded-xl px-4 py-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-all">
                            {imageFile ? 'Change File' : 'Upload Image File'}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-black">OR URL</span></div>
                      </div>
                      <input
                        type="text"
                        placeholder="Paste Image URL"
                        className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        disabled={!!imageFile}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Associated Variants</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {variants.map(v => (
                    <button
                      key={v._id}
                      type="button"
                      onClick={() => {
                        const exists = formData.variantTypes.includes(v._id);
                        setFormData({
                          ...formData,
                          variantTypes: exists
                            ? formData.variantTypes.filter(id => id !== v._id)
                            : [...formData.variantTypes, v._id]
                        });
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${formData.variantTypes.includes(v._id)
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-slate-50 dark:bg-white/5 border-primary/5 text-slate-500'
                        }`}
                    >
                      {formData.variantTypes.includes(v._id) ? <Check className="size-4" /> : <Layers className="size-4" />}
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin size-5" /> : null}
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
