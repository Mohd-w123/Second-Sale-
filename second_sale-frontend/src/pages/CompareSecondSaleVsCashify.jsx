import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import { buildSchemaGraph, organizationSchema, websiteSchema } from '../utils/schema';

const COMPARISON_ROWS = [
  { feature: 'Free doorstep pickup', secondsale: 'Yes — 2,000+ cities', cashify: 'Yes — major cities' },
  { feature: 'Instant online quote', secondsale: 'Yes', cashify: 'Yes' },
  { feature: 'Payment methods', secondsale: 'UPI, bank transfer, cash', cashify: 'UPI, bank transfer, wallet' },
  { feature: 'Device categories', secondsale: 'Mobile, tablet, laptop, iMac', cashify: 'Mobile, laptop, tablet, more' },
  { feature: 'Transparent pricing', secondsale: 'Fixed quote — no haggling', cashify: 'Quote-based pricing' },
  { feature: 'Corporate bulk disposal', secondsale: 'Yes — dedicated program', cashify: 'Yes' },
  { feature: 'Data security', secondsale: 'Verified agents, reset guidance', cashify: 'Data wipe services' },
  { feature: 'Official invoice', secondsale: 'Yes', cashify: 'Yes' },
];

export default function CompareSecondSaleVsCashify() {
  const schema = buildSchemaGraph([organizationSchema(), websiteSchema()]);

  return (
    <>
      <SEOHead
        title="SecondSale vs Cashify — Compare Device Buyback Platforms in India"
        description="Compare SecondSale and Cashify for selling old phones, laptops and tablets in India. Features, pickup, payment, and pricing compared side by side."
        path="/compare/secondsale-vs-cashify"
        schema={schema}
      />
      <div className="max-w-[900px] mx-auto px-4 py-12 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
          SecondSale vs Cashify
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          An honest comparison of two leading device buyback platforms in India. Both help you sell old electronics online with doorstep pickup — here's how they compare on key features.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFF]">
                <th className="text-left p-4 font-black text-gray-900">Feature</th>
                <th className="text-left p-4 font-black text-[#0565E6]">SecondSale</th>
                <th className="text-left p-4 font-black text-gray-700">Cashify</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="border-t border-gray-100">
                  <td className="p-4 font-semibold text-gray-800">{row.feature}</td>
                  <td className="p-4 text-gray-600">{row.secondsale}</td>
                  <td className="p-4 text-gray-600">{row.cashify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#EEF4FF] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-3">Why choose SecondSale?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            SecondSale focuses on transparent, no-haggle pricing with free pickup across 2,000+ Indian cities. Get an instant quote, schedule pickup from home, and receive payment immediately after verification.
          </p>
          <Link
            to="/sell-old-mobile-phones/brand"
            className="inline-flex items-center gap-2 bg-[#0565E6] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#044ab8] transition-colors no-underline"
          >
            Sell your device on SecondSale
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          This comparison is based on publicly available information and SecondSale's service offerings. Features may vary. Cashify is a registered trademark of its respective owner.
        </p>
      </div>
    </>
  );
}
