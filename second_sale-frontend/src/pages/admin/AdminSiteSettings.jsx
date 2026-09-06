import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Link as LinkIcon, 
  Save, 
  Image as ImageIcon, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronsUpDown,
  RefreshCw,
  Compass,
  RotateCcw,
  X
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Collapse / Expand section states
  const [isLogoOpen, setIsLogoOpen] = useState(true);
  const [isBannersOpen, setIsBannersOpen] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isBannerListOpen, setIsBannerListOpen] = useState(true);

  // Banner upload state
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [bannerLink, setBannerLink] = useState('/sell-old-mobile-phones/brand');
  const [bannerAlt, setBannerAlt] = useState('Promotional Banner');
  const [bannerOrder, setBannerOrder] = useState(0);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Navigation Links state
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavTo, setNewNavTo] = useState('/');
  const [newNavDropdown, setNewNavDropdown] = useState(false);
  const [newNavExternal, setNewNavExternal] = useState(false);
  const [savingNav, setSavingNav] = useState(false);
  const [editingNavId, setEditingNavId] = useState(null);
  const [savingNavId, setSavingNavId] = useState(null);
  const [togglingNavId, setTogglingNavId] = useState(null);
  const [movingNavId, setMovingNavId] = useState(null);
  const [editNavLabel, setEditNavLabel] = useState('');
  const [editNavTo, setEditNavTo] = useState('');
  const [editNavDropdown, setEditNavDropdown] = useState(false);
  const [editNavExternal, setEditNavExternal] = useState(false);

  const bannerInputRef = useRef();
  const logoInputRef = useRef();

  // Editing a banner's link
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editLink, setEditLink] = useState('');

  const broadcastSettingsUpdate = (data) => {
    setSettings(data);
    try {
      window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: data }));
      localStorage.setItem('site_settings_updated_at', Date.now().toString());
    } catch (e) {
      console.error('Broadcasting error:', e);
    }
  };

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/site-settings`);
      const data = await res.json();
      setSettings(data);
      setBannerOrder(data.banners?.length || 0);
    } catch {
      flash('error', 'Could not load site settings. Please check server connection.');
    } finally {
      setLoading(false);
    }
  }

  // Toggle all sections
  const allExpanded = isLogoOpen && isBannersOpen && isNavOpen;
  const toggleAll = () => {
    const nextState = !allExpanded;
    setIsLogoOpen(nextState);
    setIsBannersOpen(nextState);
    setIsNavOpen(nextState);
    setIsBannerListOpen(nextState);
    if (!nextState) setIsAddFormOpen(false);
  };

  // ── Logo Handlers ───────────────────────────────────────────────
  const onLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('logo', logoFile);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/site-settings/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Logo upload failed');
      broadcastSettingsUpdate(data.settings || { ...settings, logoUrl: data.logoUrl });
      setLogoFile(null);
      setLogoPreview('');
      flash('success', 'Logo updated and deployed successfully!');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // ── Banner Handlers ─────────────────────────────────────────────
  const onBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async () => {
    if (!bannerFile) return;
    setUploadingBanner(true);
    try {
      const fd = new FormData();
      fd.append('banner', bannerFile);
      fd.append('linkTo', bannerLink);
      fd.append('altText', bannerAlt);
      fd.append('order', bannerOrder);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/site-settings/banners`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Banner upload failed');
      broadcastSettingsUpdate(data);
      setBannerFile(null);
      setBannerPreview('');
      setBannerLink('/sell-old-mobile-phones/brand');
      setBannerAlt('Promotional Banner');
      setBannerOrder(data.banners?.length || 0);
      setIsAddFormOpen(false);
      flash('success', 'Banner uploaded successfully!');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const toggleBanner = async (bannerId, currentActive) => {
    try {
      const res = await fetch(`${API}/site-settings/banners/${bannerId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      broadcastSettingsUpdate(data);
      flash('success', `Banner ${!currentActive ? 'activated' : 'hidden'}!`);
    } catch (err) {
      flash('error', err.message);
    }
  };

  const deleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`${API}/site-settings/banners/${bannerId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      broadcastSettingsUpdate(data);
      flash('success', 'Banner deleted successfully!');
    } catch (err) {
      flash('error', err.message);
    }
  };

  const saveBannerLink = async (bannerId) => {
    try {
      const res = await fetch(`${API}/site-settings/banners/${bannerId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ linkTo: editLink }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      broadcastSettingsUpdate(data);
      setEditingBannerId(null);
      flash('success', 'Redirect link updated!');
    } catch (err) {
      flash('error', err.message);
    }
  };

  // ── Navigation Link Handlers ────────────────────────────────────
  const addNavLink = async (e) => {
    e.preventDefault();
    if (!newNavLabel.trim()) {
      flash('error', 'Navigation label is required');
      return;
    }
    setSavingNav(true);
    try {
      const res = await fetch(`${API}/site-settings/nav-links`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          label: newNavLabel.trim(),
          to: newNavTo.trim(),
          hasDropdown: newNavDropdown,
          isExternal: newNavExternal,
          order: settings?.navLinks?.length || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add nav link');
      broadcastSettingsUpdate(data);
      setNewNavLabel('');
      setNewNavTo('/');
      setNewNavDropdown(false);
      setNewNavExternal(false);
      flash('success', `Navigation item "${newNavLabel.trim()}" added & published!`);
    } catch (err) {
      flash('error', err.message);
    } finally {
      setSavingNav(false);
    }
  };

  const toggleNavLink = async (item) => {
    const linkId = item._id;
    const currentActive = item.isActive;
    setTogglingNavId(linkId);
    try {
      const res = await fetch(`${API}/site-settings/nav-links/${linkId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to toggle status');
      broadcastSettingsUpdate(data);
      flash('success', `"${item.label}" has been ${!currentActive ? 'enabled & made visible' : 'hidden from navbar'}!`);
    } catch (err) {
      flash('error', err.message);
    } finally {
      setTogglingNavId(null);
    }
  };

  const deleteNavLink = async (linkId) => {
    if (!window.confirm('Delete this navigation item?')) return;
    try {
      const res = await fetch(`${API}/site-settings/nav-links/${linkId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      broadcastSettingsUpdate(data);
      flash('success', 'Navigation item deleted!');
    } catch (err) {
      flash('error', err.message);
    }
  };

  const saveEditedNavLink = async (linkId) => {
    if (!editNavLabel.trim()) {
      flash('error', 'Navigation label cannot be empty');
      return;
    }
    setSavingNavId(linkId);
    try {
      const res = await fetch(`${API}/site-settings/nav-links/${linkId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          label: editNavLabel.trim(),
          to: editNavTo.trim(),
          hasDropdown: editNavDropdown,
          isExternal: editNavExternal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update nav link');
      broadcastSettingsUpdate(data);
      setEditingNavId(null);
      flash('success', `Navigation item "${editNavLabel.trim()}" updated successfully!`);
    } catch (err) {
      flash('error', err.message);
    } finally {
      setSavingNavId(null);
    }
  };

  const moveNavLink = async (index, direction) => {
    if (!settings?.navLinks) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= settings.navLinks.length) return;
    const item = settings.navLinks[index];
    setMovingNavId(item._id);
    const newLinks = [...settings.navLinks];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);
    const orderedIds = newLinks.map(l => l._id);
    try {
      const res = await fetch(`${API}/site-settings/nav-links/reorder`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reorder links');
      broadcastSettingsUpdate(data);
      flash('success', 'Menu link order updated & published!');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setMovingNavId(null);
    }
  };

  const resetNavLinks = async () => {
    if (!window.confirm('Reset all navigation items to system defaults?')) return;
    try {
      const res = await fetch(`${API}/site-settings/nav-links/reset`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      broadcastSettingsUpdate(data);
      flash('success', 'Navigation restored to defaults!');
    } catch (err) {
      flash('error', err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold">Loading Site Settings...</p>
      </div>
    );
  }

  const activeBannersCount = settings?.banners?.filter(b => b.isActive)?.length || 0;
  const totalBannersCount = settings?.banners?.length || 0;
  const activeNavCount = settings?.navLinks?.filter(l => l.isActive)?.length || 0;
  const totalNavCount = settings?.navLinks?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Page Header & Quick Controls ──────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Site Settings
            </h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
              Live Customizer
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your brand assets, navigation menu, and homepage slider banners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
            title={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
          >
            <ChevronsUpDown size={15} />
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200"
          >
            <ExternalLink size={14} />
            <span>Preview Site</span>
          </a>
        </div>
      </div>

      {/* ── Fixed Floating Toast Alert (Visible At Any Scroll Position) ── */}
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

      {/* ── Inline Banner Notification ────────────────────────── */}
      {msg.text && (
        <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between gap-3 border transition-all animate-in fade-in slide-in-from-top-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200 shadow-xs' 
            : 'bg-rose-50/90 text-rose-900 border-rose-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            {msg.type === 'success' ? <Check size={18} className="text-emerald-600 shrink-0 stroke-[2.5]" /> : <AlertCircle size={18} className="text-rose-600 shrink-0 stroke-[2.5]" />}
            <span>{msg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMsg({ type: '', text: '' })}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── SECTION 1: WEBSITE LOGO (Collapsible Card) ────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div 
          onClick={() => setIsLogoOpen(!isLogoOpen)}
          className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Website Brand Logo
                </h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  settings?.logoUrl 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {settings?.logoUrl ? 'Custom Logo Active' : 'Default Asset'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Upload the primary logo displayed in header navigation and footer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoOpen(!isLogoOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-xs"
            >
              <span>{isLogoOpen ? 'Collapse' : 'Expand'}</span>
              {isLogoOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {isLogoOpen && (
          <div className="p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Current Active Logo
              </label>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 max-w-lg">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center min-w-[140px] h-16">
                  <img
                    src={settings?.logoUrl || '/src/assets/logo-secondsale.png'}
                    alt="Current Logo"
                    className="max-h-12 max-w-[130px] object-contain"
                    onError={(e) => { e.currentTarget.src = '/src/assets/logo-secondsale.png'; }}
                  />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">PNG or SVG with transparent background</p>
                  <p className="text-slate-400 mt-0.5">Recommended resolution: 280 x 60px</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Upload New Logo
              </label>
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                onChange={onLogoSelect}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50/50 hover:bg-blue-50/40 transition-all cursor-pointer"
                >
                  <Upload size={15} />
                  <span>Choose New Image</span>
                </button>

                {logoPreview && (
                  <div className="flex items-center gap-3 bg-blue-50/60 p-2 pr-3 rounded-xl border border-blue-200 animate-in fade-in">
                    <img
                      src={logoPreview}
                      alt="Selected preview"
                      className="h-9 w-auto max-w-[120px] object-contain rounded-lg border border-blue-200 bg-white px-2"
                    />
                    <button
                      type="button"
                      onClick={uploadLogo}
                      disabled={uploadingLogo}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
                    >
                      {uploadingLogo ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Deploying…</span>
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          <span>Save & Deploy Logo</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLogoFile(null); setLogoPreview(''); }}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: HOMEPAGE BANNER SLIDER (Collapsible Card) ─ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div 
          onClick={() => setIsBannersOpen(!isBannersOpen)}
          className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Sliders size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Homepage Banner Slider
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                  {activeBannersCount} of {totalBannersCount} Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage promotional banners, custom click redirects, and banner visibility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBannersOpen(!isBannersOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-xs"
            >
              <span>{isBannersOpen ? 'Collapse' : 'Expand'}</span>
              {isBannersOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {isBannersOpen && (
          <div className="p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">
            {/* Add Banner Inner Subsection */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 overflow-hidden transition-all">
              <div 
                onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-blue-100/40 select-none transition-colors border-b border-blue-100"
              >
                <div className="flex items-center gap-2.5 text-blue-900 font-bold text-sm">
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Plus size={14} />
                  </div>
                  <span>Add New Slider Banner</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddFormOpen(!isAddFormOpen);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-50 transition-all"
                >
                  <span>{isAddFormOpen ? 'Hide Form' : 'Show Form'}</span>
                  {isAddFormOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {isAddFormOpen && (
                <div className="p-5 sm:p-6 bg-white space-y-4 animate-in fade-in duration-150">
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={onBannerSelect}
                  />

                  {bannerPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-2xl bg-slate-900">
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="w-full h-44 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setBannerFile(null); setBannerPreview(''); }}
                        className="absolute top-3 right-3 w-8 h-8 bg-slate-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                        title="Remove preview"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => bannerInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer select-none"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Upload size={22} />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        Click to select banner graphic
                      </p>
                      <p className="text-xs text-slate-400">
                        PNG, JPG, or WEBP up to 5MB · Recommended ratio: ~1200 x 380px
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Redirect Target Link
                      </label>
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={bannerLink}
                          onChange={(e) => setBannerLink(e.target.value)}
                          placeholder="/sell-old-mobile-phones/brand"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Banner Alt Description
                      </label>
                      <input
                        type="text"
                        value={bannerAlt}
                        onChange={(e) => setBannerAlt(e.target.value)}
                        placeholder="Promotional Summer Sale"
                        className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={uploadBanner}
                      disabled={!bannerFile || uploadingBanner}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingBanner ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Uploading…</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Publish Banner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Banners List Inner Subsection */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div 
                onClick={() => setIsBannerListOpen(!isBannerListOpen)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors border-b border-slate-100 bg-slate-50/60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    Active & Saved Banners
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {totalBannersCount}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBannerListOpen(!isBannerListOpen);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all"
                >
                  <span>{isBannerListOpen ? 'Collapse' : 'Expand'}</span>
                  {isBannerListOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {isBannerListOpen && (
                <div className="p-4 sm:p-5 bg-white space-y-3 animate-in fade-in duration-150">
                  {!settings?.banners?.length ? (
                    <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No Custom Banners Yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        The homepage is currently displaying the high-resolution fallback banners. Click &quot;Add New Slider Banner&quot; above to publish your first one.
                      </p>
                    </div>
                  ) : (
                    settings.banners.map((banner, idx) => (
                      <div
                        key={banner._id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                          banner.isActive
                            ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs'
                            : 'border-slate-200 bg-slate-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 shrink-0">
                          <GripVertical size={18} className="text-slate-300 cursor-grab shrink-0" />
                          <div className="w-28 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                            <img
                              src={banner.imageUrl}
                              alt={banner.altText}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                            <span className="text-xs font-bold text-slate-700 truncate">{banner.altText || 'Promotional Banner'}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                              banner.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-slate-200 text-slate-500 border-slate-300'
                            }`}>
                              {banner.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </div>

                          {editingBannerId === banner._id ? (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                value={editLink}
                                onChange={(e) => setEditLink(e.target.value)}
                                className="flex-1 text-xs px-3 py-1.5 border border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveBannerLink(banner._id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingBannerId(null)}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBannerId(banner._id);
                                setEditLink(banner.linkTo);
                              }}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold truncate hover:underline text-left mt-0.5"
                              title="Click to edit link"
                            >
                              <LinkIcon size={12} className="shrink-0" />
                              <span className="truncate">{banner.linkTo}</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleBanner(banner._id, banner.isActive)}
                            className={`p-2 rounded-xl transition-all border ${
                              banner.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={banner.isActive ? 'Active on site — click to hide' : 'Hidden from site — click to activate'}
                          >
                            {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBanner(banner._id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                            title="Delete banner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 3: HEADER NAVIGATION (Collapsible Card) ───── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <div 
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Compass size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Header Navigation Links
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                  {activeNavCount} of {totalNavCount} Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Customize main navigation menu items, destination paths, and mega menu triggers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsNavOpen(!isNavOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-xs"
            >
              <span>{isNavOpen ? 'Collapse' : 'Expand'}</span>
              {isNavOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {isNavOpen && (
          <div className="p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">
            {/* Add New Nav Link Form */}
            <form onSubmit={addNavLink} className="p-4 sm:p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  + Add New Navigation Item
                </p>
                <button
                  type="button"
                  onClick={resetNavLinks}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Reset to default menu"
                >
                  <RotateCcw size={12} />
                  <span>Restore Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Menu Label
                  </label>
                  <input
                    type="text"
                    value={newNavLabel}
                    onChange={(e) => setNewNavLabel(e.target.value)}
                    placeholder="e.g. Festive Deals, Corporate"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Destination URL or Hash
                  </label>
                  <input
                    type="text"
                    value={newNavTo}
                    onChange={(e) => setNewNavTo(e.target.value)}
                    placeholder="/deals or /#how-it-works"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNavDropdown}
                      onChange={(e) => setNewNavDropdown(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-400"
                    />
                    <span>Attach &apos;Sell Device&apos; Mega Menu</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNavExternal}
                      onChange={(e) => setNewNavExternal(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-400"
                    />
                    <span>Open in new tab</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingNav || !newNavLabel.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{savingNav ? 'Saving…' : 'Add Item'}</span>
                </button>
              </div>
            </form>

            {/* Current Navigation Items List */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Current Navigation Menu ({settings?.navLinks?.length || 0})
              </label>

              {!settings?.navLinks?.length ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No custom navigation items. Click &quot;Restore Defaults&quot; above.
                </div>
              ) : (
                settings.navLinks.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                      item.isActive 
                        ? 'border-slate-200 bg-white hover:border-blue-300' 
                        : 'border-slate-200 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {index + 1}
                      </span>

                      {editingNavId === item._id ? (
                        <div className="flex-1 flex flex-col gap-2 p-2.5 bg-blue-50/60 rounded-xl border border-blue-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={editNavLabel}
                              onChange={(e) => setEditNavLabel(e.target.value)}
                              className="text-xs px-2.5 py-1.5 border border-blue-300 bg-white rounded-lg outline-none flex-1 min-w-[120px] font-semibold text-slate-900"
                              placeholder="Label"
                            />
                            <input
                              type="text"
                              value={editNavTo}
                              onChange={(e) => setEditNavTo(e.target.value)}
                              className="text-xs px-2.5 py-1.5 border border-blue-300 bg-white rounded-lg outline-none flex-1 min-w-[140px] text-slate-700"
                              placeholder="Path (/page or https://)"
                            />
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-100">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={editNavDropdown}
                                  onChange={(e) => setEditNavDropdown(e.target.checked)}
                                  className="rounded text-blue-600 focus:ring-0"
                                />
                                Mega Menu
                              </label>
                              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={editNavExternal}
                                  onChange={(e) => setEditNavExternal(e.target.checked)}
                                  className="rounded text-blue-600 focus:ring-0"
                                />
                                Open in New Tab
                              </label>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={savingNavId === item._id}
                                onClick={() => saveEditedNavLink(item._id)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                              >
                                {savingNavId === item._id ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check size={13} />
                                    <span>Save</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNavId(null)}
                                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {item.label}
                            </span>
                            {item.hasDropdown && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                Mega Menu
                              </span>
                            )}
                            {item.isExternal && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                External
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNavId(item._id);
                              setEditNavLabel(item.label);
                              setEditNavTo(item.to);
                              setEditNavDropdown(Boolean(item.hasDropdown));
                              setEditNavExternal(Boolean(item.isExternal));
                            }}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <LinkIcon size={11} />
                            <span className="truncate">{item.to}</span>
                            <span className="text-slate-400 font-normal ml-1">· Click to edit</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Move Up / Down Ordering */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveNavLink(index, -1)}
                          title="Move up"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={index === (settings?.navLinks?.length || 0) - 1}
                          onClick={() => moveNavLink(index, 1)}
                          title="Move down"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none border-l border-slate-200 transition-colors"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleNavLink(item)}
                        className={`p-2 rounded-xl transition-all border ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={item.isActive ? 'Active — click to disable' : 'Disabled — click to enable'}
                      >
                        {togglingNavId === item._id ? <RefreshCw size={15} className="animate-spin text-blue-600" /> : item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNavLink(item._id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                        title="Delete navigation item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
