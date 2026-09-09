import { useState, useEffect } from "react";
import axios from "axios";
import SEOHead from "../components/seo/SEOHead";
import { SUPPORT_EMAIL, LEGAL_NAME } from "../config/seo";
import { buildSchemaGraph, organizationSchema, websiteSchema } from "../utils/schema";

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TermsAndConditionsPage() {
  const [dbPage, setDbPage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/pages/terms-and-conditions`)
      .then((res) => {
        if (res.data) setDbPage(res.data);
      })
      .catch(() => {});
  }, []);

  const schema = buildSchemaGraph([organizationSchema(), websiteSchema()]);

  return (
    <div className="w-full bg-white">
      <SEOHead
        title={dbPage?.metaTitle || "Terms & Conditions — SecondSale"}
        description={
          dbPage?.metaDescription ||
          "SecondSale terms and conditions for selling old devices online in India. Operated by Swastika Innovation Private Limited."
        }
        path="/terms-and-conditions"
        schema={schema}
      />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {dbPage?.content ? (
          <div dangerouslySetInnerHTML={{ __html: dbPage.content }} />
        ) : (
          <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              {dbPage?.title || "Terms & Conditions"}
            </h1>
            <div className="prose prose-blue text-gray-600">
              <p className="mb-4">Last updated: March 2026</p>
              <p className="mb-4">
                Please read these terms and conditions carefully before using our service. By accessing or using the SecondSale platform operated by {LEGAL_NAME}, you agree to be bound by these terms.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Use of the Service</h2>
              <p className="mb-4">
                You must be at least 18 years old to use our service. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Device Sales</h2>
              <p className="mb-4">
                When you sell a device through our platform, you warrant that you are the legal owner of the device and have the right to sell it. The device must not be stolen, counterfeit, or subject to any financing agreements.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Quotations and Payments</h2>
              <p className="mb-4">
                The initial quote provided on our website is an estimate based on the condition you describe. The final price may be adjusted after physical inspection of the device. Payments will be processed promptly after final agreement via UPI, bank transfer, or cash.
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Contact</h2>
              <p className="mb-4">
                For questions about these terms, contact us at {SUPPORT_EMAIL}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
