import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Phone, Mail, MapPin } from "lucide-react";
import SEOHead from "../components/seo/SEOHead";
import { PHONE, SUPPORT_EMAIL } from "../config/seo";
import { buildSchemaGraph, organizationSchema, websiteSchema } from "../utils/schema";

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function HelpCenterPage() {
  const [dbPage, setDbPage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/pages/help-center`)
      .then((res) => {
        if (res.data) setDbPage(res.data);
      })
      .catch(() => {});
  }, []);

  const schema = buildSchemaGraph([organizationSchema(), websiteSchema()]);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={dbPage?.metaTitle || "SecondSale Help Center — FAQs & Support"}
        description={
          dbPage?.metaDescription ||
          "Contact SecondSale support for help selling your old phone, laptop, or tablet. Phone, email, and WhatsApp support available across India."
        }
        path="/help-center"
        schema={schema}
      />
      <div className="max-w-[1200px] mx-auto px-4">
        {dbPage?.content ? (
          <div className="mb-12" dangerouslySetInnerHTML={{ __html: dbPage.content }} />
        ) : (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              {dbPage?.title || "How can we help?"}
            </h1>
            <p className="text-lg text-gray-600">Get in touch with our support team for any queries or assistance.</p>
            <p className="mt-3">
              <Link to="/faq" className="text-[#2563EB] font-bold hover:underline">
                Browse FAQs →
              </Link>
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Contact Info */}
            <div className="bg-[#2563EB] p-10 text-white">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone Support</h3>
                    <p className="text-blue-100">{PHONE}</p>
                    <p className="text-sm text-blue-200 mt-1">Mon-Sun from 9:30am to 7:30pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-blue-100">{SUPPORT_EMAIL}</p>
                    <p className="text-sm text-blue-200 mt-1">We aim to reply within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Service Area</h3>
                    <p className="text-blue-100">Pan-India — 2,000+ cities<br />Operated by Swastika Innovation Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out. Our support team will contact you shortly!'); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows="4" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#2563EB] text-white font-bold rounded-xl py-3 hover:bg-blue-700 transition duration-200 cursor-pointer">
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
