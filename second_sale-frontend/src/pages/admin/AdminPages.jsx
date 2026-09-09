import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import RichTextEditor from '../../components/ui/RichTextEditor';
import {
  FileText, Plus, Search, Edit2, Trash2, ExternalLink,
  CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Globe,
  Calendar, Layers, ArrowRight, X, Sparkles
} from 'lucide-react';
import './admin.css';

const INITIAL_PAGE_STATE = {
  title: '',
  slug: '',
  content: '<p>Write your detailed content here...</p>',
  featuredImage: '',
  metaTitle: '',
  metaDescription: '',
  isPublished: true,
  showInFooter: false,
  footerColumn: 'Company',
};

export const getPageUrl = (slug) => {
  if (!slug) return '/';
  const clean = String(slug).replace(/^\/+/, '');
  return `/${clean}`;
};

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_PAGE_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPages({ search });
      setPages(res.data || []);
    } catch (err) {
      console.error('Failed to load pages:', err);
      showFeedback('error', 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [search]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_PAGE_STATE);
    setShowModal(true);
  };

  const handleOpenEdit = (page) => {
    setEditingId(page._id);
    setFormData({
      title: page.title || '',
      slug: page.slug || '',
      content: page.content || '',
      featuredImage: page.featuredImage || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      isPublished: Boolean(page.isPublished),
      showInFooter: Boolean(page.showInFooter),
      footerColumn: page.footerColumn || 'Company',
    });
    setShowModal(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      metaTitle: editingId ? prev.metaTitle : title,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Page title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await adminService.updatePage(editingId, formData);
        showFeedback('success', 'Page updated successfully!');
      } else {
        await adminService.createPage(formData);
        showFeedback('success', 'New page created successfully!');
      }
      setShowModal(false);
      fetchPages();
    } catch (err) {
      console.error('Failed to save page:', err);
      alert(err.response?.data?.message || 'Failed to save page');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (page) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${page.title}"?`)) return;
    try {
      await adminService.deletePage(page._id);
      showFeedback('success', 'Page deleted successfully');
      fetchPages();
    } catch (err) {
      console.error('Failed to delete page:', err);
      showFeedback('error', 'Failed to delete page');
    }
  };

  const handleTogglePublish = async (page) => {
    try {
      await adminService.updatePage(page._id, { isPublished: !page.isPublished });
      showFeedback('success', `Page ${page.isPublished ? 'moved to draft' : 'published'}`);
      fetchPages();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="admin-content-inner p-4 sm:p-6 max-w-[1300px] mx-auto">
      {/* Feedback Toast */}
      {feedback && (
        <div className={`fixed top-5 right-5 z-[3000] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold transition-all ${
          feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="text-blue-600" size={26} />
            Custom Pages (CMS)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and edit custom policy pages, promotional landing articles, and information pages with a rich text editor.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all border-none cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <button
          onClick={fetchPages}
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200 bg-white cursor-pointer self-end sm:self-auto"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="animate-spin mb-2" size={28} />
            <p className="text-sm font-medium">Loading custom pages...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto text-slate-300 mb-3" size={48} />
            <h3 className="text-base font-bold text-slate-700">No custom pages found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first rich-text custom page (e.g. Warranty Policy, Privacy Updates, Corporate FAQs).
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer hover:bg-blue-700 transition-colors"
            >
              + Create First Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Page Title & URL</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Footer Placement</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono mt-0.5">
                        <Globe size={11} className="text-slate-400" />
                        <span className="font-bold text-blue-600">{getPageUrl(p.slug)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer transition-colors ${
                          p.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {p.showInFooter ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Column: {p.footerColumn || 'Company'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.updatedAt).toLocaleDateString('en-IN', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={getPageUrl(p.slug)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={`View Live Page (${getPageUrl(p.slug)})`}
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                          title="Edit Content"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: CREATE / EDIT PAGE ────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/75 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingId ? 'Edit Page' : 'Create Custom Page'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compose your content using the rich text formatting toolbar.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Refurbished Warranty Policy"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug * (Live at <span className="text-blue-600 font-mono">{getPageUrl(formData.slug || 'your-slug')}</span>)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. refurbished-warranty-policy"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Page Content (Rich Text Editor)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Supports Headings, Lists, Links, Quotes, Formatting</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
                />
              </div>

              {/* SEO & Placement Settings */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  SEO & Footer Placement
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Page title shown on Google"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">SEO Meta Description</label>
                    <input
                      type="text"
                      placeholder="Summary snippet for search engines"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Publish live on website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.showInFooter}
                      onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Show link in website Footer</span>
                  </label>

                  {formData.showInFooter && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Column:</span>
                      <select
                        value={formData.footerColumn}
                        onChange={(e) => setFormData({ ...formData, footerColumn: e.target.value })}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white font-semibold"
                      >
                        <option value="Services">Services</option>
                        <option value="Company">Company</option>
                        <option value="Help & Support">Help & Support</option>
                        <option value="Legal & Trust">Legal & Trust</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 border-none cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Page' : 'Publish Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
