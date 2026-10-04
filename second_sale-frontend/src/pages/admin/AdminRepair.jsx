import { useEffect, useState, useMemo } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Wrench, Search, Plus, Edit3, Trash2, CheckCircle2, Clock,
  Smartphone, ShieldCheck, RefreshCw, X, AlertCircle, Phone,
  MapPin, Calendar, CreditCard, ChevronRight, Filter, Eye, Check,
  Sparkles, Tag, Upload
} from 'lucide-react';
import './admin.css';

const DEFAULT_SERVICES_SCHEMA = {
  screen:        { price: 2999, mrp: 4999, enabled: true, warranty: '6 Months', time: '30-45 mins' },
  battery:       { price: 1499, mrp: 2499, enabled: true, warranty: '6 Months', time: '20-30 mins' },
  front_camera:  { price: 1699, mrp: 2799, enabled: true, warranty: '3 Months', time: '30-45 mins' },
  back_camera:   { price: 3499, mrp: 5499, enabled: true, warranty: '3 Months', time: '30-45 mins' },
  charging_jack: { price: 1299, mrp: 1999, enabled: true, warranty: '3 Months', time: '30-45 mins' },
  mic:           { price: 999,  mrp: 1499, enabled: true, warranty: '3 Months', time: '30 mins' },
  speaker:       { price: 1199, mrp: 1799, enabled: true, warranty: '3 Months', time: '30 mins' },
  receiver:      { price: 899,  mrp: 1299, enabled: true, warranty: '3 Months', time: '30 mins' },
  back_panel:    { price: 1999, mrp: 2999, enabled: false, warranty: '3 Months', time: '45 mins' },
};

const SERVICE_META = [
  { key: 'screen',        label: 'Screen Replacement',   icon: '📱', color: '#087F8C' },
  { key: 'battery',       label: 'Battery Replacement',  icon: '🔋', color: '#10B981' },
  { key: 'front_camera',  label: 'Front Camera',         icon: '📷', color: '#6366F1' },
  { key: 'back_camera',   label: 'Rear Camera Module',   icon: '📷', color: '#8B5CF6' },
  { key: 'charging_jack', label: 'Charging Jack / Port', icon: '🔌', color: '#F59E0B' },
  { key: 'mic',           label: 'Microphone Repair',    icon: '🎙️', color: '#EC4899' },
  { key: 'speaker',       label: 'Speaker Repair',       icon: '🔊', color: '#3B82F6' },
  { key: 'receiver',      label: 'Earpiece Receiver',    icon: '📞', color: '#14B8A6' },
  { key: 'back_panel',    label: 'Back Glass / Panel',   icon: '🔧', color: '#64748B' },
];

const DEFAULT_BRANDS_LIST = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'OnePlus', slug: 'oneplus' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'Vivo', slug: 'vivo' },
  { name: 'Oppo', slug: 'oppo' },
  { name: 'Realme', slug: 'realme' },
  { name: 'Motorola', slug: 'motorola' },
  { name: 'Google', slug: 'google' },
  { name: 'POCO', slug: 'poco' },
  { name: 'iQOO', slug: 'iqoo' },
  { name: 'Nothing', slug: 'nothing' },
  { name: 'Infinix', slug: 'infinix' },
  { name: 'Honor', slug: 'honor' },
  { name: 'Asus', slug: 'asus' },
  { name: 'Nokia', slug: 'nokia' },
];

