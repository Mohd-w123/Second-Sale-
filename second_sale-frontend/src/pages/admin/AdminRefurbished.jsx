import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Eye,
  Package, ShoppingBag, Truck, Check, AlertCircle, RefreshCw,
  Sparkles, ExternalLink, ShieldCheck, ChevronRight, X, Layers,
  DollarSign, Smartphone, Laptop, Tablet, Watch, Gamepad2
} from 'lucide-react';
import './admin.css';

const CATEGORIES = [
  { id: 'mobile', label: 'Phone', icon: Smartphone },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'smartwatch', label: 'Smartwatch', icon: Watch },
  { id: 'console', label: 'Gaming Console', icon: Gamepad2 },
];

const INITIAL_FORM_STATE = {
  title: '',
  category: 'mobile',
  brand: '',
  modelName: '',
  slug: '',
  imagesText: '',
  warrantyMonths: 6,
  isFeatured: false,
  isActive: true,
  rating: 4.8,
  conditionGrades: {
    superb: { price: '', originalPrice: '', stock: 5, description: 'Like new condition with zero scratches' },
    veryGood: { price: '', originalPrice: '', stock: 5, description: 'Minimal visible signs of use, fully tested' },
    good: { price: '', originalPrice: '', stock: 5, description: 'Moderate scratches or wear, 100% operational' },
  },
  variants: [
    { storage: '128GB', color: 'Black', colorHex: '#18181b' },
    { storage: '256GB', color: 'Silver', colorHex: '#e4e4e7' },
  ],
  specs: [
    { key: 'Display', value: 'Super Retina XDR OLED' },
    { key: 'Processor', value: 'Bionic Chip' },
    { key: 'Camera', value: '12MP Dual System' },
    { key: 'Battery Health', value: '85%+' },
  ],
  qualityPointsText: '32-point quality check passed\nCertified genuine parts\nProfessionally sanitized',
  inTheBoxText: 'Device\nCompatible Fast Charging Cable\nWarranty Card',
};

