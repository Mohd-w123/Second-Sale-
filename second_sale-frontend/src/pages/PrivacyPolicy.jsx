import { useState, useEffect } from "react";
import axios from "axios";
import SEOHead from "../components/seo/SEOHead";
import { SUPPORT_EMAIL, LEGAL_NAME } from "../config/seo";
import { buildSchemaGraph, organizationSchema, websiteSchema } from "../utils/schema";

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PrivacyPolicyPage() {
  const [dbPage, setDbPage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/pages/privacy-policy`)
      .then((res) => {
        if (res.data) setDbPage(res.data);
      })
      .catch(() => {});
  }, []);

  const schema = buildSchemaGraph([organizationSchema(), websiteSchema()]);

  return (
    <div className="w-full bg-white">
      <SEOHead
        title={dbPage?.metaTitle || "Privacy Policy — SecondSale"}
        description={
          dbPage?.metaDescription ||
          "SecondSale privacy policy. Learn how Swastika Innovation Private Limited collects, uses, and protects your personal information."
        }
        path="/privacy-policy"
        schema={schema}
      />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {dbPage?.content ? (
          <div dangerouslySetInnerHTML={{ __html: dbPage.content }} />
        ) : (
          <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              {dbPage?.title || "Privacy Policy"}
            </h1>
            <div className="prose prose-blue text-gray-600">
              <p className="mb-4">Last updated: March 2026</p>
              <p className="mb-4">
                At SecondSale, operated by {LEGAL_NAME}, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information when you use our website and services at secondsale.in.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our buyback services, including processing transactions, scheduling pickups, sending confirmations and invoices, and verifying device ownership.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal data. We recommend factory resetting your device before pickup to remove personal data from your device.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at {SUPPORT_EMAIL}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
