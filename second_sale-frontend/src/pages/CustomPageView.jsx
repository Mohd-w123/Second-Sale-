import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Home, Calendar, Clock, AlertCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

import NotFoundPage from './NotFoundPage';

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CustomPageView({ slugOverride }) {
  const params = useParams();
  const slug = slugOverride || params.slug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API}/pages/${slug}`);
        setPage(res.data);
      } catch (err) {
        console.error('Failed to load page:', err);
        setError(err.response?.status === 404 ? 'Page Not Found' : 'Error loading page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return <NotFoundPage />;
  }

  const isFullLayout = Boolean(page.content && (page.content.includes('<section') || page.content.includes('class="relative overflow-hidden')));

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${page.metaTitle || page.title} | SecondSale`}
        description={page.metaDescription || `Read ${page.title} on SecondSale.`}
      />

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/" className="flex items-center gap-1 hover:text-blue-600 no-underline text-slate-500">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} />
          <span>Pages</span>
          <ChevronRight size={13} />
          <span className="text-slate-800 font-semibold truncate">{page.title}</span>
        </div>
      </div>

      {/* Page Body */}
      {isFullLayout ? (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/90">
            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {page.title}
            </h1>

            {/* Meta line */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 border-b border-slate-100 pb-6 mb-8">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>
                  Last updated on {new Date(page.updatedAt).toLocaleDateString('en-IN', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Rendered Rich Text Content */}
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base [&>h1]:text-2xl [&>h1]:font-extrabold [&>h1]:text-slate-900 [&>h1]:mt-6 [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:my-4 [&>a]:text-blue-600 [&>a]:underline [&>hr]:my-6 [&>hr]:border-slate-200"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </article>
        </div>
      )}
    </div>
  );
}
