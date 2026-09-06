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
  RefreshCw
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem('adminToken');
  return { Authorization: `Bearer ${token}` };
}

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Collapse / Expand section states
  const [isLogoOpen, setIsLogoOpen] = useState(true);
  const [isBannersOpen, setIsBannersOpen] = useState(true);
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

  const bannerInputRef = useRef();
  const logoInputRef = useRef();

  // Editing a banner's link
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editLink, setEditLink] = useState('');

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
  const allExpanded = isLogoOpen && isBannersOpen && isBannerListOpen;
  const toggleAll = () => {
    const nextState = !allExpanded;
    setIsLogoOpen(nextState);
    setIsBannersOpen(nextState);
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
      const res = await fetch(`${API}/site-settings/logo`, {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Logo upload failed');
      setSettings(data.settings || { ...settings, logoUrl: data.logoUrl });
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

      const res = await fetch(`${API}/site-settings/banners`, {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Banner upload failed');
      setSettings(data);
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
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSettings(data);
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
      setSettings(data);
      flash('success', 'Banner deleted successfully!');
    } catch (err) {
      flash('error', err.message);
    }
  };

  const saveBannerLink = async (bannerId) => {
    try {
      const res = await fetch(`${API}/site-settings/banners/${bannerId}`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkTo: editLink }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSettings(data);
      setEditingBannerId(null);
      flash('success', 'Redirect link updated!');
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
            Manage your brand assets and homepage slider banners with instant live preview
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

      {/* ── Toast Feedback Alert ──────────────────────────────── */}
      {msg.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 border transition-all animate-in fade-in slide-in-from-top-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm' 
            : 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm'
        }`}>
          {msg.type === 'success' ? <Check size={18} className="text-emerald-600 shrink-0" /> : <AlertCircle size={18} className="text-rose-600 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── SECTION 1: WEBSITE LOGO (Collapsible Card) ────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        {/* Card Header with Collapse/Expand Toggle */}
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

          {/* Inner Collapse / Expand Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoOpen(!isLogoOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-xs"
              aria-label={isLogoOpen ? 'Collapse logo section' : 'Expand logo section'}
            >
              <span>{isLogoOpen ? 'Collapse' : 'Expand'}</span>
              {isLogoOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Collapsible Body */}
        {isLogoOpen && (
          <div className="p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">
            {/* Current Active Logo */}
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

            {/* Upload New Logo */}
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
        {/* Card Header with Collapse/Expand Toggle */}
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

          {/* Section-level Collapse / Expand Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBannersOpen(!isBannersOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all shadow-xs"
              aria-label={isBannersOpen ? 'Collapse banners section' : 'Expand banners section'}
            >
              <span>{isBannersOpen ? 'Collapse' : 'Expand'}</span>
              {isBannersOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Collapsible Body */}
        {isBannersOpen && (
          <div className="p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">

            {/* ── Inner Section A: Add New Banner Form (Collapsible) ── */}
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

                {/* Inner Subsection Collapse / Expand Button */}
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

              {/* Collapsible Form Body */}
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

            {/* ── Inner Section B: Existing Banners List (Collapsible) ─ */}
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

                {/* Inner Subsection Collapse / Expand Button */}
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

              {/* Collapsible List Body */}
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
                        {/* Drag Handle & Thumb */}
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

                        {/* Banner Details & Inline Link Editor */}
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

                        {/* Actions */}
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

    </div>
  );
}
