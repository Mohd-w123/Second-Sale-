import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Store,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import './admin.css';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [editStatus, setEditStatus] = useState('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;

    adminService.getPartners(params)
      .then((res) => {
        setPartners(res.data.partners);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load partners', err);
        setLoading(false);
      });
  }, [debouncedSearch, status, page]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openEditModal = (partner) => {
    setSelectedPartner(partner);
    setEditStatus(partner.status || 'pending');
    setAdminNotes(partner.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPartner) return;
    setUpdating(true);
    try {
      const res = await adminService.updatePartnerStatus(selectedPartner._id, {
        status: editStatus,
        adminNotes,
      });
      const updated = res.data.partner || { ...selectedPartner, status: editStatus, adminNotes };
      setPartners(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      showToast('success', `Partner application updated to "${editStatus.toUpperCase()}".`);
      setSelectedPartner(null);
    } catch (err) {
      console.error('Failed to update partner status', err);
      showToast('error', err?.response?.data?.message || 'Failed to update partner status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'approved': return 'admin-badge admin-badge-green';
      case 'rejected': return 'admin-badge admin-badge-red';
      default: return 'admin-badge admin-badge-yellow';
    }
  };

  const getShopTypeLabel = (type) => {
    switch (type) {
      case 'repair': return 'Mobile Repair Shop';
      case 'retailer': return 'Laptop Retailer';
      case 'refurb': return 'Refurbishing Unit';
      case 'collector': return 'E-waste Collector';
      case 'mobile_retailer': return 'Mobile Retailer';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              className="admin-search pl-10"
              placeholder="Search business or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          <select
            className="admin-select"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="text-sm font-semibold text-slate-500">
          Applications Count: <span className="text-slate-900 font-bold">{total}</span>
        </div>
      </div>

      {/* Partners Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div className="p-12 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 admin-skeleton w-full" />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No partner registrations found.
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Business / Firm Name</th>
                  <th>Contact Person</th>
                  <th>Email Address</th>
                  <th>Mobile Number</th>
                  <th>Hub / City</th>
                  <th>Business Category</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
                          <Store size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{partner.businessName}</div>
                          {partner.adminNotes && (
                            <div className="text-[10px] text-slate-400 max-w-[180px] truncate" title={partner.adminNotes}>
                              Note: {partner.adminNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-800 font-semibold">{partner.contactPerson}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400" />
                        <span className="font-mono text-xs text-slate-700">{partner.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />
                        <span className="font-mono text-xs text-slate-700">{partner.mobile}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{partner.city}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-blue text-[10px]">
                        {getShopTypeLabel(partner.shopType)}
                      </span>
                    </td>
                    <td className="text-xs">
                      {new Date(partner.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(partner.status)}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => openEditModal(partner)}
                        className="admin-btn admin-btn-ghost text-xs py-1 px-2.5 inline-flex items-center gap-1.5"
                        title="Update Partner Status"
                      >
                        <Edit3 size={13} />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Page {page} of {totalPages}
              </div>
              <div className="admin-pagination-btns">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="admin-pagination-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="admin-pagination-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Status Update Modal ── */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Partner Application Details</h3>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              {/* Business Overview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{selectedPartner.businessName}</h4>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {getShopTypeLabel(selectedPartner.shopType)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Person</span>
                    <span className="font-semibold text-slate-800">{selectedPartner.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold text-slate-800">{selectedPartner.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                    <a href={`tel:${selectedPartner.mobile}`} className="font-mono text-blue-600 hover:underline">
                      {selectedPartner.mobile}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                    <a href={`mailto:${selectedPartner.email}`} className="font-mono text-blue-600 hover:underline truncate block">
                      {selectedPartner.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Update Application Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('pending')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editStatus === 'pending'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Clock size={14} className="text-amber-500" />
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatus('approved')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editStatus === 'approved'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatus('rejected')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      editStatus === 'rejected'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle size={14} className="text-rose-500" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  Verification & Admin Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Telephonic verification done. Shop address & GST documents verified. Credentials issued."
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  disabled={updating}
                  className="admin-btn admin-btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="admin-btn admin-btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  {updating ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
