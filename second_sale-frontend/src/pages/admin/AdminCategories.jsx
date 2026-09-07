import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  X, 
  Layers, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor, 
  Tv, 
  Headphones, 
  Watch, 
  Gamepad2, 
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';
import { categoryService } from '../../services/category.service';

const ICON_MAP = {
  Smartphone: Smartphone,
  Tablet: Tablet,
  Laptop: Laptop,
  Monitor: Monitor,
  Tv: Tv,
  Headphones: Headphones,
  Watch: Watch,
  Gamepad2: Gamepad2,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Add form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newIcon, setNewIcon] = useState('Smartphone');
  const [newComingSoon, setNewComingSoon] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  // Edit in-place state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editRoute, setEditRoute] = useState('');
  const [editIcon, setEditIcon] = useState('Smartphone');
  const [editComingSoon, setEditComingSoon] = useState(false);
  const [savingEditId, setSavingEditId] = useState(null);

  // Reorder / Toggle states
  const [togglingId, setTogglingId] = useState(null);
  const [movingId, setMovingId] = useState(null);

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const broadcastCategoryUpdate = () => {
    try {
      window.dispatchEvent(new CustomEvent('categories-updated'));
      localStorage.setItem('categories_updated_at', Date.now().toString());
    } catch (e) {
      console.error('Broadcast error:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAdminCategories();
      setCategories(res.data);
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug while typing name
  const handleNameChange = (val) => {
    setNewName(val);
    const genSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setNewSlug(genSlug);
  };

  // Add category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      flash('error', 'Category name is required');
      return;
    }
    setSavingCategory(true);
    try {
      await categoryService.createCategory({
        name: newName.trim(),
        slug: newSlug.trim(),
        route: newRoute.trim(),
        icon: newIcon,
        isComingSoon: newComingSoon,
        isActive: true,
      });
      flash('success', `Category "${newName.trim()}" created successfully!`);
      broadcastCategoryUpdate();
      setNewName('');
      setNewSlug('');
      setNewRoute('');
      setNewIcon('Smartphone');
      setNewComingSoon(false);
      setIsAddOpen(false);
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to create category');
    } finally {
      setSavingCategory(false);
    }
  };

  // Save edited category
  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      flash('error', 'Category name is required');
      return;
    }
    setSavingEditId(id);
    try {
      await categoryService.updateCategory(id, {
        name: editName.trim(),
        slug: editSlug.trim(),
        route: editRoute.trim(),
        icon: editIcon,
        isComingSoon: editComingSoon,
      });
      flash('success', `Category "${editName.trim()}" updated successfully!`);
      broadcastCategoryUpdate();
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to update category');
    } finally {
      setSavingEditId(null);
    }
  };

  // Toggle active / disabled
  const handleToggleActive = async (cat) => {
    setTogglingId(cat._id);
    try {
      await categoryService.updateCategory(cat._id, { isActive: !cat.isActive });
      flash('success', `"${cat.name}" has been ${!cat.isActive ? 'enabled' : 'hidden'}!`);
      broadcastCategoryUpdate();
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
  };

  // 1-Click Move Up / Down
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const cat = categories[index];
    setMovingId(cat._id);
    const newItems = [...categories];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    const orderedIds = newItems.map(c => c._id);
    try {
      await categoryService.reorderCategories(orderedIds);
      flash('success', 'Category order updated!');
      broadcastCategoryUpdate();
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to reorder');
    } finally {
      setMovingId(null);
    }
  };

  // Delete category
  const handleDelete = async (cat) => {
    if (cat.deviceCount > 0) {
      alert(`Cannot delete "${cat.name}" because ${cat.deviceCount} device model(s) are assigned to it. Reassign or delete those devices first in the Devices section.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await categoryService.deleteCategory(cat._id);
      flash('success', `Category "${cat.name}" deleted!`);
      broadcastCategoryUpdate();
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Restore defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all categories to system defaults? Any custom categories without devices will be restored to default set.')) return;
    try {
      await categoryService.resetCategories();
      flash('success', 'Categories restored to defaults!');
      broadcastCategoryUpdate();
      fetchCategories();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Failed to reset');
    }
  };

  const totalCategories = categories.length;
  const activeCount = categories.filter(c => c.isActive).length;
  const comingSoonCount = categories.filter(c => c.isComingSoon).length;
  const totalDevicesLinked = categories.reduce((sum, c) => sum + (c.deviceCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Fixed Floating Toast Alert (Always Visible) ───────── */}
      {msg.text && (
        <div className="fixed top-6 right-6 z-[99999] flex items-center gap-3.5 px-5 py-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 bg-white/95 backdrop-blur-md max-w-md border-slate-200/80">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
          }`}>
            {msg.type === 'success' ? <Check size={20} className="stroke-[2.5]" /> : <AlertCircle size={20} className="stroke-[2.5]" />}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${
              msg.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {msg.type === 'success' ? 'Saved & Deployed' : 'Attention'}
            </h4>
            <p className="text-sm font-semibold text-slate-900 leading-snug break-words">
              {msg.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMsg({ type: '', text: '' })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="text-blue-600" size={26} />
            <span>Category Management</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage live device categories, valuation routes, coming soon states, and mega menu ordering.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            title="Reset to system default categories"
          >
            <RotateCcw size={14} />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={15} />
            <span>{isAddOpen ? 'Close Form' : 'Add Category'}</span>
          </button>
        </div>
      </div>

      {/* ── Overview Metrics ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Categories</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalCategories}</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Active / Live</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">{activeCount}</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Coming Soon</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600">{comingSoonCount}</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Devices Linked</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600">{totalDevicesLinked}</span>
        </div>
      </div>

      {/* ── Quick Add Drawer / Card ──────────────────────────── */}
      {isAddOpen && (
        <form onSubmit={handleCreate} className="p-5 sm:p-6 rounded-2xl border border-blue-200 bg-blue-50/50 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <Plus size={16} className="text-blue-600" />
              <span>Create New Category</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smartwatch, Drone"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Slug (Unique Identifier)
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. smartwatch"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Route / URL
              </label>
              <input
                type="text"
                value={newRoute}
                onChange={(e) => setNewRoute(e.target.value)}
                placeholder="e.g. /sell-smartwatch/brand"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Icon Representation
              </label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
              >
                <option value="Smartphone">Smartphone (Phone)</option>
                <option value="Tablet">Tablet</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor (iMac / PC)</option>
                <option value="Tv">Television (TV)</option>
                <option value="Headphones">Headphones / Audio</option>
                <option value="Watch">Watch / Smartwatch</option>
                <option value="Gamepad2">Gamepad / Gaming</option>
              </select>
            </div>

            <div className="flex items-center sm:col-span-2 pt-6 gap-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newComingSoon}
                  onChange={(e) => setNewComingSoon(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                />
                <span>Coming Soon (Shows badge in Mega Menu, disables click)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingCategory}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {savingCategory ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Creating Category…</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── Categories Table / List ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Categories Directory ({categories.length})</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top-to-bottom order matches display in the Sell Mega Menu.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw size={24} className="animate-spin text-blue-600" />
            <span className="text-xs font-semibold">Loading Categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No categories found. Click &quot;Restore Defaults&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat, index) => {
              const IconComp = ICON_MAP[cat.icon] || Smartphone;
              const isEditing = editingId === cat._id;

              return (
                <div 
                  key={cat._id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    !cat.isActive ? 'bg-slate-50/70 opacity-60' : 'hover:bg-slate-50/50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Position Number */}
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>

                    {/* Icon Badge */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                      <IconComp size={18} />
                    </div>

                    {/* Main Information or In-Place Edit */}
                    {isEditing ? (
                      <div className="flex-1 flex flex-col gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-blue-300 outline-none font-bold text-slate-900"
                          />
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            placeholder="slug"
                            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-blue-300 outline-none font-mono text-slate-700"
                          />
                          <input
                            type="text"
                            value={editRoute}
                            onChange={(e) => setEditRoute(e.target.value)}
                            placeholder="Route (/sell-...)"
                            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-blue-300 outline-none font-mono text-slate-700"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-100 text-xs">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editComingSoon}
                                onChange={(e) => setEditComingSoon(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-0"
                              />
                              <span>Coming Soon</span>
                            </label>

                            <select
                              value={editIcon}
                              onChange={(e) => setEditIcon(e.target.value)}
                              className="px-2 py-1 bg-white rounded-md border border-slate-300 text-xs font-semibold"
                            >
                              <option value="Smartphone">Phone Icon</option>
                              <option value="Tablet">Tablet Icon</option>
                              <option value="Laptop">Laptop Icon</option>
                              <option value="Monitor">iMac/PC Icon</option>
                              <option value="Tv">TV Icon</option>
                              <option value="Headphones">Audio Icon</option>
                              <option value="Watch">Watch Icon</option>
                              <option value="Gamepad2">Console Icon</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={savingEditId === cat._id}
                              onClick={() => handleSaveEdit(cat._id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg cursor-pointer"
                            >
                              {savingEditId === cat._id ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {cat.slug}
                          </span>
                          {cat.isComingSoon ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Sparkles size={10} />
                              <span>Coming Soon</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Trade-in Active
                            </span>
                          )}
                          {cat.deviceCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {cat.deviceCount} models
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditName(cat.name);
                            setEditSlug(cat.slug);
                            setEditRoute(cat.route || '');
                            setEditIcon(cat.icon || 'Smartphone');
                            setEditComingSoon(Boolean(cat.isComingSoon));
                          }}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <LinkIcon size={11} />
                          <span className="truncate">{cat.route || 'No route set'}</span>
                          <span className="text-slate-400 font-normal ml-1">· Click to edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  {!isEditing && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Reorder Up / Down */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          disabled={index === 0 || movingId === cat._id}
                          onClick={() => handleMove(index, -1)}
                          title="Move up"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={index === categories.length - 1 || movingId === cat._id}
                          onClick={() => handleMove(index, 1)}
                          title="Move down"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none border-l border-slate-200 transition-colors"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Active / Hidden Eye Toggle */}
                      <button
                        type="button"
                        disabled={togglingId === cat._id}
                        onClick={() => handleToggleActive(cat)}
                        className={`p-2 rounded-xl transition-all border cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={cat.isActive ? 'Category is active (click to hide)' : 'Category is hidden (click to enable)'}
                      >
                        {togglingId === cat._id ? (
                          <RefreshCw size={15} className="animate-spin text-blue-600" />
                        ) : cat.isActive ? (
                          <Eye size={15} />
                        ) : (
                          <EyeOff size={15} />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          cat.deviceCount > 0 
                            ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200'
                        }`}
                        title={cat.deviceCount > 0 ? `${cat.deviceCount} models linked — cannot delete` : 'Delete category'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
