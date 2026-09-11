import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Users2,
  UserPlus,
  Shield,
  Key,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Smartphone,
  ClipboardList,
  Handshake,
  Users,
  Layers,
  MapPin,
  LayoutDashboard,
  Package,
  Layout,
  FileText,
  Settings2,
} from 'lucide-react';
import NoIndexSEO from '../../components/seo/NoIndexSEO';
import './admin.css';

// All sidebar modules available for assignment
const MODULES = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Analytics & high-level business metrics', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders & Pickups', desc: 'Manage buyback orders and change status', icon: ClipboardList },
  { id: 'partners', label: 'Partner Applications', desc: 'Review partner and franchise requests', icon: Handshake },
  { id: 'users', label: 'User Directory', desc: 'View customer contacts and profiles', icon: Users },
  { id: 'devices', label: 'Device Catalog (Sell)', desc: 'Edit buyback device models and prices', icon: Smartphone },
  { id: 'refurbished', label: 'Refurbished Store', desc: 'Manage refurbished inventory & orders', icon: Package },
  { id: 'categories', label: 'Categories', desc: 'Manage device categories and brands', icon: Layers },
  { id: 'pincodes', label: 'Serviceable Pincodes', desc: 'Configure serviceable pin code areas', icon: MapPin },
  { id: 'homepage', label: 'Homepage CMS', desc: 'Customize banner and homepage sections', icon: Layout },
  { id: 'pages', label: 'Pages (CMS)', desc: 'Edit policy pages and content blocks', icon: FileText },
  { id: 'site-settings', label: 'Site Settings', desc: 'Branding, favicon, and footer config', icon: Settings2 },
];

export default function AdminSalesUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales',
    permissions: ['orders'],
    isActive: true,
  });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getSalesUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'sales',
      permissions: ['orders'],
      isActive: true,
    });
    setError('');
    setSuccess('');
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'sales',
      permissions: user.permissions || [],
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setError('');
    setSuccess('');
    setShowEditModal(true);
  };

  const handleTogglePermission = (modId) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(modId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== modId)
        : [...prev.permissions, modId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: MODULES.map((m) => m.id),
    }));
  };

  const handleClearAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createSalesUser(formData);
      setSuccess(`Team member "${formData.name}" created successfully!`);
      setShowCreateModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sales user.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        isActive: formData.isActive,
      };
      if (formData.password && formData.password.trim().length > 0) {
        payload.password = formData.password.trim();
      }

      await adminService.updateSalesUser(selectedUser._id, payload);
      setSuccess(`Team member "${formData.name}" updated successfully!`);
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update sales user.');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await adminService.updateSalesUser(user._id, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${user.name}"?`)) {
      return;
    }
    try {
      await adminService.deleteSalesUser(user._id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete sales user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      <NoIndexSEO title="Sales Team & Feature Permissions | Admin" path="/admin/sales-users" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <Users2 className="text-[#2563EB]" size={26} />
            <span>Sales Team & Feature Access</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create sales accounts and choose which sidebar features each team member can access.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer"
        >
          <UserPlus size={18} />
          <span>Add Sales User</span>
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-emerald-600 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-600 hover:text-rose-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Users2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Team Members</p>
            <p className="text-2xl font-black text-gray-900">{users.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Accounts</p>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Modules</p>
            <p className="text-2xl font-black text-purple-600">{MODULES.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Search team members by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-black uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Permitted Features</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Login</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading team members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No team members found. Click &quot;Add Sales User&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                  const userPerms = user.permissions || [];

                  return (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-100 uppercase tracking-wide">
                          <Shield size={12} />
                          {user.role === 'admin' ? 'Administrator' : 'Sales Team'}
                        </span>
                      </td>

                      <td className="py-4 px-6 max-w-md">
                        <div className="flex flex-wrap gap-1.5">
                          {userPerms.length === 0 ? (
                            <span className="text-xs text-gray-400 italic">No access</span>
                          ) : (
                            userPerms.map((permId) => {
                              const mod = MODULES.find((m) => m.id === permId);
                              return (
                                <span
                                  key={permId}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                                >
                                  {mod?.label || permId}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2 size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-500">
                        {user.lastLogin ? (
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock size={12} />
                            {new Date(user.lastLogin).toLocaleDateString()} {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Never</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                            title="Edit Permissions & Details"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Account"
                          >
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
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {showCreateModal ? 'Add New Sales User' : `Edit "${selectedUser?.name}"`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure login credentials and select which sidebar features this user can access.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={showCreateModal ? handleCreateSubmit : handleEditSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@secondsale.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {showCreateModal ? 'Password' : 'New Password (Optional)'}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="password"
                      required={showCreateModal}
                      placeholder={showCreateModal ? '••••••••' : 'Leave blank to keep unchanged'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Account Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="sales">Sales Team (Restricted)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="user-active-toggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <label htmlFor="user-active-toggle" className="text-sm font-semibold text-gray-800 cursor-pointer">
                  Account is Active (Allow login)
                </label>
              </div>

              {/* Feature Permissions Checkbox Grid */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Assigned Sidebar Features</h4>
                    <p className="text-xs text-gray-500">Select which pages appear on this user&apos;s admin sidebar.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllPermissions}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {MODULES.map((mod) => {
                    const isChecked = formData.permissions.includes(mod.id);
                    const Icon = mod.icon;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleTogglePermission(mod.id)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/50 border-[#2563EB] text-[#2563EB]'
                            : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 text-gray-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked ? 'bg-[#2563EB] text-white' : 'border-2 border-gray-300'
                          }`}
                        >
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className={isChecked ? 'text-[#2563EB]' : 'text-gray-400'} />
                            <span className="text-xs font-bold text-gray-900 block truncate">{mod.label}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 block mt-0.5 line-clamp-1">{mod.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {showCreateModal ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
