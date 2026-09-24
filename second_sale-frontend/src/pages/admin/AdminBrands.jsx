import { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Sparkles,
  Plus,
  Search,
  Upload,
  Trash2,
  Edit2,
  X,
  Check,
  RefreshCw,
  ExternalLink,
  Layers,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'mobile', label: 'Mobile / Phone' },
  { id: 'tablet', label: 'Tablet / iPad' },
  { id: 'laptop', label: 'Laptop' },
  { id: 'mac', label: 'iMac / Mac' },
  { id: 'earbuds', label: 'Earbuds & Audio' },
  { id: 'smartwatch', label: 'Smartwatch' },
  { id: 'console', label: 'Gaming Console' },
  { id: 'tv', label: 'Television' },
];

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingBrand, setEditingBrand] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    categories: ['mobile'],
    color: '#087F8C',
    isActive: true,
    order: 0,
    description: '',
  });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBrands();
      setBrands(res.data || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
      showFeedback('error', 'Failed to load brand directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Filtered list
  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchesSearch =
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.slug?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        (Array.isArray(b.categories) &&
          (b.categories.includes(selectedCategory) ||
            (selectedCategory === 'console' && b.categories.includes('gaming')) ||
            (selectedCategory === 'gaming' && b.categories.includes('console'))));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && b.isActive) ||
        (statusFilter === 'inactive' && !b.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [brands, search, selectedCategory, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = brands.length;
    const active = brands.filter((b) => b.isActive).length;
    const withLogo = brands.filter((b) => b.logo && b.logo.trim().length > 0).length;
    const totalModels = brands.reduce((acc, b) => acc + (b.modelCount || 0), 0);
    return { total, active, withLogo, totalModels };
  }, [brands]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      logo: '',
      categories: ['mobile'],
      color: '#087F8C',
      isActive: true,
      order: brands.length + 1,
      description: '',
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (brand) => {
    setModalMode('edit');
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      logo: brand.logo || '',
      categories: Array.isArray(brand.categories) && brand.categories.length > 0 ? brand.categories : ['mobile'],
      color: brand.color || '#087F8C',
      isActive: brand.isActive !== undefined ? brand.isActive : true,
      order: brand.order || 0,
      description: brand.description || '',
    });
    setIsModalOpen(true);
  };

  // Auto slug generation from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const newForm = { ...formData, name };
    if (modalMode === 'create' || !formData.slug) {
      newForm.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    setFormData(newForm);
  };

  // Upload Logo file to Cloudinary
  const handleUploadLogoFile = async (file) => {
    if (!file) return;
    try {
      setUploadingLogo(true);
      const fd = new FormData();
      fd.append('logo', file);
      const res = await adminService.uploadBrandLogo(fd);
      if (res.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, logo: res.data.imageUrl }));
        showFeedback('success', 'Brand logo uploaded successfully to Cloudinary!');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      showFeedback('error', err.response?.data?.message || 'Failed to upload brand logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Quick 1-click logo upload from card
  const handleQuickUploadCardLogo = async (brandId, file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('logo', file);
      const uploadRes = await adminService.uploadBrandLogo(fd);
      if (uploadRes.data?.imageUrl) {
        const updateRes = await adminService.updateBrand(brandId, { logo: uploadRes.data.imageUrl });
        setBrands((prev) => prev.map((b) => (b._id === brandId ? updateRes.data.brand : b)));
        showFeedback('success', 'Logo updated successfully!');
      }
    } catch (err) {
      console.error('Quick upload error:', err);
      showFeedback('error', 'Failed to upload brand logo');
    }
  };

  // Category toggle in form
  const toggleCategoryInForm = (catId) => {
    const current = [...formData.categories];
    const index = current.indexOf(catId);
    if (index > -1) {
      if (current.length === 1) {
        showFeedback('error', 'Brand must belong to at least one category');
        return;
      }
      current.splice(index, 1);
    } else {
      current.push(catId);
    }
    setFormData({ ...formData, categories: current });
  };

  // Toggle brand active status from card
  const handleToggleActive = async (brand) => {
    try {
      const updatedStatus = !brand.isActive;
      const res = await adminService.updateBrand(brand._id, { isActive: updatedStatus });
      setBrands((prev) => prev.map((b) => (b._id === brand._id ? { ...b, isActive: updatedStatus } : b)));
      showFeedback('success', `Brand "${brand.name}" is now ${updatedStatus ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error('Toggle active error:', err);
      showFeedback('error', 'Failed to update brand status');
    }
  };

  // Submit modal form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showFeedback('error', 'Brand name is required');
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await adminService.createBrand(formData);
        setBrands((prev) => [res.data.brand, ...prev]);
        showFeedback('success', `Brand "${formData.name}" created successfully!`);
      } else {
        const res = await adminService.updateBrand(editingBrand._id, formData);
        setBrands((prev) => prev.map((b) => (b._id === editingBrand._id ? { ...b, ...res.data.brand } : b)));
        showFeedback('success', `Brand "${formData.name}" updated successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save brand error:', err);
      showFeedback('error', err.response?.data?.message || 'Failed to save brand');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (brand) => {
    if (!window.confirm(`Are you sure you want to delete brand "${brand.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminService.deleteBrand(brand._id);
      setBrands((prev) => prev.filter((b) => b._id !== brand._id));
      showFeedback('success', `Brand "${brand.name}" deleted.`);
    } catch (err) {
      console.error('Delete brand error:', err);
      showFeedback('error', 'Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all animate-bounce ${
            feedback.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Brand Directory & Logos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#087F8C]/10 text-[#087F8C]">
              {brands.length} Brands
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload official brand logos, assign categories, and control which brands appear in device trade-in pages and mega menus.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#087F8C] hover:bg-[#066772] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none shrink-0"
        >
          <Plus size={16} />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Brands</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Brands</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Custom Logos Uploaded</p>
          <p className="text-2xl font-black text-teal-700 mt-1">{stats.withLogo}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Active Device Models</p>
          <p className="text-2xl font-black text-indigo-700 mt-1">{stats.totalModels}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search brands by name or slug (e.g. Apple, Nothing, Bose)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#087F8C] outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-none ${
              selectedCategory === 'all'
                ? 'bg-[#087F8C] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-none ${
                selectedCategory === cat.id
                  ? 'bg-[#087F8C] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={28} className="animate-spin text-[#087F8C] mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading Brand Directory...</p>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
          <Sparkles size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No brands match your filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBrands.map((b) => (
            <div
              key={b._id}
              className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between relative group ${
                b.isActive
                  ? 'border-slate-200/90 hover:border-[#087F8C]/40 hover:shadow-md'
                  : 'border-slate-200/60 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Top Bar on Card: Active Badge & Actions */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(b)}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                    b.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Click to toggle active state"
                >
                  {b.isActive ? '● Active' : '○ Inactive'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-slate-500 hover:text-[#087F8C] hover:bg-slate-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBrand(b)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Logo Box & Fast Upload Overlay */}
              <div className="relative group/logo w-full h-24 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-center p-3 mb-3 overflow-hidden">
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xs"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-base font-black text-slate-700">{b.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">No Logo Uploaded</span>
                  </div>
                )}

                {/* Quick Upload Hover overlay */}
                <label
                  className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold text-center gap-1 z-10"
                  title="Upload New Logo"
                >
                  <Upload size={14} />
                  <span>Change Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleQuickUploadCardLogo(b._id, e.target.files?.[0])}
                  />
                </label>
              </div>

              {/* Brand Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 truncate">{b.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">/{b.slug}</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {(b.categories || []).map((catId) => {
                    const label = CATEGORY_OPTIONS.find((c) => c.id === catId)?.label || catId;
                    return (
                      <span
                        key={catId}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {label.split('/')[0].trim()}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom footer on card: Model count & direct Edit button */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#087F8C]">
                  {b.modelCount || 0} {b.modelCount === 1 ? 'model' : 'models'}
                </span>
                <label className="text-[11px] font-bold text-slate-600 hover:text-[#087F8C] inline-flex items-center gap-1 cursor-pointer">
                  <Upload size={11} />
                  <span>{b.logo ? 'Change' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleQuickUploadCardLogo(b._id, e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ADD / EDIT BRAND MODAL ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {modalMode === 'create' ? 'Create New Brand' : `Edit Brand: ${formData.name}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set brand details, upload official logo, and link category routes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Brand Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bose, Nothing, Apple"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-[#087F8C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug (URL Key) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. bose"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-[#087F8C]"
                  />
                </div>
              </div>

              {/* Logo Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Official Brand Logo</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
                  {/* Logo Preview */}
                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-2 shrink-0 overflow-hidden relative">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain filter drop-shadow-2xs"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 text-center">No Logo</span>
                    )}
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                        <RefreshCw size={16} className="animate-spin text-[#087F8C]" />
                      </div>
                    )}
                  </div>

                  {/* Actions & URL Input */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#E8F6F7] text-[#087F8C] text-xs font-bold border border-[#087F8C]/30 cursor-pointer transition-colors shadow-2xs">
                        <Upload size={13} />
                        <span>{formData.logo ? 'Change Logo File' : 'Upload Logo from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadLogoFile(e.target.files?.[0])}
                        />
                      </label>

                      {formData.logo && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: '' })}
                          className="px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 cursor-pointer bg-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste external logo URL (https://...)"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-200 rounded-xl bg-white outline-none focus:border-[#087F8C]"
                    />
                  </div>
                </div>
              </div>

              {/* Categories Assignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Applicable Categories ({formData.categories.length} selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = formData.categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategoryInForm(cat.id)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#087F8C]/10 text-[#087F8C] border-[#087F8C]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat.label.split('/')[0].trim()}</span>
                        {isSelected && <Check size={13} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle & Order */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Trade-in Availability</label>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#087F8C] rounded border-slate-300 focus:ring-[#087F8C]"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {formData.isActive ? 'Active on Trade-in' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingLogo}
                  className="px-5 py-2 bg-[#087F8C] hover:bg-[#066772] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <RefreshCw size={13} className="animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Brand' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
