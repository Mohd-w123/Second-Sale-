import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit, Wrench, Smartphone, Package, Check, X, ShieldAlert, CheckSquare, Square } from 'lucide-react';
import { adminService } from '../../services/admin.service';

export default function AdminPincodes() {
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'repair', 'sell'
  const [stats, setStats] = useState({ total: 0, repairCount: 0, sellCount: 0 });
  
  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    city: '',
    state: '',
    isActive: true,
    services: { sell: true, buy: true, repair: false }
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPincodes();
  }, [search, activeTab]);

  const fetchPincodes = async () => {
    try {
      setLoading(true);
      const params = { search };
      if (activeTab !== 'all') {
        params.service = activeTab;
      }
      const { data } = await adminService.getPincodes(params);
      setPincodes(data.pincodes || []);
      setStats({
        total: data.totalAll ?? data.total ?? 0,
        repairCount: data.repairCount ?? 0,
        sellCount: data.sellCount ?? 0,
      });
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to fetch pincodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pincode = null) => {
    if (pincode) {
      setEditingId(pincode._id);
      setForm({
        code: pincode.code || '',
        city: pincode.city || '',
        state: pincode.state || '',
        isActive: pincode.isActive !== undefined ? pincode.isActive : true,
        services: {
          sell: pincode.services?.sell !== undefined ? pincode.services.sell : true,
          buy: pincode.services?.buy !== undefined ? pincode.services.buy : true,
          repair: Boolean(pincode.services?.repair),
        }
      });
    } else {
      setEditingId(null);
      setForm({
        code: '',
        city: '',
        state: '',
        isActive: true,
        services: { sell: true, buy: true, repair: activeTab === 'repair' }
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await adminService.updatePincode(editingId, form);
      } else {
        await adminService.createPincode(form);
      }
      setShowModal(false);
      fetchPincodes();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save pincode');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleService = async (pin, serviceName) => {
    const currentVal = Boolean(pin.services?.[serviceName]);
    const nextVal = !currentVal;
    try {
      await adminService.togglePincodeService(pin._id, serviceName, nextVal);
      setPincodes(prev =>
        prev.map(p =>
          p._id === pin._id
            ? { ...p, services: { ...p.services, [serviceName]: nextVal } }
            : p
        )
      );
      // Update quick counts
      if (serviceName === 'repair') {
        setStats(s => ({
          ...s,
          repairCount: nextVal ? s.repairCount + 1 : Math.max(0, s.repairCount - 1),
        }));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update service');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(pincodes.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkToggleRepair = async (enabled) => {
    if (selectedIds.length === 0) return;
    const actionLabel = enabled ? 'enable' : 'disable';
    if (!window.confirm(`Are you sure you want to ${actionLabel} Repair Service for ${selectedIds.length} selected pincodes?`)) {
      return;
    }
    setBulkProcessing(true);
    try {
      await adminService.bulkUpdatePincodeServices(selectedIds, 'repair', enabled);
      fetchPincodes();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to bulk update pincodes');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pincode?')) return;
    try {
      await adminService.deletePincode(id);
      fetchPincodes();
    } catch (error) {
      alert('Failed to delete pincode');
    }
  };

  return (
    <div>
      {/* Top Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'all'
              ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Pincodes ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('repair')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-1.5 ${
            activeTab === 'repair'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wrench size={14} />
          Repair Service Only ({stats.repairCount})
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-1.5 ${
            activeTab === 'sell'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Smartphone size={14} />
          Sell / Buyback ({stats.sellCount})
        </button>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search pincode, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Pincode
          </button>
        </div>
      </div>

      {/* Bulk Action Banner when items are selected */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 flex-wrap animate-fadeIn">
          <div className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-2">
            <CheckSquare size={16} className="text-amber-600" />
            <span>{selectedIds.length} pincodes selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkToggleRepair(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none flex items-center gap-1"
            >
              <Wrench size={13} />
              Enable Repair
            </button>
            <button
              disabled={bulkProcessing}
              onClick={() => handleBulkToggleRepair(false)}
              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none flex items-center gap-1"
            >
              <X size={13} />
              Disable Repair
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-transparent border-none cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Pincodes Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header flex items-center justify-between">
          <h3>
            {activeTab === 'repair' ? '🔧 Repair Service Locations' : 'Serviceable Pincodes'} ({pincodes.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click on Repair badge to toggle coverage instantly
          </span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  checked={pincodes.length > 0 && selectedIds.length === pincodes.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#087F8C] cursor-pointer"
                />
              </th>
              <th>Pincode</th>
              <th>City</th>
              <th>State</th>
              <th>Services Available</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
            ) : pincodes.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {activeTab === 'repair' 
                    ? 'No pincodes currently configured for Repair Service. You can enable repair on any pincode.' 
                    : 'No pincodes found.'}
                </td>
              </tr>
            ) : (
              pincodes.map(pin => {
                const isSelected = selectedIds.includes(pin._id);
                const hasRepair = Boolean(pin.services?.repair);
                const hasSell = pin.services?.sell !== undefined ? Boolean(pin.services.sell) : true;
                const hasBuy = pin.services?.buy !== undefined ? Boolean(pin.services.buy) : true;

                return (
                  <tr key={pin._id} className={isSelected ? 'bg-amber-50/40' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(pin._id)}
                        className="w-4 h-4 accent-[#087F8C] cursor-pointer"
                      />
                    </td>
                    <td className="font-bold text-[#0F172A]">{pin.code}</td>
                    <td className="font-medium text-slate-700">{pin.city || '—'}</td>
                    <td className="text-slate-500">{pin.state || '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Sell Service Badge */}
                        <span 
                          title="Sell/Pickup Service"
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            hasSell 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-slate-100 text-slate-400 opacity-60'
                          }`}
                        >
                          <Smartphone size={11} />
                          Sell
                        </span>

                        {/* Interactive Repair Service Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleService(pin, 'repair')}
                          title="Click to toggle Repair Service for this pincode"
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border ${
                            hasRepair 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs' 
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-600'
                          }`}
                        >
                          <Wrench size={11} className={hasRepair ? 'text-emerald-600' : 'text-slate-400'} />
                          Repair: {hasRepair ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${pin.isActive ? 'admin-badge-green' : 'admin-badge-red'}`}>
                        {pin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(pin)} className="p-2 hover:bg-white/5 rounded-lg text-[#087F8C] transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(pin._id)} className="p-2 hover:bg-white/5 rounded-lg text-red-400 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Pincode Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingId ? 'Edit Pincode Coverage' : 'Add New Serviceable Pincode'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <form id="pincodeForm" onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label>Pincode (6 digits)</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={form.code} 
                    onChange={e => setForm({...form, code: e.target.value.replace(/\D/g, '')})} 
                    placeholder="e.g. 110001"
                  />
                </div>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>City</label>
                    <input 
                      type="text" 
                      required 
                      value={form.city} 
                      onChange={e => setForm({...form, city: e.target.value})} 
                      placeholder="e.g. New Delhi"
                    />
                  </div>
                  <div className="admin-field">
                    <label>State</label>
                    <input 
                      type="text" 
                      required 
                      value={form.state} 
                      onChange={e => setForm({...form, state: e.target.value})} 
                      placeholder="e.g. Delhi"
                    />
                  </div>
                </div>

                {/* Service Offerings for this Pincode */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Service Capabilities
                  </label>
                  <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={form.services?.sell} 
                        onChange={e => setForm({
                          ...form, 
                          services: { ...form.services, sell: e.target.checked }
                        })}
                        className="w-4 h-4 accent-[#087F8C]"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <Smartphone size={14} className="text-[#087F8C]" />
                          Sell Device (Doorstep Pickup)
                        </span>
                        <p className="text-[11px] text-slate-500 m-0">
                          Customers can sell old phones, laptops, and consoles in this area
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-200/60">
                      <input 
                        type="checkbox" 
                        checked={form.services?.repair} 
                        onChange={e => setForm({
                          ...form, 
                          services: { ...form.services, repair: e.target.checked }
                        })}
                        className="w-4 h-4 accent-amber-600"
                      />
                      <div>
                        <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                          <Wrench size={14} className="text-amber-600" />
                          Doorstep Repair Service
                        </span>
                        <p className="text-[11px] text-slate-500 m-0">
                          Technicians are available for onsite screen, battery, and camera repairs
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="admin-field mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.isActive} 
                      onChange={e => setForm({...form, isActive: e.target.checked})}
                      className="w-4 h-4 accent-[#087F8C]"
                    />
                    <span className="text-sm font-semibold text-slate-700">Pincode Active (Global toggle)</span>
                  </label>
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" form="pincodeForm" disabled={submitting} className="admin-btn admin-btn-primary">
                {submitting ? 'Saving...' : 'Save Pincode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
