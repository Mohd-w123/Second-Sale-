import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/admin.service';
import {
  GripVertical, ChevronUp, ChevronDown, Eye, EyeOff, Save,
  RefreshCw, RotateCcw, ExternalLink, CheckCircle2, AlertCircle,
  Layout, Smartphone, BarChart3, Zap, ShoppingBag, HelpCircle,
  Star, ShieldCheck, MapPin, Sparkles, Check, Plus, Trash2, Sliders,
  Upload, Image as ImageIcon
} from 'lucide-react';
import heroBannerDefaultImg from '../../assets/hero-banner.jpg';
import './admin.css';

const SECTION_ICONS = {
  slider: Sliders,
  hero: Sparkles,
  deviceCategories: Smartphone,
  stats: BarChart3,
  featuresStrip: Zap,
  services: Layout,
  buyRefurbished: ShoppingBag,
  howItWorks: HelpCircle,
  reviews: Star,
  whyUs: ShieldCheck,
  faqs: HelpCircle,
  cityLinks: MapPin,
};

export default function AdminHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const heroFileInputRef = useRef(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await adminService.getHomepageConfig();
      if (res.data?.sections) {
        setSections(res.data.sections);
      }
    } catch (err) {
      console.error('Failed to load homepage sections:', err);
      showFeedback('error', 'Failed to load homepage configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Reordering sections (Move Up / Move Down like in Sant Lawrence)
  const moveSection = (index, direction) => {
    setSections((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((sec, i) => ({ ...sec, order: i }));
    });
    if (expandedIndex === index) {
      setExpandedIndex(direction === 'up' ? index - 1 : index + 1);
    }
  };

  // Toggle isEnabled visibility
  const toggleSection = (index) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, isEnabled: !sec.isEnabled } : sec))
    );
  };

  // Update Section Header fields
  const updateSectionMeta = (index, field, val) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, [field]: val } : sec))
    );
  };

  // Update Section Content fields
  const updateContentField = (index, key, val) => {
    setSections((prev) => {
      const copy = [...prev];
      const current = copy[index];
      if (!current) return prev;
      copy[index] = {
        ...current,
        content: {
          ...(current.content || {}),
          [key]: val,
        },
      };
      return copy;
    });
  };

  // Upload image for hero section
  const handleUploadHeroImage = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroImage(true);
    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await adminService.uploadHomepageImage(fd);
      if (res.data?.imageUrl) {
        updateContentField(index, 'heroImage', res.data.imageUrl);
        showFeedback('success', 'Hero image uploaded and updated successfully!');
      }
    } catch (err) {
      console.error('Failed to upload hero image:', err);
      showFeedback('error', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingHeroImage(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';
    }
  };

  // Save changes to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateHomepageSections({ sections, status: 'published' });
      window.dispatchEvent(new CustomEvent('homepage-updated'));
      localStorage.setItem('homepage_updated_at', Date.now().toString());
      showFeedback('success', 'Homepage layout and sections saved successfully!');
    } catch (err) {
      console.error('Failed to save homepage sections:', err);
      showFeedback('error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default sections
  const handleReset = async () => {
    if (!window.confirm('Reset homepage layout and section order to original defaults?')) return;
    setSaving(true);
    try {
      const res = await adminService.resetHomepageSections();
      if (res.data?.config?.sections) {
        setSections(res.data.config.sections);
      }
      window.dispatchEvent(new CustomEvent('homepage-updated'));
      localStorage.setItem('homepage_updated_at', Date.now().toString());
      showFeedback('success', 'Homepage sections restored to default');
    } catch (err) {
      console.error('Failed to reset sections:', err);
      showFeedback('error', 'Failed to reset sections');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-content-inner p-4 sm:p-6 max-w-[1200px] mx-auto">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`fixed top-5 right-5 z-[3000] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold transition-all ${
          feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layout className="text-blue-600" size={26} />
            Homepage Section Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reorder sections, toggle visibility, and update dynamic copy, images, and stats on the live storefront homepage.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 no-underline transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Live Store</span>
          </a>
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            title="Reset to default sequence"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 cursor-pointer border-none transition-all disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Publishing...' : 'Publish Layout'}</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw size={28} className="animate-spin mb-2" />
          <p className="text-sm font-medium">Loading homepage configuration...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((sec, index) => {
            const IconComponent = SECTION_ICONS[sec.type] || Layout;
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={sec._id || sec.type + index}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10'
                    : sec.isEnabled
                    ? 'border-slate-200 shadow-xs hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                {/* Section Row Header */}
                <div className="p-4 flex items-center justify-between gap-3">
                  {/* Left: Reorder & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      #{index + 1}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <IconComponent size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm truncate">
                          {sec.title || sec.type}
                        </span>
                        {!sec.isEnabled && (
                          <span className="text-[10px] font-extrabold uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {sec.subtitle || `Section Type: ${sec.type}`}
                      </p>
                    </div>
                  </div>

                  {/* Right: Controls (Move up, Move down, Toggle eye, Expand) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSection(index, 'up')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent border-none bg-transparent cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp size={18} />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === sections.length - 1}
                      onClick={() => moveSection(index, 'down')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent border-none bg-transparent cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown size={18} />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSection(index)}
                      className={`p-1.5 rounded-lg border-none cursor-pointer transition-colors ${
                        sec.isEnabled
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-200'
                      }`}
                      title={sec.isEnabled ? 'Section is visible (Click to hide)' : 'Section is hidden (Click to show)'}
                    >
                      {sec.isEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    {/* Expand/Collapse Editor */}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isExpanded
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isExpanded ? 'Collapse' : 'Customize'}
                    </button>
                  </div>
                </div>

                {/* Expandable Section Editor */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-5 rounded-b-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section Display Heading
                        </label>
                        <input
                          type="text"
                          value={sec.title || ''}
                          onChange={(e) => updateSectionMeta(index, 'title', e.target.value)}
                          className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section Subtitle / Description
                        </label>
                        <input
                          type="text"
                          value={sec.subtitle || ''}
                          onChange={(e) => updateSectionMeta(index, 'subtitle', e.target.value)}
                          className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                        />
                      </div>
                    </div>

                    {/* ─── SLIDER EDITOR ────────────────────────────────────────── */}
                    {sec.type === 'slider' && (
                      <div className="space-y-3 pt-2">
                        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-bold">Slider Banners & Images</p>
                            <p className="text-slate-600 mt-0.5">
                              Upload, edit, or toggle active promotional banners in Site Settings. If no active banners are uploaded, this section automatically hides itself on the live website.
                            </p>
                          </div>
                          <a
                            href="/admin/site-settings"
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs whitespace-nowrap hover:bg-blue-700 transition-colors no-underline shrink-0 text-center"
                          >
                            Manage Banners →
                          </a>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Slider Auto-Play Speed
                          </label>
                          <select
                            value={sec.content?.autoPlaySpeed || 4000}
                            onChange={(e) => updateContentField(index, 'autoPlaySpeed', Number(e.target.value))}
                            className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white"
                          >
                            <option value={3000}>3 seconds (Fast)</option>
                            <option value={4000}>4 seconds (Standard)</option>
                            <option value={5000}>5 seconds (Relaxed)</option>
                            <option value={6000}>6 seconds (Slow)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* ─── HERO SECTION EDITOR ──────────────────────────────────── */}
                    {sec.type === 'hero' && (
                      <div className="space-y-4 pt-2">
                        {/* Hero Image Card */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Hero Graphic & Banner Image (Right-Hand Side)
                          </label>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-40 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              <img
                                src={sec.content?.heroImage || heroBannerDefaultImg}
                                alt="Hero preview"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2 w-full">
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  ref={heroFileInputRef}
                                  accept="image/*"
                                  onChange={(e) => handleUploadHeroImage(e, index)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => heroFileInputRef.current?.click()}
                                  disabled={uploadingHeroImage}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
                                >
                                  {uploadingHeroImage ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                                  <span>{uploadingHeroImage ? 'Uploading Image...' : 'Upload New Hero Graphic'}</span>
                                </button>

                                {sec.content?.heroImage && (
                                  <button
                                    type="button"
                                    onClick={() => updateContentField(index, 'heroImage', '')}
                                    className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                                  >
                                    Reset to Default
                                  </button>
                                )}
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  Or Direct Image URL (Cloudinary / CDN):
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://.../my-hero-banner.png"
                                  value={sec.content?.heroImage || ''}
                                  onChange={(e) => updateContentField(index, 'heroImage', e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Top Badge Tag */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Hero Badge / Pill Tag
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. INDIA'S TRUSTED DEVICE MARKETPLACE"
                            value={sec.content?.badge || ''}
                            onChange={(e) => updateContentField(index, 'badge', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        {/* Headline & Subheadline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Hero Main Headline (Dark Text)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. India's Most Trusted Device Marketplace"
                              value={sec.content?.headline || ''}
                              onChange={(e) => updateContentField(index, 'headline', e.target.value)}
                              className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Hero Highlighted Subheadline (Blue Text)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sell your used gadgets"
                              value={sec.content?.subheadline || ''}
                              onChange={(e) => updateContentField(index, 'subheadline', e.target.value)}
                              className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Hero Body Description Paragraph
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Get the best value for your old devices, with free doorstep pickup and instant payment — all in one place."
                            value={sec.content?.description || ''}
                            onChange={(e) => updateContentField(index, 'description', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        {/* Search Placeholder */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Search Bar Placeholder
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Search your device (e.g. iPhone 15 Pro, Galaxy S24, MacBook Air)..."
                            value={sec.content?.searchPlaceholder || ''}
                            onChange={(e) => updateContentField(index, 'searchPlaceholder', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        {/* Popular Searches */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                              Popular Search Tags
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.popularSearches)
                                  ? [...sec.content.popularSearches]
                                  : ["iPhone 15", "Samsung S24", "OnePlus 12", "MacBook Air", "iPad Pro"];
                                curr.push("New Tag");
                                updateContentField(index, 'popularSearches', curr);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                            >
                              <Plus size={13} />
                              <span>Add Tag</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                            {(Array.isArray(sec.content?.popularSearches) ? sec.content.popularSearches : [
                              "iPhone 15",
                              "Samsung S24",
                              "OnePlus 12",
                              "MacBook Air",
                              "iPad Pro"
                            ]).map((tag, tagIdx) => (
                              <div key={tagIdx} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-2.5 py-1 text-xs">
                                <input
                                  type="text"
                                  value={tag}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.popularSearches) ? [...sec.content.popularSearches] : [];
                                    curr[tagIdx] = e.target.value;
                                    updateContentField(index, 'popularSearches', curr);
                                  }}
                                  className="w-24 text-xs font-semibold text-slate-800 bg-transparent border-none outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.popularSearches) ? [...sec.content.popularSearches] : [];
                                    curr.splice(tagIdx, 1);
                                    updateContentField(index, 'popularSearches', curr);
                                  }}
                                  className="text-slate-400 hover:text-rose-600 cursor-pointer border-none bg-transparent p-0 text-sm font-bold leading-none"
                                  title="Remove tag"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                            <span className="text-xs font-extrabold text-blue-600 block">Primary Action Button</span>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Label</label>
                              <input
                                type="text"
                                placeholder="Get Device Value"
                                value={sec.content?.primaryCtaText || ''}
                                onChange={(e) => updateContentField(index, 'primaryCtaText', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Destination Link</label>
                              <input
                                type="text"
                                placeholder="/sell-old-mobile-phones/brand"
                                value={sec.content?.primaryCtaLink || ''}
                                onChange={(e) => updateContentField(index, 'primaryCtaLink', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                            <span className="text-xs font-extrabold text-slate-700 block">Secondary Action Button</span>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Label</label>
                              <input
                                type="text"
                                placeholder="How It Works"
                                value={sec.content?.secondaryCtaText || ''}
                                onChange={(e) => updateContentField(index, 'secondaryCtaText', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Destination Link</label>
                              <input
                                type="text"
                                placeholder="#how-it-works"
                                value={sec.content?.secondaryCtaLink || ''}
                                onChange={(e) => updateContentField(index, 'secondaryCtaLink', e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Trust Pills */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700">
                              Bottom Feature Badges / Trust Pills
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.trustPills)
                                  ? [...sec.content.trustPills]
                                  : ["Free Pickup", "Instant Payment", "Secure & Hassle-free"];
                                curr.push("New Feature Badge");
                                updateContentField(index, 'trustPills', curr);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                            >
                              <Plus size={13} />
                              <span>Add Badge</span>
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(Array.isArray(sec.content?.trustPills) ? sec.content.trustPills : [
                              "Free Pickup",
                              "Instant Payment",
                              "Secure & Hassle-free"
                            ]).map((pill, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">
                                  ✓
                                </span>
                                <input
                                  type="text"
                                  value={pill}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.trustPills) ? [...sec.content.trustPills] : [];
                                    curr[pIdx] = e.target.value;
                                    updateContentField(index, 'trustPills', curr);
                                  }}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                                  placeholder="e.g. Free Pickup"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.trustPills) ? [...sec.content.trustPills] : [];
                                    curr.splice(pIdx, 1);
                                    updateContentField(index, 'trustPills', curr);
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete badge"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── DEVICE CATEGORIES EDITOR ──────────────────────────────── */}
                    {sec.type === 'deviceCategories' && (
                      <div className="space-y-4 pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Device Category Shortcut Cards
                            </label>
                            <p className="text-[11px] text-slate-400">
                              Shortcuts displayed in the quick selection grid right below the hero search.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const defaultCats = [
                                  { label: "Mobile Phones", desc: "Sell old smartphones", to: "/sell-old-mobile-phones/brand", icon: "mobile", color: "#E6F4FF" },
                                  { label: "Tablets", desc: "Sell old tablets", to: "/sell-tablet/brand", icon: "tablet", color: "#E0F0FF" },
                                  { label: "Laptops", desc: "Sell old laptops", to: "/sell-old-laptops/brand", icon: "laptop", color: "#FFF3E0" },
                                  { label: "iMac", desc: "Sell old iMac / Mac", to: "/sell-imac/brand", icon: "imac", color: "#F3E8FF" },
                                  { label: "Earbuds", desc: "Sell AirPods & Earbuds", to: "/sell-earbuds/brand", icon: "earbuds", color: "#ECFDF5" },
                                  { label: "Smartwatch", desc: "Sell Apple & smartwatches", to: "/sell-smartwatch/brand", icon: "smartwatch", color: "#FEF3C7" },
                                  { label: "Gaming Console", desc: "Sell PS5, Xbox & Switch", to: "/sell-gaming/brand", icon: "console", color: "#EDE9FE" },
                                ];
                                updateContentField(index, 'categories', defaultCats);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-none cursor-pointer transition-colors"
                            >
                              Reset Defaults
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                curr.push({
                                  label: "New Category",
                                  desc: "Sell your device",
                                  to: "/sell-old-mobile-phones/brand",
                                  icon: "mobile",
                                  color: "#E6F4FF"
                                });
                                updateContentField(index, 'categories', curr);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer border-none shadow-xs transition-colors"
                            >
                              <Plus size={13} />
                              <span>Add Category</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(Array.isArray(sec.content?.categories) ? sec.content.categories : [
                            { label: "Mobile Phones", desc: "Sell old smartphones", to: "/sell-old-mobile-phones/brand", icon: "mobile", color: "#E6F4FF" },
                            { label: "Tablets", desc: "Sell old tablets", to: "/sell-tablet/brand", icon: "tablet", color: "#E0F0FF" },
                            { label: "Laptops", desc: "Sell old laptops", to: "/sell-old-laptops/brand", icon: "laptop", color: "#FFF3E0" },
                            { label: "iMac", desc: "Sell old iMac / Mac", to: "/sell-imac/brand", icon: "imac", color: "#F3E8FF" },
                            { label: "Earbuds", desc: "Sell AirPods & Earbuds", to: "/sell-earbuds/brand", icon: "earbuds", color: "#ECFDF5" },
                            { label: "Smartwatch", desc: "Sell Apple & smartwatches", to: "/sell-smartwatch/brand", icon: "smartwatch", color: "#FEF3C7" },
                            { label: "Gaming Console", desc: "Sell PS5, Xbox & Switch", to: "/sell-gaming/brand", icon: "console", color: "#EDE9FE" },
                          ]).map((cat, catIdx) => (
                            <div
                              key={catIdx}
                              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5 relative"
                              style={{ borderLeftColor: cat.color || '#2563EB', borderLeftWidth: '4px' }}
                            >
                              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                <span className="text-xs font-black text-slate-800 truncate">
                                  #{catIdx + 1} {cat.label || 'Category'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                    curr.splice(catIdx, 1);
                                    updateContentField(index, 'categories', curr);
                                  }}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete category"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Category Label</label>
                                <input
                                  type="text"
                                  value={cat.label || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                    if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                    curr[catIdx].label = e.target.value;
                                    updateContentField(index, 'categories', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg"
                                  placeholder="e.g. Mobile Phones"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Short Tagline</label>
                                <input
                                  type="text"
                                  value={cat.desc || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                    if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                    curr[catIdx].desc = e.target.value;
                                    updateContentField(index, 'categories', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
                                  placeholder="e.g. Sell old smartphones"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Destination Link</label>
                                <input
                                  type="text"
                                  value={cat.to || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                    if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                    curr[catIdx].to = e.target.value;
                                    updateContentField(index, 'categories', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg"
                                  placeholder="e.g. /sell-old-mobile-phones/brand"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Preset Icon</label>
                                  <select
                                    value={cat.icon || 'mobile'}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                      if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                      curr[catIdx].icon = e.target.value;
                                      updateContentField(index, 'categories', curr);
                                    }}
                                    className="w-full px-2 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg bg-white"
                                  >
                                    <option value="mobile">📱 Phone</option>
                                    <option value="tablet">📲 Tablet</option>
                                    <option value="laptop">💻 Laptop</option>
                                    <option value="imac">🖥️ iMac</option>
                                    <option value="earbuds">🎧 Earbuds</option>
                                    <option value="smartwatch">⌚ Watch</option>
                                    <option value="console">🎮 Console</option>
                                    <option value="custom">🖼️ Custom Image</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Card Color Tint</label>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="color"
                                      value={cat.color?.startsWith('#') && cat.color.length === 7 ? cat.color : '#E6F4FF'}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                        if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                        curr[catIdx].color = e.target.value;
                                        updateContentField(index, 'categories', curr);
                                      }}
                                      className="w-8 h-7 p-0 border border-slate-200 rounded cursor-pointer shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={cat.color || '#E6F4FF'}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                        if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                        curr[catIdx].color = e.target.value;
                                        updateContentField(index, 'categories', curr);
                                      }}
                                      className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-lg"
                                      placeholder="#E6F4FF"
                                    />
                                  </div>
                                </div>
                              </div>

                              {cat.icon === 'custom' && (
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Custom Image URL</label>
                                  <input
                                    type="text"
                                    value={cat.img || ''}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                      if (!curr[catIdx]) curr[catIdx] = { ...cat };
                                      curr[catIdx].img = e.target.value;
                                      updateContentField(index, 'categories', curr);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg"
                                    placeholder="https://example.com/icon.png"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── STATS SECTION EDITOR ─────────────────────────────────── */}
                    {sec.type === 'stats' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Homepage Trust Stats
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currStats = Array.isArray(sec.content?.stats) ? [...sec.content.stats] : [];
                              currStats.push({ value: '10K+', label: 'New Metric' });
                              updateContentField(index, 'stats', currStats);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                          >
                            <Plus size={14} />
                            <span>Add Stat</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(Array.isArray(sec.content?.stats) ? sec.content.stats : [
                            { value: "50,000+", label: "Happy Customers" },
                            { value: "₹25Cr+", label: "Paid to Customers" },
                            { value: "1L+", label: "Devices Sold" },
                            { value: "4.9/5", label: "Customer Rating" },
                            { value: "100+", label: "Cities Covered" },
                          ]).map((item, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                              <div className="w-1/3">
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Value</label>
                                <input
                                  type="text"
                                  value={item.value || ''}
                                  placeholder="e.g. 50,000+"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.stats) ? [...sec.content.stats] : [];
                                    if (!curr[sIdx]) curr[sIdx] = { ...item };
                                    curr[sIdx].value = e.target.value;
                                    updateContentField(index, 'stats', curr);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 rounded-lg"
                                />
                              </div>

                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Label / Subtitle</label>
                                <input
                                  type="text"
                                  value={item.label || ''}
                                  placeholder="e.g. Happy Customers"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.stats) ? [...sec.content.stats] : [];
                                    if (!curr[sIdx]) curr[sIdx] = { ...item };
                                    curr[sIdx].label = e.target.value;
                                    updateContentField(index, 'stats', curr);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const curr = Array.isArray(sec.content?.stats) ? [...sec.content.stats] : [];
                                  curr.splice(sIdx, 1);
                                  updateContentField(index, 'stats', curr);
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer mt-3.5"
                                title="Remove stat"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── FEATURES STRIP EDITOR ────────────────────────────────── */}
                    {sec.type === 'featuresStrip' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Highlight Strip Items
                            </label>
                            <p className="text-[11px] text-slate-400">
                              Features shown in the horizontal highlight banner below the stats.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Array.isArray(sec.content?.items)
                                ? [...sec.content.items]
                                : [
                                    "100% Secure Transactions",
                                    "Data Wipe Protection",
                                    "7 Days Easy Return",
                                    "Warranty on All Devices",
                                    "Doorstep Pickup",
                                  ];
                              curr.push("New Feature Highlight");
                              updateContentField(index, "items", curr);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                          >
                            <Plus size={14} />
                            <span>Add Highlight</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(Array.isArray(sec.content?.items) ? sec.content.items : [
                            "100% Secure Transactions",
                            "Data Wipe Protection",
                            "7 Days Easy Return",
                            "Warranty on All Devices",
                            "Doorstep Pickup",
                          ]).map((item, itIdx) => (
                            <div key={itIdx} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border border-blue-100">
                                {itIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const curr = Array.isArray(sec.content?.items) ? [...sec.content.items] : [];
                                  curr[itIdx] = e.target.value;
                                  updateContentField(index, "items", curr);
                                }}
                                className="flex-1 px-3 py-2 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 100% Secure Transactions"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = Array.isArray(sec.content?.items) ? [...sec.content.items] : [];
                                  curr.splice(itIdx, 1);
                                  updateContentField(index, "items", curr);
                                }}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer transition-colors"
                                title="Delete highlight"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── SERVICES (WHAT WOULD YOU LIKE TO SELL) EDITOR ────────── */}
                    {sec.type === 'services' && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Section Top Badge / Pill
                          </label>
                          <input
                            type="text"
                            placeholder="✨ ALL-IN-ONE DEVICE SOLUTION"
                            value={sec.content?.badge ?? "✨ ALL-IN-ONE DEVICE SOLUTION"}
                            onChange={(e) => updateContentField(index, 'badge', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                            Device Selling Solution Cards (3 Cards)
                          </label>

                          <div className="space-y-4">
                            {(Array.isArray(sec.content?.cards) ? sec.content.cards : [
                              {
                                category: "mobile",
                                title: "Sell Smartphones",
                                badge: "MOST POPULAR",
                                desc: "Get the highest cash value for your old iPhone, Samsung, OnePlus or Android phone in 60 seconds.",
                                points: [
                                  "Instant online price quote in 60s",
                                  "Free doorstep pickup across 100+ cities",
                                  "Immediate bank or UPI cash transfer",
                                  "100% data wipe & safe handling guarantee"
                                ],
                                cta: "Sell Mobile Phone",
                                ctaTo: "/sell-old-mobile-phones/brand"
                              },
                              {
                                category: "tablet",
                                title: "Sell Tablets & iPads",
                                badge: "INSTANT EVALUATION",
                                desc: "Turn your old Apple iPad, Samsung Galaxy Tab, or tablet into guaranteed cash with zero hassle.",
                                points: [
                                  "All iPad & Android tablet models accepted",
                                  "Transparent algorithmic market pricing",
                                  "Zero shipping, packaging or pickup fees",
                                  "Best buyback valuation guaranteed"
                                ],
                                cta: "Sell Tablet & iPad",
                                ctaTo: "/sell-tablet/brand"
                              },
                              {
                                category: "laptop",
                                title: "Sell Laptops & MacBooks",
                                badge: "HIGHEST PAYOUT",
                                desc: "Professional laptop buyback based on exact CPU, GPU, RAM, storage, and body condition.",
                                points: [
                                  "MacBook, Gaming & Ultrabook laptops",
                                  "CPU / GPU based transparent valuation",
                                  "Expert doorstep technician inspection",
                                  "Instant on-spot payment before pickup"
                                ],
                                cta: "Sell Laptop & MacBook",
                                ctaTo: "/sell-old-laptops/brand"
                              }
                            ]).map((card, cardIdx) => (
                              <div key={cardIdx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                                      {cardIdx + 1}
                                    </span>
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                      {card.title || `Card #${cardIdx + 1}`}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                    {card.category || "device"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Card Heading</label>
                                    <input
                                      type="text"
                                      value={card.title || ''}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                        if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                        curr[cardIdx].title = e.target.value;
                                        updateContentField(index, 'cards', curr);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg"
                                      placeholder="e.g. Sell Smartphones"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Card Badge Tag</label>
                                    <input
                                      type="text"
                                      value={card.badge || ''}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                        if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                        curr[cardIdx].badge = e.target.value;
                                        updateContentField(index, 'cards', curr);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg"
                                      placeholder="e.g. MOST POPULAR"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Card Description</label>
                                  <textarea
                                    rows={2}
                                    value={card.desc || ''}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                      if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                      curr[cardIdx].desc = e.target.value;
                                      updateContentField(index, 'cards', curr);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
                                    placeholder="Card description text..."
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Button Label</label>
                                    <input
                                      type="text"
                                      value={card.cta || ''}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                        if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                        curr[cardIdx].cta = e.target.value;
                                        updateContentField(index, 'cards', curr);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg"
                                      placeholder="e.g. Sell Mobile Phone"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Button Destination Link</label>
                                    <input
                                      type="text"
                                      value={card.ctaTo || ''}
                                      onChange={(e) => {
                                        const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                        if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                        curr[cardIdx].ctaTo = e.target.value;
                                        updateContentField(index, 'cards', curr);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg"
                                      placeholder="e.g. /sell-old-mobile-phones/brand"
                                    />
                                  </div>
                                </div>

                                {/* Benefit Points */}
                                <div className="pt-2 border-t border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                                      Benefit Bullet Points
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                        if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                        const pts = Array.isArray(curr[cardIdx].points) ? [...curr[cardIdx].points] : [];
                                        pts.push("New benefit point");
                                        curr[cardIdx].points = pts;
                                        updateContentField(index, 'cards', curr);
                                      }}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                                    >
                                      <Plus size={12} />
                                      <span>Add Point</span>
                                    </button>
                                  </div>

                                  <div className="space-y-1.5">
                                    {(Array.isArray(card.points) ? card.points : []).map((pt, ptIdx) => (
                                      <div key={ptIdx} className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                                        <input
                                          type="text"
                                          value={pt}
                                          onChange={(e) => {
                                            const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                            if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                            const pts = Array.isArray(curr[cardIdx].points) ? [...curr[cardIdx].points] : [];
                                            pts[ptIdx] = e.target.value;
                                            curr[cardIdx].points = pts;
                                            updateContentField(index, 'cards', curr);
                                          }}
                                          className="flex-1 px-2.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg bg-white"
                                          placeholder="e.g. Free doorstep pickup"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const curr = Array.isArray(sec.content?.cards) ? [...sec.content.cards] : [];
                                            if (!curr[cardIdx]) curr[cardIdx] = { ...card };
                                            const pts = Array.isArray(curr[cardIdx].points) ? [...curr[cardIdx].points] : [];
                                            pts.splice(ptIdx, 1);
                                            curr[cardIdx].points = pts;
                                            updateContentField(index, 'cards', curr);
                                          }}
                                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                          title="Delete point"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Trust Features Strip at Bottom of Services */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Service Trust Highlights (5 Badges)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {(Array.isArray(sec.content?.trustFeatures) ? sec.content.trustFeatures : [
                              { title: "100% Safe & Secure", desc: "Data wiped & secure handling" },
                              { title: "Best Price Guaranteed", desc: "Get highest value for your device" },
                              { title: "Trusted by 50,000+", desc: "Rated 4.9/5 across platforms" },
                              { title: "24x7 Customer Support", desc: "We're always here to help" },
                              { title: "Free Pickup", desc: "At your doorstep anywhere in India" },
                            ]).map((tf, tfIdx) => (
                              <div key={tfIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                <input
                                  type="text"
                                  value={tf.title}
                                  placeholder="Title"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.trustFeatures) ? [...sec.content.trustFeatures] : [];
                                    if (!curr[tfIdx]) curr[tfIdx] = { ...tf };
                                    curr[tfIdx].title = e.target.value;
                                    updateContentField(index, 'trustFeatures', curr);
                                  }}
                                  className="w-full px-2 py-1 text-xs font-bold text-slate-800 border border-slate-200 rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={tf.desc}
                                  placeholder="Description"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.trustFeatures) ? [...sec.content.trustFeatures] : [];
                                    if (!curr[tfIdx]) curr[tfIdx] = { ...tf };
                                    curr[tfIdx].desc = e.target.value;
                                    updateContentField(index, 'trustFeatures', curr);
                                  }}
                                  className="w-full px-2 py-1 text-[11px] font-medium text-slate-500 border border-slate-200 rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── HOW IT WORKS EDITOR ──────────────────────────────────── */}
                    {sec.type === 'howItWorks' && (
                      <div className="space-y-4 pt-2">
                        <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          How It Works Steps (4 Steps)
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(Array.isArray(sec.content?.steps) ? sec.content.steps : [
                            { num: "1", title: "Get Quote", desc: "Search your device and get instant price." },
                            { num: "2", title: "Confirm Details", desc: "Answer few questions about your device." },
                            { num: "3", title: "Free Pickup", desc: "We pick it up from your doorstep for free." },
                            { num: "4", title: "Get Paid Instantly", desc: "Receive instant payment in your bank account." },
                          ]).map((step, stepIdx) => (
                            <div key={stepIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="text-xs font-extrabold text-blue-600 block">Step {step.num || (stepIdx + 1)}</span>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Title</label>
                                <input
                                  type="text"
                                  value={step.title || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.steps) ? [...sec.content.steps] : [];
                                    if (!curr[stepIdx]) curr[stepIdx] = { ...step };
                                    curr[stepIdx].title = e.target.value;
                                    updateContentField(index, 'steps', curr);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Description</label>
                                <input
                                  type="text"
                                  value={step.desc || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.steps) ? [...sec.content.steps] : [];
                                    if (!curr[stepIdx]) curr[stepIdx] = { ...step };
                                    curr[stepIdx].desc = e.target.value;
                                    updateContentField(index, 'steps', curr);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* How It Works Bottom Trust Points */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Bottom Trust Badges (4 Points)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(Array.isArray(sec.content?.trustPoints) ? sec.content.trustPoints : [
                              { text: "100% Safe & Secure", sub: "Data wiped & secure handling" },
                              { text: "Best Price Guaranteed", sub: "Get highest value for your device" },
                              { text: "Trusted by 50,000+ Customers", sub: "Rated 4.9/5 across platforms" },
                              { text: "24x7 Customer Support", sub: "We're always here to help" },
                            ]).map((tp, tpIdx) => (
                              <div key={tpIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                <input
                                  type="text"
                                  value={tp.text}
                                  placeholder="Heading"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.trustPoints) ? [...sec.content.trustPoints] : [];
                                    if (!curr[tpIdx]) curr[tpIdx] = { ...tp };
                                    curr[tpIdx].text = e.target.value;
                                    updateContentField(index, 'trustPoints', curr);
                                  }}
                                  className="w-full px-2 py-1 text-xs font-bold text-slate-800 border border-slate-200 rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={tp.sub}
                                  placeholder="Subtext"
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.trustPoints) ? [...sec.content.trustPoints] : [];
                                    if (!curr[tpIdx]) curr[tpIdx] = { ...tp };
                                    curr[tpIdx].sub = e.target.value;
                                    updateContentField(index, 'trustPoints', curr);
                                  }}
                                  className="w-full px-2 py-1 text-[11px] font-medium text-slate-500 border border-slate-200 rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── WHY US EDITOR ────────────────────────────────────────── */}
                    {sec.type === 'whyUs' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            Guarantees & Trust Points
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = Array.isArray(sec.content?.guarantees) ? [...sec.content.guarantees] : [];
                              curr.push('New Guarantee Point');
                              updateContentField(index, 'guarantees', curr);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
                          >
                            <Plus size={14} />
                            <span>Add Point</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(Array.isArray(sec.content?.guarantees) ? sec.content.guarantees : [
                            "Instant Cash at Free Pickup",
                            "Transparent Pricing with No Hidden Cuts",
                            "Verified & Professional Pickup Partners",
                            "Free Doorstep Pickup Anywhere",
                            "Factory-Grade Secure Data Wipe",
                            "Genuine Official Invoice Provided",
                          ]).map((g, gIdx) => (
                            <div key={gIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={g}
                                onChange={(e) => {
                                  const curr = Array.isArray(sec.content?.guarantees) ? [...sec.content.guarantees] : [];
                                  curr[gIdx] = e.target.value;
                                  updateContentField(index, 'guarantees', curr);
                                }}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = Array.isArray(sec.content?.guarantees) ? [...sec.content.guarantees] : [];
                                  curr.splice(gIdx, 1);
                                  updateContentField(index, 'guarantees', curr);
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── BUY REFURBISHED EDITOR ───────────────────────────────── */}
                    {sec.type === 'buyRefurbished' && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Showcase Badge Tag
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. POPULAR THIS WEEK"
                            value={sec.content?.tag || 'POPULAR THIS WEEK'}
                            onChange={(e) => updateContentField(index, 'tag', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        {/* CATEGORIES / TABS */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                Device Category Tabs
                              </label>
                              <p className="text-[11px] text-slate-400">
                                Filter pills displayed above the device cards (e.g., Phones, Tablets, Laptops).
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.categories) ? [...sec.content.categories] : [];
                                curr.push({ id: `cat-${Date.now()}`, label: 'New Category' });
                                updateContentField(index, 'categories', curr);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border-none cursor-pointer flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Tab
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(sec.content?.categories || []).map((cat, catIdx) => (
                              <div key={catIdx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tab Label</label>
                                    <input
                                      type="text"
                                      value={cat.label || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.categories || [])];
                                        updated[catIdx] = { ...updated[catIdx], label: e.target.value };
                                        updateContentField(index, 'categories', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. Phones"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Filter ID</label>
                                    <input
                                      type="text"
                                      value={cat.id || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.categories || [])];
                                        updated[catIdx] = { ...updated[catIdx], id: e.target.value };
                                        updateContentField(index, 'categories', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. phones"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (sec.content?.categories || []).filter((_, i) => i !== catIdx);
                                    updateContentField(index, 'categories', updated);
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* DEVICES LIST */}
                        <div className="pt-3 border-t border-slate-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                Most Quoted Device Cards ({(sec.content?.devices || []).length})
                              </label>
                              <p className="text-[11px] text-slate-400">
                                Live device cards rendered on the homepage slider.
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultDevs = [
                                    {
                                      id: 1,
                                      name: 'iPhone 15 Pro Max',
                                      category: 'phones',
                                      price: '₹72,000',
                                      badge: 'Most Popular',
                                      badgeType: 'blue',
                                      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-mobile-phones/Apple/apple-iphone-15-pro-max',
                                    },
                                    {
                                      id: 2,
                                      name: 'Samsung Galaxy S24 Ultra',
                                      category: 'phones',
                                      price: '₹68,500',
                                      badge: 'Trending',
                                      badgeType: 'purple',
                                      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-mobile-phones/Samsung',
                                    },
                                    {
                                      id: 3,
                                      name: 'MacBook Pro M3 (14-inch)',
                                      category: 'laptops',
                                      price: '₹95,000',
                                      badge: 'High Value',
                                      badgeType: 'indigo',
                                      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-laptops',
                                    },
                                    {
                                      id: 4,
                                      name: 'iPad Pro 12.9 M2',
                                      category: 'tablets',
                                      price: '₹54,000',
                                      badge: 'Top Pick',
                                      badgeType: 'emerald',
                                      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-tablets',
                                    },
                                    {
                                      id: 5,
                                      name: 'Apple Watch Ultra 2',
                                      category: 'watches',
                                      price: '₹42,000',
                                      badge: 'Hot Deal',
                                      badgeType: 'amber',
                                      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-smartwatches',
                                    },
                                    {
                                      id: 6,
                                      name: 'OnePlus 12 (512GB)',
                                      category: 'phones',
                                      price: '₹44,000',
                                      badge: 'High Demand',
                                      badgeType: 'blue',
                                      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-mobile-phones/OnePlus',
                                    },
                                    {
                                      id: 7,
                                      name: 'Google Pixel 8 Pro',
                                      category: 'phones',
                                      price: '₹48,000',
                                      badge: 'Trending',
                                      badgeType: 'purple',
                                      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-mobile-phones/Google',
                                    },
                                    {
                                      id: 8,
                                      name: 'MacBook Air M2',
                                      category: 'laptops',
                                      price: '₹62,000',
                                      badge: 'Best Seller',
                                      badgeType: 'indigo',
                                      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-laptops',
                                    },
                                    {
                                      id: 9,
                                      name: 'iPad Air 5th Gen',
                                      category: 'tablets',
                                      price: '₹36,000',
                                      badge: 'Top Value',
                                      badgeType: 'emerald',
                                      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-tablets',
                                    },
                                    {
                                      id: 10,
                                      name: 'Galaxy Watch 6 Classic',
                                      category: 'watches',
                                      price: '₹18,500',
                                      badge: 'Popular',
                                      badgeType: 'amber',
                                      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80',
                                      to: '/sell-old-smartwatches',
                                    },
                                  ];
                                  updateContentField(index, 'devices', defaultDevs);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-none cursor-pointer"
                              >
                                Reset Defaults
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = Array.isArray(sec.content?.devices) ? [...sec.content.devices] : [];
                                  curr.push({
                                    id: Date.now(),
                                    name: 'New Device',
                                    category: 'phones',
                                    price: '₹40,000',
                                    badge: 'Trending',
                                    badgeType: 'blue',
                                    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
                                    to: '/sell-old-mobile-phones',
                                  });
                                  updateContentField(index, 'devices', curr);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border-none cursor-pointer flex items-center gap-1"
                              >
                                <Plus size={12} /> Add Device
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {(sec.content?.devices || []).map((dev, devIdx) => (
                              <div key={devIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {dev.imageUrl && (
                                      <img
                                        src={dev.imageUrl}
                                        alt={dev.name}
                                        className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                      />
                                    )}
                                    <span className="text-xs font-bold text-slate-800">
                                      #{devIdx + 1} {dev.name || 'Untitled Device'}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (sec.content?.devices || []).filter((_, i) => i !== devIdx);
                                      updateContentField(index, 'devices', updated);
                                    }}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Device Name</label>
                                    <input
                                      type="text"
                                      value={dev.name || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], name: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. iPhone 15 Pro Max"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Category ID</label>
                                    <input
                                      type="text"
                                      value={dev.category || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], category: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. phones, laptops"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Valuation / Price</label>
                                    <input
                                      type="text"
                                      value={dev.price || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], price: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. ₹72,000"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge Text</label>
                                    <input
                                      type="text"
                                      value={dev.badge || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], badge: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. Most Popular"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Badge Color</label>
                                    <select
                                      value={dev.badgeType || 'blue'}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], badgeType: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                    >
                                      <option value="blue">Blue</option>
                                      <option value="purple">Purple</option>
                                      <option value="indigo">Indigo</option>
                                      <option value="emerald">Emerald</option>
                                      <option value="amber">Amber</option>
                                      <option value="rose">Rose</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Target Route / URL</label>
                                    <input
                                      type="text"
                                      value={dev.to || ''}
                                      onChange={(e) => {
                                        const updated = [...(sec.content?.devices || [])];
                                        updated[devIdx] = { ...updated[devIdx], to: e.target.value };
                                        updateContentField(index, 'devices', updated);
                                      }}
                                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                      placeholder="e.g. /sell-old-mobile-phones"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Image URL</label>
                                  <input
                                    type="text"
                                    value={dev.imageUrl || ''}
                                    onChange={(e) => {
                                      const updated = [...(sec.content?.devices || [])];
                                      updated[devIdx] = { ...updated[devIdx], imageUrl: e.target.value };
                                      updateContentField(index, 'devices', updated);
                                    }}
                                    className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                    placeholder="https://images.unsplash.com/..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── CUSTOMER REVIEWS EDITOR ──────────────────────────────── */}
                    {sec.type === 'reviews' && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Section Top Badge / Tag
                          </label>
                          <input
                            type="text"
                            placeholder="⭐ Customer Reviews"
                            value={sec.content?.tag || '⭐ Customer Reviews'}
                            onChange={(e) => updateContentField(index, 'tag', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Customer Reviews & Testimonials
                            </label>
                            <p className="text-[11px] text-slate-400">
                              Reviews displayed in the animated 3-column masonry testimonials on the homepage.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const defaultRevs = [
                                  { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
                                  { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
                                  { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
                                  { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
                                  { name: "Pawan Mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
                                  { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
                                  { name: "Ritu Sharma", text: "Super easy process. Got a great price for my old Samsung. Will definitely use again!", stars: 5 },
                                  { name: "Aakash Mehta", text: "Loved the transparent pricing. No last minute deductions. Payment received in under 10 minutes.", stars: 5 },
                                  { name: "Priya Nair", text: "The pickup agent was very professional and courteous. Got ₹2,000 more than other platforms quoted.", stars: 5 },
                                ];
                                updateContentField(index, 'reviews', defaultRevs);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-none cursor-pointer transition-colors"
                            >
                              Reset Defaults
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.reviews) ? [...sec.content.reviews] : [];
                                curr.push({
                                  name: "Customer Name",
                                  text: "Great experience selling my device. Instant payment and transparent pricing.",
                                  stars: 5,
                                });
                                updateContentField(index, 'reviews', curr);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer border-none shadow-xs transition-colors"
                            >
                              <Plus size={13} />
                              <span>Add Review</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(Array.isArray(sec.content?.reviews) ? sec.content.reviews : [
                            { name: "Nitin Gowda", text: "Flawless experience. Instant credit. No haggling whatsoever — exactly what I expected.", stars: 5 },
                            { name: "Vidyankit Official", text: "Sold my Realme GT Neo 2. Very smooth process, no negotiation unlike other platforms. Highly recommend!", stars: 5 },
                            { name: "Jatin Mishra", text: "Sold my phone, nice company, smooth process. Pickup was on time and payment was instant.", stars: 5 },
                            { name: "Disha Doshi", text: "Value for money and service is good. Got the exact price that was shown online.", stars: 5 },
                            { name: "Pawan Mishra", text: "Excellent services! The pickup was too good and the security and checking purposes were professional.", stars: 5 },
                            { name: "Mayank Doshi", text: "Very prompt service and got a very good price. Absolutely hassle-free. Highly recommended!", stars: 5 },
                            { name: "Ritu Sharma", text: "Super easy process. Got a great price for my old Samsung. Will definitely use again!", stars: 5 },
                            { name: "Aakash Mehta", text: "Loved the transparent pricing. No last minute deductions. Payment received in under 10 minutes.", stars: 5 },
                            { name: "Priya Nair", text: "The pickup agent was very professional and courteous. Got ₹2,000 more than other platforms quoted.", stars: 5 },
                          ]).map((rev, revIdx) => (
                            <div key={revIdx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 relative">
                              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                <span className="text-xs font-black text-slate-800 truncate">
                                  #{revIdx + 1} {rev.name || 'Customer'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.reviews) ? [...sec.content.reviews] : [];
                                    curr.splice(revIdx, 1);
                                    updateContentField(index, 'reviews', curr);
                                  }}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete review"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Customer Name</label>
                                  <input
                                    type="text"
                                    value={rev.name || ''}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.reviews) ? [...sec.content.reviews] : [];
                                      if (!curr[revIdx]) curr[revIdx] = { ...rev };
                                      curr[revIdx].name = e.target.value;
                                      updateContentField(index, 'reviews', curr);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg"
                                    placeholder="e.g. Nitin Gowda"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Rating</label>
                                  <select
                                    value={rev.stars ?? 5}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.reviews) ? [...sec.content.reviews] : [];
                                      if (!curr[revIdx]) curr[revIdx] = { ...rev };
                                      curr[revIdx].stars = Number(e.target.value);
                                      updateContentField(index, 'reviews', curr);
                                    }}
                                    className="w-full px-2 py-1.5 text-xs font-bold text-amber-600 border border-slate-200 rounded-lg bg-white"
                                  >
                                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Review Text</label>
                                <textarea
                                  rows={2}
                                  value={rev.text || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.reviews) ? [...sec.content.reviews] : [];
                                    if (!curr[revIdx]) curr[revIdx] = { ...rev };
                                    curr[revIdx].text = e.target.value;
                                    updateContentField(index, 'reviews', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
                                  placeholder="Review details..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── FAQS EDITOR ──────────────────────────────────────────── */}
                    {sec.type === 'faqs' && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Section Top Badge / Tag
                          </label>
                          <input
                            type="text"
                            placeholder="❓ FAQs"
                            value={sec.content?.tag || '❓ FAQs'}
                            onChange={(e) => updateContentField(index, 'tag', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Frequently Asked Questions
                            </label>
                            <p className="text-[11px] text-slate-400">
                              Accordion Q&A items shown in the FAQ section of the homepage.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const defaultFaqs = [
                                  {
                                    q: 'Is SecondSale legit?',
                                    a: 'Yes, SecondSale is a legitimate and trusted platform for selling old electronics online in India with secure pickup and instant payment.'
                                  },
                                  {
                                    q: 'Where can I sell my old device online?',
                                    a: 'You can sell your old device online through SecondSale, which offers free doorstep pickup and instant cash payment across 2,000+ cities in India.'
                                  },
                                  {
                                    q: 'What is the best place to sell old devices easily?',
                                    a: 'SecondSale is one of the easiest and safest places to sell old devices online without visiting any shop.'
                                  },
                                  {
                                    q: 'How do I get the highest price for my old gadget?',
                                    a: 'Select the correct device condition, check the instant online quote, and book a free doorstep pickup on SecondSale for the best value.'
                                  }
                                ];
                                updateContentField(index, 'faqs', defaultFaqs);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-none cursor-pointer transition-colors"
                            >
                              Reset Defaults
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = Array.isArray(sec.content?.faqs) ? [...sec.content.faqs] : [];
                                curr.push({
                                  q: "New Question?",
                                  a: "Answer to the new question...",
                                });
                                updateContentField(index, 'faqs', curr);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer border-none shadow-xs transition-colors"
                            >
                              <Plus size={13} />
                              <span>Add FAQ</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {(Array.isArray(sec.content?.faqs) ? sec.content.faqs : [
                            {
                              q: 'Is SecondSale legit?',
                              a: 'Yes, SecondSale is a legitimate and trusted platform for selling old electronics online in India with secure pickup and instant payment.'
                            },
                            {
                              q: 'Where can I sell my old device online?',
                              a: 'You can sell your old device online through SecondSale, which offers free doorstep pickup and instant cash payment across 2,000+ cities in India.'
                            },
                            {
                              q: 'What is the best place to sell old devices easily?',
                              a: 'SecondSale is one of the easiest and safest places to sell old devices online without visiting any shop.'
                            },
                            {
                              q: 'How do I get the highest price for my old gadget?',
                              a: 'Select the correct device condition, check the instant online quote, and book a free doorstep pickup on SecondSale for the best value.'
                            }
                          ]).map((faq, fIdx) => (
                            <div key={fIdx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                <span className="text-xs font-black text-slate-800 truncate">
                                  FAQ #{fIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.faqs) ? [...sec.content.faqs] : [];
                                    curr.splice(fIdx, 1);
                                    updateContentField(index, 'faqs', curr);
                                  }}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer"
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Question</label>
                                <input
                                  type="text"
                                  value={faq.q || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.faqs) ? [...sec.content.faqs] : [];
                                    if (!curr[fIdx]) curr[fIdx] = { ...faq };
                                    curr[fIdx].q = e.target.value;
                                    updateContentField(index, 'faqs', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg"
                                  placeholder="e.g. Is SecondSale legit?"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Answer</label>
                                <textarea
                                  rows={2}
                                  value={faq.a || ''}
                                  onChange={(e) => {
                                    const curr = Array.isArray(sec.content?.faqs) ? [...sec.content.faqs] : [];
                                    if (!curr[fIdx]) curr[fIdx] = { ...faq };
                                    curr[fIdx].a = e.target.value;
                                    updateContentField(index, 'faqs', curr);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg"
                                  placeholder="Answer explanation..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── POPULAR CITIES & ABOUT BOX EDITOR ─────────────────────── */}
                    {sec.type === 'cityLinks' && (
                      <div className="space-y-5 pt-2">
                        {/* Cities Manager */}
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div>
                              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                Major Pickup Cities (Location Badges)
                              </label>
                              <p className="text-[11px] text-slate-400">
                                Cities displayed as clickable quick-service chips on the homepage.
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const defaultCities = [
                                    { name: "Mumbai", slug: "mumbai" },
                                    { name: "Delhi", slug: "delhi" },
                                    { name: "Bangalore", slug: "bangalore" },
                                    { name: "Hyderabad", slug: "hyderabad" },
                                    { name: "Chennai", slug: "chennai" },
                                    { name: "Kolkata", slug: "kolkata" },
                                    { name: "Pune", slug: "pune" },
                                    { name: "Ahmedabad", slug: "ahmedabad" },
                                    { name: "Jaipur", slug: "jaipur" },
                                    { name: "Lucknow", slug: "lucknow" },
                                    { name: "Chandigarh", slug: "chandigarh" },
                                    { name: "Kochi", slug: "kochi" },
                                    { name: "Indore", slug: "indore" },
                                    { name: "Nagpur", slug: "nagpur" },
                                    { name: "Coimbatore", slug: "coimbatore" },
                                    { name: "Noida", slug: "noida" },
                                    { name: "Gurgaon", slug: "gurgaon" },
                                    { name: "Surat", slug: "surat" },
                                  ];
                                  updateContentField(index, 'cities', defaultCities);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border-none cursor-pointer transition-colors"
                              >
                                Reset Defaults
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = Array.isArray(sec.content?.cities) ? [...sec.content.cities] : [];
                                  curr.push({
                                    name: "New City",
                                    slug: "new-city",
                                  });
                                  updateContentField(index, 'cities', curr);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer border-none shadow-xs transition-colors"
                              >
                                <Plus size={13} />
                                <span>Add City</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {(Array.isArray(sec.content?.cities) ? sec.content.cities : [
                              { name: "Mumbai", slug: "mumbai" },
                              { name: "Delhi", slug: "delhi" },
                              { name: "Bangalore", slug: "bangalore" },
                              { name: "Hyderabad", slug: "hyderabad" },
                              { name: "Chennai", slug: "chennai" },
                              { name: "Kolkata", slug: "kolkata" },
                              { name: "Pune", slug: "pune" },
                              { name: "Ahmedabad", slug: "ahmedabad" },
                              { name: "Jaipur", slug: "jaipur" },
                              { name: "Lucknow", slug: "lucknow" },
                              { name: "Chandigarh", slug: "chandigarh" },
                              { name: "Kochi", slug: "kochi" },
                              { name: "Indore", slug: "indore" },
                              { name: "Nagpur", slug: "nagpur" },
                              { name: "Coimbatore", slug: "coimbatore" },
                              { name: "Noida", slug: "noida" },
                              { name: "Gurgaon", slug: "gurgaon" },
                              { name: "Surat", slug: "surat" },
                            ]).map((city, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                                <div className="flex-1 space-y-1">
                                  <input
                                    type="text"
                                    value={city.name || ''}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.cities) ? [...sec.content.cities] : [];
                                      if (!curr[cIdx]) curr[cIdx] = { ...city };
                                      curr[cIdx].name = e.target.value;
                                      updateContentField(index, 'cities', curr);
                                    }}
                                    className="w-full px-2 py-1 text-xs font-bold text-slate-800 border border-slate-200 rounded-md"
                                    placeholder="City Name"
                                  />
                                  <input
                                    type="text"
                                    value={city.slug || ''}
                                    onChange={(e) => {
                                      const curr = Array.isArray(sec.content?.cities) ? [...sec.content.cities] : [];
                                      if (!curr[cIdx]) curr[cIdx] = { ...city };
                                      curr[cIdx].slug = e.target.value;
                                      updateContentField(index, 'cities', curr);
                                    }}
                                    className="w-full px-2 py-1 text-[11px] font-mono text-slate-500 border border-slate-200 rounded-md"
                                    placeholder="slug (e.g. mumbai)"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const curr = Array.isArray(sec.content?.cities) ? [...sec.content.cities] : [];
                                    curr.splice(cIdx, 1);
                                    updateContentField(index, 'cities', curr);
                                  }}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border-none bg-transparent cursor-pointer shrink-0"
                                  title="Delete city"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Company Summary / AEO Box */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              About SecondSale in 30 Seconds (AEO / SEO Box)
                            </label>
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sec.content?.showAboutBox !== false}
                                onChange={(e) => updateContentField(index, 'showAboutBox', e.target.checked)}
                                className="rounded text-blue-600"
                              />
                              <span>Display Box</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Box Heading</label>
                            <input
                              type="text"
                              value={sec.content?.aboutTitle ?? "About SecondSale in 30 seconds"}
                              onChange={(e) => updateContentField(index, 'aboutTitle', e.target.value)}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg bg-white"
                              placeholder="e.g. About SecondSale in 30 seconds"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Summary Text</label>
                            <textarea
                              rows={3}
                              value={sec.content?.aboutText ?? "SecondSale is an Indian online platform where consumers sell used smartphones, tablets, laptops, and iMacs. Users receive an instant quote, schedule free doorstep pickup, and get paid via UPI, bank transfer, or cash after device verification. SecondSale operates across 2,000+ Indian cities and is operated by Swastika Innovation Private Limited."}
                              onChange={(e) => updateContentField(index, 'aboutText', e.target.value)}
                              className="w-full px-3 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg bg-white"
                              placeholder="Company summary text..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Done button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(null)}
                        className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 cursor-pointer"
                      >
                        ✓ Done Editing Section
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