export default function AdminRefurbished() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  
  // Products state
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalProducts, setTotalProducts] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [modalTab, setModalTab] = useState('general'); // general | pricing | variants | specs
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState({ orderStatus: '', trackingNumber: '', courierPartner: '' });

  // Load products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (search) params.search = search;
      const res = await adminService.getRefurbishedDevices(params);
      setDevices(res.data.devices || []);
      setTotalProducts(res.data.total || (res.data.devices || []).length);
    } catch (err) {
      console.error('Failed to fetch refurbished products:', err);
      showFeedbackMsg('error', 'Failed to load refurbished products');
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const params = { limit: 50 };
      if (orderStatusFilter) params.status = orderStatusFilter;
      const res = await adminService.getRefurbishedOrders(params);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch refurbished orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab, selectedCategory, search, orderStatusFilter]);

  const showFeedbackMsg = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Generate slug automatically from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setModalTab('general');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (device) => {
    setEditingId(device._id);
    setFormData({
      title: device.title || '',
      category: device.category || 'mobile',
      brand: device.brand || '',
      modelName: device.modelName || '',
      slug: device.slug || '',
      imagesText: (device.images || []).join('\n'),
      warrantyMonths: device.warrantyMonths ?? 6,
      isFeatured: Boolean(device.isFeatured),
      isActive: Boolean(device.isActive),
      rating: device.rating || 4.8,
      conditionGrades: {
        superb: {
          price: device.conditionGrades?.superb?.price || '',
          originalPrice: device.conditionGrades?.superb?.originalPrice || '',
          stock: device.conditionGrades?.superb?.stock ?? 5,
          description: device.conditionGrades?.superb?.description || '',
        },
        veryGood: {
          price: device.conditionGrades?.veryGood?.price || '',
          originalPrice: device.conditionGrades?.veryGood?.originalPrice || '',
          stock: device.conditionGrades?.veryGood?.stock ?? 5,
          description: device.conditionGrades?.veryGood?.description || '',
        },
        good: {
          price: device.conditionGrades?.good?.price || '',
          originalPrice: device.conditionGrades?.good?.originalPrice || '',
          stock: device.conditionGrades?.good?.stock ?? 5,
          description: device.conditionGrades?.good?.description || '',
        },
      },
      variants: device.variants?.length > 0 ? device.variants : [
        { storage: '128GB', color: 'Black', colorHex: '#18181b' }
      ],
      specs: device.specs?.length > 0 ? device.specs : [
        { key: 'Display', value: 'OLED' }
      ],
      qualityPointsText: (device.qualityPoints || []).join('\n'),
      inTheBoxText: (device.inTheBox || []).join('\n'),
    });
    setModalTab('general');
    setShowModal(true);
  };

  // Save Product (Create or Update)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.brand || !formData.modelName || !formData.slug) {
      alert('Please fill in Title, Brand, Model Name, and Slug.');
      return;
    }

    if (!formData.conditionGrades.superb.price || !formData.conditionGrades.good.price) {
      alert('Please fill in at least Superb and Good condition grade prices.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        modelName: formData.modelName.trim(),
        slug: formData.slug.trim().toLowerCase(),
        images: formData.imagesText.split('\n').map((s) => s.trim()).filter(Boolean),
        warrantyMonths: Number(formData.warrantyMonths) || 6,
        isFeatured: Boolean(formData.isFeatured),
        isActive: Boolean(formData.isActive),
        rating: Number(formData.rating) || 4.8,
        conditionGrades: {
          superb: {
            price: Number(formData.conditionGrades.superb.price),
            originalPrice: Number(formData.conditionGrades.superb.originalPrice) || Number(formData.conditionGrades.superb.price) * 1.3,
            stock: Number(formData.conditionGrades.superb.stock) || 0,
            description: formData.conditionGrades.superb.description,
          },
          veryGood: {
            price: Number(formData.conditionGrades.veryGood.price) || Number(formData.conditionGrades.superb.price) * 0.9,
            originalPrice: Number(formData.conditionGrades.veryGood.originalPrice) || Number(formData.conditionGrades.superb.originalPrice),
            stock: Number(formData.conditionGrades.veryGood.stock) || 0,
            description: formData.conditionGrades.veryGood.description,
          },
          good: {
            price: Number(formData.conditionGrades.good.price),
            originalPrice: Number(formData.conditionGrades.good.originalPrice) || Number(formData.conditionGrades.superb.originalPrice),
            stock: Number(formData.conditionGrades.good.stock) || 0,
            description: formData.conditionGrades.good.description,
          },
        },
        variants: formData.variants.filter((v) => v.storage && v.color),
        specs: formData.specs.filter((s) => s.key && s.value),
        qualityPoints: formData.qualityPointsText.split('\n').map((s) => s.trim()).filter(Boolean),
        inTheBox: formData.inTheBoxText.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await adminService.updateRefurbishedDevice(editingId, payload);
        showFeedbackMsg('success', 'Refurbished product updated successfully!');
      } else {
        await adminService.createRefurbishedDevice(payload);
        showFeedbackMsg('success', 'Refurbished product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save refurbished product:', err);
      alert(err.response?.data?.message || 'Error saving product. Please check console.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (device) => {
    try {
      await adminService.deleteRefurbishedDevice(device._id); // soft toggle endpoint
      showFeedbackMsg('success', `Product ${device.isActive ? 'deactivated' : 'activated'}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    }
  };

  // Hard Delete
  const handleDeleteProduct = async (device) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${device.title}"?`)) return;
    try {
      await adminService.deleteRefurbishedDevice(device._id, { hard: 'true' });
      showFeedbackMsg('success', 'Product permanently deleted');
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Add / Remove Variant
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { storage: '128GB', color: 'Black', colorHex: '#000000' }],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, variants: next };
    });
  };

  // Add / Remove Spec
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.specs];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, specs: next };
    });
  };

  // Update Order Status
  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setTrackingData({
      orderStatus: order.orderStatus,
      trackingNumber: order.deliveryDetails?.trackingNumber || '',
      courierPartner: order.deliveryDetails?.courierPartner || '',
    });
    setTrackingModal(true);
  };

  const handleSaveOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await adminService.updateRefurbishedOrderStatus(selectedOrder.orderId, trackingData);
      showFeedbackMsg('success', `Order #${selectedOrder.orderId} updated!`);
      setTrackingModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="admin-content-inner p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`fixed top-5 right-5 z-[3000] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold transition-all ${
          feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header & Main Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="text-blue-600" size={26} />
            Refurbished Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your certified refurbished inventory, condition grade pricing, and customer buy orders.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone size={14} />
            <span>Products Catalog ({totalProducts})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Customer Orders</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PRODUCTS ──────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search & Category Filter */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products by model or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Category selector */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={fetchProducts}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 bg-white cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all border-none cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Refurbished Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="animate-spin mb-2" size={28} />
                <p className="text-sm font-medium">Loading refurbished products...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-base font-bold text-slate-700">No refurbished products found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Get started by adding your first certified refurbished device to the marketplace catalog.
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  + Add Product Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Device Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Condition Grade Pricing</th>
                      <th className="py-3.5 px-4">Total Stock</th>
                      <th className="py-3.5 px-4">Warranty</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {devices.map((device) => {
                      const totalStock = (device.conditionGrades?.superb?.stock || 0) +
                        (device.conditionGrades?.veryGood?.stock || 0) +
                        (device.conditionGrades?.good?.stock || 0);

                      return (
                        <tr key={device._id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Image & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                {device.images?.[0] ? (
                                  <img
                                    src={device.images[0]}
                                    alt={device.title}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Smartphone size={20} className="text-slate-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                                  <span>{device.title}</span>
                                  {device.isFeatured && (
                                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-1.5 py-0.5 rounded-full">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                                  slug: {device.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] capitalize">
                              {device.category}
                            </span>
                            <div className="text-[11px] text-slate-500 font-semibold mt-1">
                              {device.brand}
                            </div>
                          </td>

                          {/* Pricing breakdown */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Superb:</span>
                                <span className="font-extrabold text-slate-900">₹{device.conditionGrades?.superb?.price?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Very Good:</span>
                                <span className="font-semibold text-slate-700">₹{device.conditionGrades?.veryGood?.price?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">Good:</span>
                                <span className="font-semibold text-slate-700">₹{device.conditionGrades?.good?.price?.toLocaleString('en-IN') || '—'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              totalStock > 5
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : totalStock > 0
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {totalStock > 0 ? `${totalStock} units` : 'Out of Stock'}
                            </span>
                          </td>

                          {/* Warranty */}
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {device.warrantyMonths} Months
                          </td>

                          {/* Active / Inactive */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleActive(device)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer transition-colors ${
                                device.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {device.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <a
                                href={`/buy-refurbished/product/${device.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View on Storefront"
                              >
                                <ExternalLink size={15} />
                              </a>
                              <button
                                onClick={() => handleOpenEdit(device)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(device)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Permanently Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: ORDERS ────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              <RefreshCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {ordersLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="animate-spin mb-2" size={28} />
                <p className="text-sm font-medium">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-base font-bold text-slate-700">No refurbished orders yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When customers purchase devices via "Buy Refurbished", their orders will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Product Purchased</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {orders.map((o) => (
                      <tr key={o._id || o.orderId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-blue-600 block">#{o.orderId}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{o.customer?.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{o.customer?.phone}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {o.customer?.city}, {o.customer?.pincode}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{o.item?.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span className="font-semibold">{o.item?.storage}</span>
                            <span>•</span>
                            <span>{o.item?.color}</span>
                            <span>•</span>
                            <span className="capitalize font-bold text-blue-600">{o.item?.conditionGrade}</span>
                          </div>
                          <div className="font-extrabold text-emerald-600 text-sm mt-1">
                            ₹{o.item?.price?.toLocaleString('en-IN')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded font-extrabold uppercase text-[10px] tracking-wider bg-slate-100 text-slate-700">
                            {o.payment?.method}
                          </span>
                          <span className={`block mt-1 text-[11px] font-bold ${
                            o.payment?.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {o.payment?.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize ${
                            o.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            o.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            o.orderStatus === 'confirmed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            o.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {o.orderStatus}
                          </span>
                          {o.deliveryDetails?.trackingNumber && (
                            <span className="block text-[10px] text-slate-400 font-mono mt-1">
                              Trk: {o.deliveryDetails.trackingNumber}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(o)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-blue-200 cursor-pointer"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT PRODUCT ────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingId ? 'Edit Refurbished Device' : 'Add New Refurbished Device'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set up product specifications, storage/color variants, and condition grade pricing.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 gap-2 bg-white shrink-0 overflow-x-auto">
              {[
                { id: 'general', label: '1. General Info' },
                { id: 'pricing', label: '2. Condition Pricing & Stock' },
                { id: 'variants', label: '3. Storage & Colors' },
                { id: 'specs', label: '4. Specs & Details' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id)}
                  className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                    modalTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TAB 1: General Info */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple iPhone 13 (Refurbished)"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Brand *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. iPhone 13"
                        value={formData.modelName}
                        onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. apple-iphone-13"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Warranty (Months)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={formData.warrantyMonths}
                        onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Images (1 URL per line, first image is Primary)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="https://images.unsplash.com/photo-iphone..."
                      value={formData.imagesText}
                      onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span>Active on Website</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span>Featured on Homepage</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Condition Pricing & Stock */}
              {modalTab === 'pricing' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Specify the selling price and available stock for each condition grade (Superb, Very Good, Good).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Superb */}
                    <div className="bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-800 text-sm">Superb</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Like New</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 42999"
                          value={formData.conditionGrades.superb.price}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              superb: { ...formData.conditionGrades.superb, price: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-bold border border-emerald-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Original MRP (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 69900"
                          value={formData.conditionGrades.superb.originalPrice}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              superb: { ...formData.conditionGrades.superb, originalPrice: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-emerald-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Count</label>
                        <input
                          type="number"
                          value={formData.conditionGrades.superb.stock}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              superb: { ...formData.conditionGrades.superb, stock: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-emerald-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    {/* Very Good */}
                    <div className="bg-blue-50/50 border-2 border-blue-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-800 text-sm">Very Good</span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Great Value</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 39999"
                          value={formData.conditionGrades.veryGood.price}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              veryGood: { ...formData.conditionGrades.veryGood, price: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-bold border border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Original MRP (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 69900"
                          value={formData.conditionGrades.veryGood.originalPrice}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              veryGood: { ...formData.conditionGrades.veryGood, originalPrice: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Count</label>
                        <input
                          type="number"
                          value={formData.conditionGrades.veryGood.stock}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              veryGood: { ...formData.conditionGrades.veryGood, stock: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-blue-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    {/* Good */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 text-sm">Good</span>
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">Budget</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 36999"
                          value={formData.conditionGrades.good.price}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              good: { ...formData.conditionGrades.good, price: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Original MRP (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 69900"
                          value={formData.conditionGrades.good.originalPrice}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              good: { ...formData.conditionGrades.good, originalPrice: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock Count</label>
                        <input
                          type="number"
                          value={formData.conditionGrades.good.stock}
                          onChange={(e) => setFormData({
                            ...formData,
                            conditionGrades: {
                              ...formData.conditionGrades,
                              good: { ...formData.conditionGrades.good, stock: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Storage & Colors */}
              {modalTab === 'variants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Storage & Color Variants</span>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 cursor-pointer"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Storage</label>
                          <input
                            type="text"
                            placeholder="e.g. 128GB"
                            value={v.storage}
                            onChange={(e) => handleVariantChange(i, 'storage', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Color Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Midnight Black"
                            value={v.color}
                            onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase">Color Hex</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={v.colorHex || '#000000'}
                              onChange={(e) => handleVariantChange(i, 'colorHex', e.target.value)}
                              className="w-7 h-7 p-0 border-0 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={v.colorHex || ''}
                              onChange={(e) => handleVariantChange(i, 'colorHex', e.target.value)}
                              className="w-14 px-1 py-1 text-[11px] font-mono border border-slate-200 rounded"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg border-none bg-transparent cursor-pointer self-end mb-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Specs & Details */}
              {modalTab === 'specs' && (
                <div className="space-y-4">
                  {/* Specs List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Key Specifications</span>
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 cursor-pointer"
                      >
                        + Add Spec
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Specification (e.g. RAM)"
                            value={s.key}
                            onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                            className="w-1/3 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 8GB Unified)"
                            value={s.value}
                            onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(i)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quality Checklist & In the box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Quality Checkpoints (1 per line)
                      </label>
                      <textarea
                        rows="3"
                        value={formData.qualityPointsText}
                        onChange={(e) => setFormData({ ...formData, qualityPointsText: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        What's in the Box (1 per line)
                      </label>
                      <textarea
                        rows="3"
                        value={formData.inTheBoxText}
                        onChange={(e) => setFormData({ ...formData, inTheBoxText: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  {modalTab !== 'specs' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'general') setModalTab('pricing');
                        else if (modalTab === 'pricing') setModalTab('variants');
                        else if (modalTab === 'variants') setModalTab('specs');
                      }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border-none cursor-pointer"
                    >
                      Next Step →
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 border-none cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: UPDATE ORDER STATUS ──────────────────────────────────── */}
      {trackingModal && selectedOrder && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                Update Order #{selectedOrder.orderId}
              </h3>
              <button
                onClick={() => setTrackingModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg border-none bg-transparent cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Order Status
                </label>
                <select
                  value={trackingData.orderStatus}
                  onChange={(e) => setTrackingData({ ...trackingData, orderStatus: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blue Dart / Delhivery"
                  value={trackingData.courierPartner}
                  onChange={(e) => setTrackingData({ ...trackingData, courierPartner: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tracking Number / AWB
                </label>
                <input
                  type="text"
                  placeholder="e.g. BLD987654321IN"
                  value={trackingData.trackingNumber}
                  onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 border-none cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
