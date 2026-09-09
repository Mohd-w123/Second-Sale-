import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEOHead from '../components/seo/SEOHead';
import { EXPANDED_FAQS } from '../data/faqs';
import { buildSchemaGraph, faqPageSchema, organizationSchema, websiteSchema } from '../utils/schema';

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function FAQPage() {
  const [dbPage, setDbPage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/pages/faq`)
      .then((res) => {
        if (res.data) setDbPage(res.data);
      })
      .catch(() => {});
  }, []);

  const schema = buildSchemaGraph([
    organizationSchema(),
    websiteSchema(),
    faqPageSchema(EXPANDED_FAQS),
  ]);

  return (
    <>
      <SEOHead
        title={dbPage?.metaTitle || "SecondSale FAQs — Sell Old Devices Online in India"}
        description={
          dbPage?.metaDescription ||
          "Find answers about selling old phones, laptops, tablets and iMac on SecondSale. Pricing, free pickup, payment methods, and Cashify alternatives explained."
        }
        path="/faq"
        schema={schema}
      />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {dbPage?.content ? (
          <div dangerouslySetInnerHTML={{ __html: dbPage.content }} />
        ) : (
          <div className="max-w-[850px] mx-auto py-12 sm:py-20">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              {dbPage?.title || "Frequently Asked Questions"}
            </h1>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Everything you need to know about selling your old devices on SecondSale — India's trusted buyback platform.
            </p>

            <div className="space-y-6">
              {EXPANDED_FAQS.map((faq) => (
                <article key={faq.q} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </article>
              ))}
            </div>

            <p className="mt-12 text-sm text-gray-500 pt-6 border-t border-gray-100">
              Still have questions?{' '}
              <Link to="/help-center" className="text-[#2563EB] font-bold hover:underline">
                Contact our support team
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </>
  );
}