export default function AdminRepair() {
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'orders' | 'brands'

  // Devices & Pricing state
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalModels: 0,
    totalBrands: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedRevenue: 0,
  });

  // Brands & Logos State
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandError, setBrandError] = useState('');
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    logo: '',
    color: '#087F8C',
    isActive: true,
    sortOrder: 0,
  });

  // Modal State for Add / Edit Device
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    brand: 'Apple',
    brandSlug: 'apple',
    series: '',
    name: '',
    slug: '',
    image: '',
    isActive: true,
    services: JSON.parse(JSON.stringify(DEFAULT_SERVICES_SCHEMA)),
  });
  const [saving, setSaving] = useState(false);
  const [uploadingDeviceImage, setUploadingDeviceImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const fetchStats = async () => {
    try {
      const res = await adminService.getRepairStats();
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch repair stats:', err);
    }
  };

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const res = await adminService.getRepairBrandsAdmin();
      if (Array.isArray(res.data)) {
        setBrands(res.data);
      }
    } catch (err) {
      console.error('Failed to load repair brands:', err);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchDevices = async () => {
    setLoadingDevices(true);
    try {
      const params = {};
      if (selectedBrand !== 'all') params.brandSlug = selectedBrand;
      const res = await adminService.getRepairDevices(params);
      setDevices(res.data?.devices || []);
    } catch (err) {
      console.error('Failed to load devices:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (orderSearch) params.search = orderSearch;
      const res = await adminService.getRepairOrders(params);
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error('Failed to load repair orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch initial stats & devices & brands
  useEffect(() => {
    fetchStats();
    fetchDevices();
    fetchBrands();
  }, [selectedBrand]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'brands') {
      fetchBrands();
    }
  }, [activeTab, selectedStatus]);

  // Open modal for new device
  const handleAddNew = () => {
    setEditingDevice(null);
    setFormData({
      brand: selectedBrand !== 'all' ? (DEFAULT_BRANDS_LIST.find(b => b.slug === selectedBrand)?.name || 'Apple') : 'Apple',
      brandSlug: selectedBrand !== 'all' ? selectedBrand : 'apple',
      series: '',
      name: '',
      slug: '',
      image: '',
      isActive: true,
      services: JSON.parse(JSON.stringify(DEFAULT_SERVICES_SCHEMA)),
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // Open modal for editing
  const handleEditDevice = (device) => {
    setEditingDevice(device);
    
    // Merge existing services with default keys to ensure complete fields
    const mergedServices = {};
    SERVICE_META.forEach(meta => {
      const existing = device.services?.[meta.key];
      mergedServices[meta.key] = {
        price: existing?.price !== undefined ? existing.price : 2499,
        mrp: existing?.mrp !== undefined ? existing.mrp : 3999,
        enabled: existing?.enabled !== undefined ? existing.enabled : true,
        warranty: existing?.warranty || '6 Months',
        time: existing?.time || '30-45 mins',
      };
    });

    setFormData({
      brand: device.brand || 'Apple',
      brandSlug: device.brandSlug || 'apple',
      series: device.series || '',
      name: device.name || '',
      slug: device.slug || '',
      image: device.image || '',
      isActive: device.isActive !== undefined ? device.isActive : true,
      services: mergedServices,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  // Save device
  const handleSaveDevice = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Device model name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        brandSlug: formData.brandSlug || formData.brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      };

      if (editingDevice) {
        await adminService.updateRepairDevice(editingDevice._id, payload);
        showToast(`Updated pricing for ${formData.name}`);
      } else {
        await adminService.createRepairDevice(payload);
        showToast(`Added new model ${formData.name}`);
      }

      setShowModal(false);
      fetchDevices();
      fetchStats();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save repair device');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDeviceImg = async (file) => {
    if (!file) return;
    setUploadingDeviceImage(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await adminService.uploadRepairDeviceImage(fd);
      if (res.data?.imageUrl) {
        setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
        showToast('Device image uploaded to Cloudinary!');
      }
    } catch (err) {
      console.error('Failed to upload device image:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to upload device image');
    } finally {
      setUploadingDeviceImage(false);
    }
  };

  // Delete device
  const handleDeleteDevice = async (device) => {
    if (!window.confirm(`Are you sure you want to delete ${device.name}? This will remove it from the repair page.`)) {
      return;
    }

    try {
      await adminService.deleteRepairDevice(device._id);
      showToast(`Deleted ${device.name}`);
      fetchDevices();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete device');
    }
  };

  // Re-seed default catalog
  const handleResetCatalog = async () => {
    if (!window.confirm('Reset catalog to default Cashify-style brands and models? Any custom edits may be overwritten.')) {
      return;
    }
    try {
      await adminService.seedRepairDefaults();
      showToast('Repair catalog reset with default devices & pricing');
      fetchDevices();
      fetchStats();
    } catch {
      alert('Failed to reset catalog');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus, techName = null, techPhone = null) => {
    setUpdatingOrderId(orderId);
    try {
      const payload = { status: newStatus };
      if (techName !== null) payload.technicianName = techName;
      if (techPhone !== null) payload.technicianPhone = techPhone;

      await adminService.updateRepairOrderStatus(orderId, payload);
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── BRAND & LOGO HANDLERS ─────────────────────────────────────────
  const handleAddNewBrand = () => {
    setEditingBrand(null);
    setBrandForm({
      name: '',
      slug: '',
      logo: '',
      color: '#087F8C',
      isActive: true,
      sortOrder: (brands.length + 1) || 1,
    });
    setBrandError('');
    setShowBrandModal(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name || '',
      slug: brand.slug || '',
      logo: brand.logo || '',
      color: brand.color || '#087F8C',
      isActive: brand.isActive !== undefined ? brand.isActive : true,
      sortOrder: brand.sortOrder || 0,
    });
    setBrandError('');
    setShowBrandModal(true);
  };

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setBrandError('');
    try {
      const fd = new FormData();
      fd.append('logo', file);
      const res = await adminService.uploadRepairBrandLogo(fd);
      if (res.data?.imageUrl) {
        setBrandForm(prev => ({ ...prev, logo: res.data.imageUrl }));
        showToast('Brand logo uploaded to Cloudinary!');
      }
    } catch (err) {
      setBrandError(err.response?.data?.message || 'Failed to upload brand logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    setBrandError('');

    if (!brandForm.name.trim()) {
      setBrandError('Brand name is required');
      return;
    }

    setSavingBrand(true);
    try {
      const payload = {
        ...brandForm,
        name: brandForm.name.trim(),
        slug: brandForm.slug || brandForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      };

      if (editingBrand) {
        await adminService.updateRepairBrand(editingBrand._id || editingBrand.id, payload);
        showToast(`Updated brand & logo for ${payload.name}`);
      } else {
        await adminService.createRepairBrand(payload);
        showToast(`Created new brand ${payload.name}`);
      }

      setShowBrandModal(false);
      fetchBrands();
      fetchStats();
    } catch (err) {
      setBrandError(err.response?.data?.message || 'Failed to save brand');
    } finally {
      setSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!window.confirm(`Are you sure you want to delete ${brand.name}? Models under this brand might not show properly.`)) {
      return;
    }

    try {
      await adminService.deleteRepairBrand(brand._id || brand.id);
      showToast(`Deleted brand ${brand.name}`);
      fetchBrands();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete brand');
    }
  };

  // Filter devices by search locally
  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) return devices;
    return devices.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [devices, searchQuery]);

  // Filter brands by search locally
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const q = brandSearch.toLowerCase();
    return brands.filter(b => 
      b.name?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q)
    );
  }, [brands, brandSearch]);

  const activeBrandsList = useMemo(() => {
    return brands.length > 0 ? brands : DEFAULT_BRANDS_LIST;
  }, [brands]);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#087F8C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-bold text-sm">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#087F8C]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087F8C]/30 text-[#087F8C] text-xs font-black tracking-wider uppercase border border-[#087F8C]/40">
              <Wrench size={13} />
              <span>Doorstep Repair Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Dynamic Mobile Repair & Pricing</h1>
            <p className="text-sm text-gray-400 max-w-xl">
              Control device models, set dynamic repair pricing for screens, batteries, cameras & ports, and manage doorstep technician appointments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetCatalog}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              title="Reset all models to default Cashify-style catalog"
            >
              <RefreshCw size={14} />
              <span>Reset Defaults</span>
            </button>
            {activeTab === 'brands' ? (
              <button
                onClick={handleAddNewBrand}
                className="px-5 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066a75] text-white font-black text-xs transition-all shadow-lg shadow-[#087F8C]/30 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Brand &amp; Logo</span>
              </button>
            ) : (
              <button
                onClick={handleAddNew}
                className="px-5 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066a75] text-white font-black text-xs transition-all shadow-lg shadow-[#087F8C]/30 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Device Model</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div
            onClick={() => setActiveTab('devices')}
            className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/5 cursor-pointer"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Models</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.totalModels || devices.length}</p>
          </div>
          <div
            onClick={() => setActiveTab('brands')}
            className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/5 cursor-pointer"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Brands</p>
            <p className="text-2xl sm:text-3xl font-black text-[#087F8C] mt-1">{brands.length || stats.totalBrands || 16}</p>
          </div>
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/5 cursor-pointer"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{stats.totalBookings || orders.length}</p>
          </div>
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/5 cursor-pointer"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Repairs</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{stats.pendingBookings || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('devices')}
          className={`pb-4 px-3 font-extrabold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'devices'
              ? 'border-[#087F8C] text-[#087F8C]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Smartphone size={16} />
          <span>Device Models &amp; Repair Pricing</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {filteredDevices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('brands')}
          className={`pb-4 px-3 font-extrabold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'brands'
              ? 'border-[#087F8C] text-[#087F8C]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Tag size={16} />
          <span>Brands &amp; Logos</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {brands.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-3 font-extrabold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#087F8C] text-[#087F8C]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Calendar size={16} />
          <span>Doorstep Repair Bookings</span>
          {stats.pendingBookings > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-black animate-pulse">
              {stats.pendingBookings}
            </span>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: DEVICE MODELS & PRICING                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'devices' && (
        <div className="space-y-6">
          {/* Brand Filter Bar & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Brands scrollable list */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedBrand === 'all'
                    ? 'bg-[#087F8C] text-white shadow-md shadow-[#087F8C]/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Brands
              </button>
              {activeBrandsList.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setSelectedBrand(b.slug)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedBrand === b.slug
                      ? 'bg-[#087F8C] text-white shadow-md shadow-[#087F8C]/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search models (e.g. iPhone 15)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#087F8C] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Models Grid */}
          {loadingDevices ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">Loading repair models & prices...</p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-700">No models found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No repair models match your current brand filter or search query. Click below to add one or reset defaults.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-xl bg-[#087F8C] text-white font-bold text-xs"
                >
                  Add Model
                </button>
                <button
                  onClick={handleResetCatalog}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDevices.map((device) => {
                const screenSvc = device.services?.screen;
                const batterySvc = device.services?.battery;
                const cameraSvc = device.services?.back_camera;
                const portSvc = device.services?.charging_jack;

                return (
                  <div
                    key={device._id || device.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Device Header */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-20 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {device.image ? (
                            <img
                              src={device.image}
                              alt={device.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">📱</span>';
                              }}
                            />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-black uppercase">
                              {device.brand}
                            </span>
                            {device.series && (
                              <span className="px-2 py-0.5 rounded-md bg-[#E8F6F7] text-[#087F8C] text-[10px] font-bold">
                                {device.series}
                              </span>
                            )}
                            <span
                              className={`w-2 h-2 rounded-full ${
                                device.isActive !== false ? 'bg-emerald-500' : 'bg-gray-300'
                              }`}
                              title={device.isActive !== false ? 'Active on store' : 'Disabled'}
                            />
                          </div>
                          <h3 className="font-black text-gray-900 text-base leading-tight truncate">
                            {device.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                            Slug: <span className="font-mono text-gray-600">{device.slug}</span>
                          </p>
                        </div>
                      </div>

                      {/* Pricing Snapshot Grid */}
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50/80 rounded-xl p-2.5">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">📱 Screen Repair</span>
                          <span className="font-black text-gray-900 text-sm">
                            ₹{screenSvc?.price ? screenSvc.price.toLocaleString('en-IN') : 'N/A'}
                          </span>
                          {screenSvc?.mrp > screenSvc?.price && (
                            <span className="text-[10px] text-gray-400 line-through ml-1.5">
                              ₹{screenSvc.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-2.5">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">🔋 Battery</span>
                          <span className="font-black text-gray-900 text-sm">
                            ₹{batterySvc?.price ? batterySvc.price.toLocaleString('en-IN') : 'N/A'}
                          </span>
                          {batterySvc?.mrp > batterySvc?.price && (
                            <span className="text-[10px] text-gray-400 line-through ml-1.5">
                              ₹{batterySvc.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-2.5">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">📷 Rear Camera</span>
                          <span className="font-black text-gray-900 text-sm">
                            ₹{cameraSvc?.price ? cameraSvc.price.toLocaleString('en-IN') : 'N/A'}
                          </span>
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-2.5">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">🔌 Charging Jack</span>
                          <span className="font-black text-gray-900 text-sm">
                            ₹{portSvc?.price ? portSvc.price.toLocaleString('en-IN') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <a
                        href={`/repair/${device.brandSlug}/${device.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-gray-400 hover:text-[#087F8C] flex items-center gap-1 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Preview Live</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDevice(device)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#087F8C] hover:text-white text-gray-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Edit Pricing</span>
                        </button>

                        <button
                          onClick={() => handleDeleteDevice(device)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete model"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: DOORSTEP REPAIR BOOKINGS                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status Filter & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Status pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'placed', label: 'Placed' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'technician_assigned', label: 'Tech Assigned' },
                { id: 'in_progress', label: 'In Repair' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === s.id
                      ? 'bg-[#087F8C] text-white shadow-md shadow-[#087F8C]/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search Order ID, name, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchOrders(); }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#087F8C] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Orders List */}
          {loadingOrders ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">Loading repair bookings...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-700">No repair bookings found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No orders match your filter criteria. When users book doorstep repairs, appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusColors = {
                  placed: 'bg-blue-50 text-blue-700 border-blue-200',
                  confirmed: 'bg-amber-50 text-amber-700 border-amber-200',
                  technician_assigned: 'bg-purple-50 text-purple-700 border-purple-200',
                  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                };

                return (
                  <div
                    key={order._id || order.orderId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-[#087F8C] text-sm bg-[#E8F6F7] px-3 py-1 rounded-lg">
                          {order.orderId}
                        </span>
                        {order.repairMode === 'store' ? (
                          <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            🏬 Store Visit (-₹{order.storeDiscount || 350})
                          </span>
                        ) : (
                          <span className="text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                            🏠 Doorstep
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-semibold">
                          Booked on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">Status:</span>
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          <option value="placed">Placed (New)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="technician_assigned">Technician Assigned</option>
                          <option value="in_progress">In Repair</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-1.5 text-xs">
                        <p className="font-black text-gray-400 uppercase tracking-wider text-[10px]">Customer Details</p>
                        <p className="font-extrabold text-gray-900 text-sm">{order.pickup?.name || 'Customer'}</p>
                        <p className="text-gray-600 font-bold flex items-center gap-1.5">
                          <Phone size={13} className="text-[#087F8C]" />
                          <span>{order.pickup?.phone}</span>
                        </p>
                        <p className="text-gray-500 font-medium leading-relaxed flex items-start gap-1.5">
                          <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>
                            {order.pickup?.address}, {order.pickup?.city} — {order.pickup?.pincode}
                          </span>
                        </p>
                      </div>

                      {/* Device & Services */}
                      <div className="space-y-1.5 text-xs">
                        <p className="font-black text-gray-400 uppercase tracking-wider text-[10px]">Device & Issues</p>
                        <p className="font-extrabold text-gray-900 text-sm">
                          {order.device?.brand} {order.device?.modelName}
                        </p>
                        <div className="space-y-1 mt-1">
                          {order.services?.map((svc, i) => (
                            <div key={i} className="flex justify-between items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              <span>• {svc.label}</span>
                              <span className="font-bold text-gray-900">₹{svc.price?.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slot & Payment */}
                      <div className="space-y-1.5 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                        <div className="space-y-1">
                          <p className="font-black text-gray-400 uppercase tracking-wider text-[10px]">Technician Slot</p>
                          <p className="font-extrabold text-gray-900 flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#087F8C]" />
                            <span>{order.pickup?.date} ({order.pickup?.timeSlot})</span>
                          </p>
                          <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                            <CreditCard size={13} className="text-gray-400" />
                            <span>Payment: <strong className="text-gray-800">{order.pickup?.paymentMethod || 'Cash'}</strong></span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-200/60 space-y-1">
                          {order.storeDiscount > 0 && (
                            <div className="flex justify-between items-center text-[11px] text-emerald-700 font-bold">
                              <span>Store Discount:</span>
                              <span>-₹{order.storeDiscount?.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-500">Total Bill:</span>
                            <span className="text-base font-black text-[#087F8C]">
                              ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technician Assignment Bar */}
                    <div className="bg-[#E8F6F7]/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <Wrench size={15} className="text-[#087F8C]" />
                        <span className="font-bold text-gray-700">
                          Assigned Technician: {order.technicianName ? (
                            <strong className="text-gray-900">{order.technicianName} ({order.technicianPhone})</strong>
                          ) : (
                            <span className="text-gray-400 italic">Not assigned yet</span>
                          )}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const name = prompt('Enter technician name:', order.technicianName || '');
                          if (name !== null) {
                            const phone = prompt('Enter technician phone number:', order.technicianPhone || '');
                            handleUpdateOrderStatus(order._id, 'technician_assigned', name, phone || '');
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-[#087F8C] hover:bg-[#066a75] text-white font-extrabold text-[11px] transition-all cursor-pointer"
                      >
                        {order.technicianName ? 'Change Tech' : 'Assign Tech'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: BRANDS & LOGO MANAGEMENT                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          {/* Brand Search & Add Action Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search brand by name or slug..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#087F8C] focus:bg-white transition-all"
              />
              {brandSearch && (
                <button
                  onClick={() => setBrandSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-400 font-bold">{filteredBrands.length} Brands</span>
              <button
                onClick={handleAddNewBrand}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066a75] text-white font-extrabold text-xs transition-all shadow-md shadow-[#087F8C]/20 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Add Brand &amp; Logo</span>
              </button>
            </div>
          </div>

          {/* Brands Grid */}
          {loadingBrands ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#087F8C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">Loading brands &amp; logos...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-700">No brands found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No brand matches "{brandSearch}". Click below to add a new brand or reset catalog defaults.
              </p>
              <button
                onClick={handleAddNewBrand}
                className="mt-4 px-4 py-2 rounded-xl bg-[#087F8C] text-white font-extrabold text-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Plus size={14} /> Add New Brand
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredBrands.map((b) => (
                <div
                  key={b._id || b.id || b.slug}
                  className="bg-white rounded-2xl border border-gray-200/90 hover:border-[#087F8C] hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Logo & Status */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Logo Preview Container */}
                      <div
                        onClick={() => handleEditBrand(b)}
                        className="w-16 h-16 rounded-2xl bg-white border border-gray-200 p-2 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-105 transition-transform flex-shrink-0"
                        title="Click to edit brand logo"
                      >
                        {b.logo ? (
                          <img
                            src={b.logo}
                            alt={b.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerText = b.name?.[0] || '📱';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-black text-gray-400">{b.name?.[0] || '📱'}</span>
                        )}
                      </div>

                      {/* Active Status Badge */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {b.isActive !== false ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Order: #{b.sortOrder || 0}
                        </span>
                      </div>
                    </div>

                    {/* Brand Details */}
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#087F8C] transition-colors flex items-center gap-1.5">
                        <span>{b.name}</span>
                      </h3>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        slug: <strong className="text-gray-600 font-semibold">{b.slug}</strong>
                      </p>

                      {/* Brand Info Chips */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {/* Color swatch */}
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-600">
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: b.color || '#087F8C' }}
                          />
                          <span>{b.color || '#087F8C'}</span>
                        </div>

                        {/* Models Count */}
                        <span className="bg-[#E8F6F7] text-[#087F8C] px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1">
                          <Smartphone size={12} />
                          <span>{b.modelCount !== undefined ? `${b.modelCount} Models` : 'Catalog'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <a
                      href={`/repair/${b.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-gray-400 hover:text-[#087F8C] flex items-center gap-1 transition-colors"
                    >
                      <Eye size={13} />
                      <span>Storefront</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditBrand(b)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#087F8C] hover:text-white text-gray-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Edit brand name, logo, or theme color"
                      >
                        <Edit3 size={13} />
                        <span>Edit Logo</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(b)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete brand"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD / EDIT DEVICE & SERVICE PRICING                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center">
                  <Wrench size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    {editingDevice ? `Edit Pricing — ${formData.name}` : 'Add New Repair Model'}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    Configure device details and specific price/MRP for each repair service.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-800 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDevice} className="space-y-6">
              {/* Basic Device Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => {
                      const selected = activeBrandsList.find(b => b.name === e.target.value);
                      setFormData({
                        ...formData,
                        brand: e.target.value,
                        brandSlug: selected?.slug || e.target.value.toLowerCase(),
                      });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold bg-white focus:outline-none focus:border-[#087F8C]"
                  >
                    {activeBrandsList.map((b) => (
                      <option key={b.slug} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Series (e.g. iPhone 15 Series, Honor 8 Series)</label>
                  <input
                    type="text"
                    placeholder="e.g. Galaxy S Series"
                    value={formData.series || ''}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Model Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                      setFormData({ ...formData, name, slug: autoSlug });
                    }}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">URL Slug *</label>
                  <input
                    type="text"
                    placeholder="iphone-15-pro-max"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://... (or upload file on the right)"
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#087F8C] h-[42px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-600 !mb-0">Upload Image</label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`flex-1 flex items-center justify-center gap-2 h-[42px] px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 hover:border-[#087F8C] cursor-pointer font-bold text-xs text-slate-700 transition-all ${
                      uploadingDeviceImage ? 'opacity-60 cursor-not-allowed' : ''
                    }`}>
                      {uploadingDeviceImage ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#087F8C]" />
                          <span className="text-[#087F8C]">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-[#087F8C]" />
                          <span>{formData.image ? 'Change Image File' : 'Upload from Device'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingDeviceImage}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadDeviceImg(file);
                        }}
                      />
                    </label>

                    {formData.image && (
                      <div className="w-[42px] h-[42px] rounded-xl border border-[#E2E8F0] bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F8C]"></div>
                  </label>
                  <span className="text-xs font-bold text-gray-700">Active on Storefront</span>
                </div>
              </div>

              {/* Service Pricing Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#087F8C]" />
                    <span>Repair Services & Dynamic Pricing</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium">Set Selling Price and Strike-through MRP</span>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  <div className="bg-gray-50 px-4 py-2.5 grid grid-cols-12 gap-3 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <div className="col-span-4">Service</div>
                    <div className="col-span-3">Our Price (₹)</div>
                    <div className="col-span-3">Market MRP (₹)</div>
                    <div className="col-span-2 text-right">Warranty</div>
                  </div>

                  {SERVICE_META.map((meta) => {
                    const current = formData.services[meta.key] || {
                      price: 2499,
                      mrp: 3999,
                      enabled: true,
                      warranty: '6 Months',
                      time: '30-45 mins',
                    };

                    const discount = current.mrp > current.price
                      ? Math.round(((current.mrp - current.price) / current.mrp) * 100)
                      : 0;

                    return (
                      <div key={meta.key} className="px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-gray-50/50 transition-colors">
                        {/* Service Name & Toggle */}
                        <div className="col-span-4 flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={current.enabled !== false}
                            onChange={(e) => {
                              const updated = {
                                ...formData.services,
                                [meta.key]: { ...current, enabled: e.target.checked }
                              };
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-4 h-4 text-[#087F8C] rounded cursor-pointer"
                          />
                          <span className="text-base">{meta.icon}</span>
                          <span className={`text-xs font-bold truncate ${current.enabled !== false ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                            {meta.label}
                          </span>
                        </div>

                        {/* Our Price */}
                        <div className="col-span-3">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                            <input
                              type="number"
                              disabled={current.enabled === false}
                              value={current.price || ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = {
                                  ...formData.services,
                                  [meta.key]: { ...current, price: val }
                                };
                                setFormData({ ...formData, services: updated });
                              }}
                              className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-xl text-xs font-black text-[#087F8C] focus:outline-none focus:border-[#087F8C] disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        {/* MRP */}
                        <div className="col-span-3">
                          <div className="relative flex items-center gap-2">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                            <input
                              type="number"
                              disabled={current.enabled === false}
                              value={current.mrp || ''}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = {
                                  ...formData.services,
                                  [meta.key]: { ...current, mrp: val }
                                };
                                setFormData({ ...formData, services: updated });
                              }}
                              className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 focus:outline-none focus:border-[#087F8C] disabled:bg-gray-100"
                            />
                            {discount > 0 && current.enabled !== false && (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {discount}% off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Warranty */}
                        <div className="col-span-2 text-right">
                          <select
                            disabled={current.enabled === false}
                            value={current.warranty || '6 Months'}
                            onChange={(e) => {
                              const updated = {
                                ...formData.services,
                                [meta.key]: { ...current, warranty: e.target.value }
                              };
                              setFormData({ ...formData, services: updated });
                            }}
                            className="w-full text-[11px] font-bold border border-gray-200 rounded-lg p-1.5 bg-white focus:outline-none focus:border-[#087F8C] disabled:bg-gray-100"
                          >
                            <option value="6 Months">6 Months</option>
                            <option value="3 Months">3 Months</option>
                            <option value="1 Year">1 Year</option>
                            <option value="1 Month">1 Month</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingDeviceImage}
                  className="px-6 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066a75] text-white text-xs font-black shadow-lg shadow-[#087F8C]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Check size={16} /> Save Device & Pricing</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD / EDIT BRAND & LOGO                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBrandModal(false)} />
          <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F6F7] text-[#087F8C] flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    {editingBrand ? `Edit Brand & Logo — ${brandForm.name}` : 'Add New Repair Brand'}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    Upload brand logo, set theme color, and configure visibility on the repair page.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                className="text-gray-400 hover:text-gray-800 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {brandError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{brandError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBrand} className="space-y-5">
              {/* Brand Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. OnePlus, Motorola, Honor"
                    value={brandForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                      setBrandForm(prev => ({
                        ...prev,
                        name,
                        slug: editingBrand ? prev.slug : autoSlug,
                      }));
                    }}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">URL Slug *</label>
                  <input
                    type="text"
                    placeholder="e.g. oneplus, motorola"
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>
              </div>

              {/* ── Brand Logo Section ── */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-gray-800">
                    Brand Logo (Image or SVG) *
                  </label>
                  <span className="text-[11px] text-[#087F8C] font-semibold">Upload file or paste link</span>
                </div>

                {/* Upload Button + File Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="px-4 py-2.5 bg-[#087F8C] hover:bg-[#066a75] text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-[#087F8C]/20 whitespace-nowrap">
                    {uploadingLogo ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}
                    <span>{uploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Logo File (PNG, SVG, JPG)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-gray-400 font-bold text-center sm:text-left">OR paste URL</span>
                </div>

                {/* Direct URL input */}
                <input
                  type="url"
                  placeholder="https://upload.wikimedia.org/... or Cloudinary URL"
                  value={brandForm.logo}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#087F8C] bg-white"
                />

                {/* Live Logo Preview Box */}
                {brandForm.logo ? (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-gray-500 mb-2">Live Logo Preview:</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* On White Frame */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm p-3 flex items-center justify-center overflow-hidden">
                          <img
                            src={brandForm.logo}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Light Container</span>
                      </div>

                      {/* On Brand Color Frame */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-20 h-20 rounded-2xl shadow-sm p-3 flex items-center justify-center overflow-hidden transition-colors"
                          style={{ backgroundColor: brandForm.color || '#087F8C' }}
                        >
                          <img
                            src={brandForm.logo}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Theme Tile</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">No logo chosen yet. Upload a file or paste a logo URL.</p>
                )}
              </div>

              {/* Brand Accent Color & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandForm.color || '#087F8C'}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={brandForm.color || '#087F8C'}
                      onChange={(e) => setBrandForm(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#087F8C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={brandForm.sortOrder}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#087F8C]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandForm.isActive}
                    onChange={(e) => setBrandForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F8C]"></div>
                </label>
                <span className="text-xs font-bold text-gray-700">Active on Storefront (Show on Repair Pages)</span>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBrand || uploadingLogo}
                  className="px-6 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066a75] text-white text-xs font-black shadow-lg shadow-[#087F8C]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {savingBrand ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Check size={16} /> Save Brand &amp; Logo</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
