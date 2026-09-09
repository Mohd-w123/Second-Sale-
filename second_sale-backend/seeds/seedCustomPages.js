import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import CustomPage from '../models/CustomPage.js';

const customPagesData = [
  // ── 1. About Us ──────────────────────────────────────────
  {
    title: 'About Us',
    slug: 'about-us',
    metaTitle: "About SecondSale — India's Trusted Device Buyback Platform",
    metaDescription: "Learn about SecondSale, operated by Swastika Innovation Private Limited. India's trusted platform to sell old phones, laptops, tablets, smartwatches, and iMac online.",
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Company',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>✨</span> Trusted Tech Buyback Partner
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          About <span class="text-[#2563EB]">Swastika Innovation</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Welcome to <strong class="text-gray-950 font-black">Swastika Innovation Private Limited</strong>, your trusted partner in the premium second-hand electronics market. We specialize in the sale and purchase of high-quality, pre-owned IT products, ensuring that premium technology is accessible, sustainable, and reliable.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">25+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Years Industry Trust</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">2,000+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Cities Covered</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">500K+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Devices Rehomed</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">4.9★</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Customer Rating</div>
          </div>
        </div>
      </section>

      <!-- WHAT WE DO SECTION -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Our Core Business
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            What We Do
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            At Swastika Innovation, we breathe new life into consumer electronics. We provide a seamless, trustworthy platform for buying and selling a wide range of second-hand tech.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📱</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Mobile Phones & Laptops</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Premium pre-owned smartphones and high-performance notebooks restored to flawless functionality.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📺</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Televisions (TVs)</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Certified home entertainment systems and smart televisions at a fraction of retail prices.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">⌚</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Smartwatches & EarPods</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Wearables and audio accessories checked rigorously for battery health and acoustic precision.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">🎧</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Other IT Accessories</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Essential linked IT peripherals and accessories tested and backed by our guarantee.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">🛡️</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">Our Sustainable Mission</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our mission is to deliver client-centric solutions that offer exceptional value while promoting a circular economy in the tech industry. We aim to minimize e-waste by extending the lifespan of premium hardware.
            </p>
          </div>
        </div>
      </section>

      <!-- VISION & MISSION -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">👁️</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Our Vision</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              To become the most trusted and innovative ecosystem for pre-owned technology, bridging the gap between premium electronics and affordability while leading the transition toward a zero-waste, sustainable digital future.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🎯</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Our Mission</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              To revolutionize the second-hand IT market by delivering client-centric solutions grounded in transparency, meticulous quality assurance, and fair value. Combining decades of grassroots operational expertise with cutting-edge business strategies, we empower consumers to upgrade responsibly.
            </p>
          </div>
        </div>
      </section>

      <!-- LEADERSHIP SECTION -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Leadership
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Meet Our Leadership
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The strength of Swastika Innovation Private Limited lies in the unparalleled expertise and visionary leadership of our founding partners.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-[28px] p-8 sm:p-10 border border-gray-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shadow-purple-200">
                  AS
                </div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900 leading-none">Aditya Sekhar</h3>
                  <p class="text-xs sm:text-sm font-bold text-indigo-600 mt-1.5 uppercase tracking-wider">Chairman & Co-Founder</p>
                </div>
              </div>
              <p class="text-sm sm:text-base text-gray-600 mb-6 font-medium leading-relaxed">
                Aditya Sekhar is a business leader, entrepreneur, and one of the youngest research scholars in Smart Cities. As Chairman of Micro Cloud Computing Pvt. Ltd., he brings strong leadership and strategic vision to SecondSale.
              </p>
              <div class="space-y-3 text-xs sm:text-sm text-gray-600">
                <div class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold">✓</span>
                  <span>One of the youngest Research Scholars in Smart Cities; Chairman of Micro Cloud Computing.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold">✓</span>
                  <span>Represented India at the BRICS Connect Conference in New York, contributing perspectives on global business.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold">✓</span>
                  <span>Recognized with prestigious awards from Forbes and StarPlus for his leadership.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold">✓</span>
                  <span>Holds a Master's degree in International Business; passionate about customer-first innovation.</span>
                </div>
              </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-400">
              💼 Chairman & Co-Founder, SecondSale
            </div>
          </div>

          <div class="bg-white rounded-[28px] p-8 sm:p-10 border border-gray-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shadow-[#2563EB]/20">
                  PV
                </div>
                <div>
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900 leading-none">Pankaj Vinda</h3>
                  <p class="text-xs sm:text-sm font-bold text-[#2563EB] mt-1.5 uppercase tracking-wider">Founder</p>
                </div>
              </div>
              <div class="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 mb-6">
                <span class="text-xs font-bold text-[#2563EB] uppercase tracking-widest block mb-1">Expertise Accent</span>
                <div class="text-base sm:text-lg font-extrabold text-gray-900">25+ Years in Consumer Electronics</div>
                <div class="text-xs sm:text-sm text-[#2563EB] mt-1">Including 5+ years of hands-on e-commerce leadership.</div>
              </div>
              <p class="text-sm sm:text-base text-gray-600 mb-4 font-medium leading-relaxed">
                With over 25 years of experience in the consumer electronics industry, Pankaj Vinda has built a career rooted in expertise and trust.
              </p>
              <div class="space-y-3 text-xs sm:text-sm text-gray-600">
                <div class="flex items-start gap-2.5">
                  <span class="text-[#2563EB] font-bold">✓</span>
                  <span>Began his journey in 2006 as a Team Leader at a Nokia Service Centre, gaining deep mobile hardware mastery.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-[#2563EB] font-bold">✓</span>
                  <span>Over the years, expanded expertise across mobile phones, laptops, TVs, and IT products.</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="text-[#2563EB] font-bold">✓</span>
                  <span>Brings 5+ years in e-commerce, founding SecondSale to make gadget trade-ins transparent and fair.</span>
                </div>
              </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-400">
              💼 Founder, SecondSale
            </div>
          </div>
        </div>
      </section>

      <!-- COMMITMENT SECTION -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Our Commitment to Excellence
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          By combining cutting-edge global business strategies with decades of grassroots industry experience, Swastika Innovation Private Limited is uniquely positioned to revolutionize the second-hand IT market. Whether you are upgrading your smartphone or liquidating enterprise hardware, we guarantee a transparent, profitable, and secure experience.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🛡️</span> Transparent Pricing
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>✓</span> Rigorous Quality Inspection
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🌍</span> Ethical Circular Economy
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">About SecondSale in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          SecondSale, operated by Swastika Innovation Private Limited, is India's leading re-commerce platform offering doorstep device buyback across 2,000+ cities with instant on-the-spot payment and military-grade data sanitization.
        </p>
      </section>
    `
  },

  // ── 2. Become a Partner ──────────────────────────────────
  {
    title: 'Become a Partner',
    slug: 'partner',
    metaTitle: 'Become a SecondSale Partner — Join Our Pickup Network',
    metaDescription: 'Join SecondSale as a retail partner. Local shops, refurbishers, and technicians can earn daily pre-qualified leads with zero setup fees across India.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Company',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>🤝</span> Retail & Channel Partner Ecosystem
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Scale Your Offline <span class="text-[#2563EB]">Retail Tech Business</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Join India's fastest-growing electronics buyback network. Monetize customer footfall, acquire verified device leads, and earn premium commissions on every trade-in with zero setup costs.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">3K+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Active Partners</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">₹500Cr+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Assets Processed</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">4.9/5</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Partner Rating</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">100+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Cities Covered</div>
          </div>
        </div>
      </section>

      <!-- WHAT WE OFFER -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Partner Benefits
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Why 3,000+ Retailers Partner With SecondSale
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Turn walk-in shoppers and online device leads into immediate, guaranteed revenue streams with our complete partner infrastructure.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📈</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Pre-Qualified Leads</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Receive daily customer trade-in bookings in your immediate pin code area, already agreed to fair market prices.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">⚡</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Instant UPI Payouts</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Enjoy direct settlement upon successful device acquisition with zero payment delays or escrow holding.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">🛡️</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Complete Legal Autonomy</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Our platform handles GST invoicing, device title verification, and diagnostic logs automatically.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📱</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Partner Mobile App</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Dedicated technician dashboard to accept leads, perform guided diagnostics, and view earnings in real time.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">💰</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">Zero Onboarding & Joining Fee</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              We believe in true partnership. There are zero upfront franchise fees, zero monthly software subscription charges, and zero hidden penalties.
            </p>
          </div>
        </div>
      </section>

      <!-- PARTNER VERTICALS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🏪</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Retail Mobile Outlets & Stores</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Upgrade your brick-and-mortar storefront into an authorized SecondSale Trade-In Desk. Convert customers asking to exchange their old devices during new smartphone purchases with instant exchange value.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🔧</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Repair Centers & Technicians</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Monetize unrepairable or customer-surrendered gadgets. Offer quick cash payouts to customers whose repairs exceed their budget, and procure certified spare parts inventory.
            </p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            How It Works
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Start Earning in 3 Simple Steps
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Get approved and receive your first customer buyback lead within 24 hours.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">1</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Submit Online KYC</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Provide your shop name, address, GSTIN/PAN, and bank payout details through our partner registration portal.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">2</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Quick 24-Hr Verification</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Our regional manager conducts a rapid telephonic verification and provides your Partner App credentials.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">3</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Receive Daily Leads</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Accept customer pickup leads within your territory, verify device health via the app, and earn instant commissions.</p>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Partner Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Our Commitment to Partner Success
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          We back every authorized SecondSale partner with guaranteed pricing, zero liability on legal ownership disputes, and round-the-clock partner support.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>⚡</span> Instant UPI Settlements
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🛡️</span> Zero Setup or Joining Fee
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>📞</span> Dedicated Regional Partner Desk
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale Partner Network in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Join over 3,000 retail electronics outlets and service centers across India earning daily profit margins on second-hand smartphone, laptop, and gadget buybacks.
        </p>
      </section>
    `
  },

  // ── 3. Corporate Page ────────────────────────────────────
  {
    title: 'Corporate Buyback & IT Asset Disposal',
    slug: 'corporate',
    metaTitle: 'Corporate IT Asset Disposal — Bulk Device Buyback | SecondSale',
    metaDescription: 'SecondSale Corporate helps businesses dispose of laptops, desktops, and IT assets securely with bulk pickup, compliance documentation, and transparent pricing.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Company',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>🏢</span> Enterprise ITAD & Asset Liquidation Solutions
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Streamline Your <span class="text-[#2563EB]">Corporate Device Disposal</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Enterprise-grade solutions for disposing of IT assets, retired laptops, workstations, and bulk mobile devices. Get maximum residual value with complete regulatory compliance and zero hassle.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">500+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Corporate Clients</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">₹1000Cr+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Assets Liquidated</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">4.8/5</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Client Rating</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">24/7</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Enterprise Support</div>
          </div>
        </div>
      </section>

      <!-- WHAT WE DO -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Enterprise Solutions
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Comprehensive IT Asset Disposal (ITAD)
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From growing startups to multinational conglomerates, we handle your entire electronic hardware decommissioning with certified compliance.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">⚡</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Quick Turnaround</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Process large volumes of devices in days, not months. Streamlined logistics ensure rapid asset liquidation and space recovery.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">🛡️</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Certified Data Security</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Military-grade data wiping adhering to DoD 5220.22-M & NIST 800-88 standards. Serialized erasure certificates provided.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📊</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Transparent Auditing</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Detailed asset audit reports, serial/IMEI logs, GST-compliant documentation, and real-time tracking of every device.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">👥</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Dedicated Support</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Personal corporate account manager ensures smooth handling, flexible payment terms, and custom pickup schedules.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">🌱</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">ESG Compliance & Circular Economy Impact</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Every device liquidated through SecondSale supports your corporate ESG score by preventing hazardous e-waste and recycling reusable materials ethically.
            </p>
          </div>
        </div>
      </section>

      <!-- INDUSTRY VERTICALS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">💻</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">IT & Software Companies</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Decommission employee laptops, MacBooks, Dell/Lenovo workstations, and office monitors during tech refresh cycles with on-site serial logging and certificate generation.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🏦</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">BFSI & Healthcare Institutions</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Highest security threshold wiping for banking terminals, hospital tablets, and executive devices with strict chain-of-custody tracking and regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      <!-- 4-STEP ITAD WORKFLOW -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            The ITAD Workflow
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Simple 4-Step Institutional Process
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From initial asset sheet to final bank wire transfer in less than 7 days.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">1</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Share Asset Sheet</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Provide inventory specs, model counts, and hardware configurations.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">2</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Instant Valuation</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Receive guaranteed commercial bid with customized payment terms.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">3</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Pan-India Pickup</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Secure logistics team packs and transports devices from your office premises.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">4</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Settlement & Audit</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Immediate wire payment with serialized data wiping certificates.</p>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Enterprise Peace of Mind Guaranteed
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          SecondSale Corporate ensures 100% data sanitization, full GST accounting, and zero environmental leakage for every decommissioned asset.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🔒</span> Tamper-Proof Data Erasure
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>📋</span> 100% GST Compliant
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🌱</span> Zero-Landfill E-Waste Adherence
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale Corporate ITAD in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Trusted by 500+ Indian corporations to liquidate surplus IT hardware with certified military-grade data sanitization, full legal documentation, and top market returns.
        </p>
      </section>
    `
  },

  // ── 4. Help & Support Center ─────────────────────────────
  {
    title: 'Help & Support Center',
    slug: 'help-center',
    metaTitle: 'SecondSale Help Center — FAQs & Support',
    metaDescription: 'Contact SecondSale support for help selling your old phone, laptop, or tablet. Phone, email, and WhatsApp support available across India.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Help & Support',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>🎧</span> Dedicated Customer Care Desk
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          How Can We <span class="text-[#2563EB]">Help You Today?</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Have a question about your device valuation, doorstep pickup, or instant payment? Our support team is here to assist you every step of the way.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">&lt; 2hr</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Average Response</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">100%</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Free Pickup</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">2,000+</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Cities Covered</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">4.9★</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Customer Rating</div>
          </div>
        </div>
      </section>

      <!-- SUPPORT CHANNELS -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Direct Channels
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Connect With Our Support Specialists
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Reach out through your preferred communication method. We are ready to assist with any query.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📞</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Phone Hotline</h3>
            <p class="text-xs text-gray-400 mb-3">Mon–Sun from 9:30 AM to 7:30 PM IST</p>
            <a href="tel:+919876543210" class="text-sm font-bold text-[#2563EB] hover:underline">+91 98765 43210</a>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">✉️</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Priority Email</h3>
            <p class="text-xs text-gray-400 mb-3">Guaranteed reply within 2 business hours</p>
            <a href="mailto:support@secondsale.com" class="text-sm font-bold text-[#2563EB] hover:underline">support@secondsale.com</a>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">💬</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">WhatsApp Help</h3>
            <p class="text-xs text-gray-400 mb-3">Quick chat for pickup time updates</p>
            <span class="text-sm font-bold text-emerald-600">Available on Mobile</span>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">📍</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Pan-India Reach</h3>
            <p class="text-xs text-gray-400 mb-3">Operated by Swastika Innovation Pvt Ltd</p>
            <span class="text-sm font-bold text-gray-700">2,000+ Pin Codes</span>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">⚡</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">Zero-Hassle Cancellation</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Need to reschedule or cancel a booked pickup? You can easily change your pickup slot or cancel anytime with ₹0 cancellation penalty.
            </p>
          </div>
        </div>
      </section>

      <!-- COMMON TOPICS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🗓️</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Pickup Scheduling & Rescheduling</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Select your preferred date and time slot during order placement. Our field technician will call you 1 hour before arrival to confirm your presence at home or office.
            </p>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 list-none pl-0">
              <li>✓ Morning, afternoon, and evening pickup slots</li>
              <li>✓ Live SMS tracking of your pickup technician</li>
            </ul>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">💸</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Instant Payment Verification</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              We never ask you to wait. Our executive initiates the online transfer directly to your UPI ID (Google Pay, PhonePe, Paytm) or bank account before taking the device.
            </p>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 list-none pl-0">
              <li>✓ Instant UPI transfer confirmation SMS</li>
              <li>✓ Zero transaction or convenience deductions</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Unconditional Support Guarantee
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          Your peace of mind is our priority. From instant payment validation to zero-fee returns, we guarantee honest customer service at every touchpoint.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>⚡</span> Instant Payment Validation
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🛡️</span> 100% Free Cancellation
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🔒</span> Certified Hardware Data Wipe
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale Help Desk in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Need assistance? Our customer experience team is available 7 days a week via phone (+91 98765 43210), email (support@secondsale.com), or WhatsApp.
        </p>
      </section>
    `
  },

  // ── 5. Frequently Asked Questions ────────────────────────
  {
    title: 'Frequently Asked Questions (FAQs)',
    slug: 'faq',
    metaTitle: 'SecondSale FAQs — Sell Old Devices Online in India',
    metaDescription: "Find answers about selling old phones, laptops, tablets and iMac on SecondSale. Pricing, free pickup, payment methods, and Cashify alternatives explained.",
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Help & Support',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>❓</span> Clear Answers & Transparent Pricing
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Frequently Asked <span class="text-[#2563EB]">Questions</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Everything you need to know about selling old phones, laptops, smartwatches, and IT gadgets on SecondSale. Transparent evaluations, zero hidden fees, and instant doorstep payouts explained.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">100%</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Free Pickup</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Instant</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Spot Payout</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">₹0</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Cancellation Fee</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">DoD</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Certified Wipe</div>
          </div>
        </div>
      </section>

      <!-- TOP FAQ CARDS -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Popular Questions
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Top Answers for Device Sellers
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Browse through our most frequent queries regarding valuations, pickup logistics, and payment.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">1</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">How do I sell my device on SecondSale?</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Select your device model, answer a few quick questions regarding screen and body condition, receive an instant price quote, and schedule a convenient free doorstep pickup slot.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">2</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">When and how will I get paid?</h3>
            <p class="text-sm text-gray-500 leading-relaxed">You receive 100% instant payment on the spot. Our technician inspects the device and transfers funds directly to your UPI ID (GPay, PhonePe, Paytm) or bank account before leaving your doorstep.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">3</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Is the doorstep pickup really 100% free?</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Yes! SecondSale offers 100% free doorstep pickup across 2,000+ cities in India. There are zero pickup charges, zero convenience charges, and zero shipping deductions.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">4</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">What if the condition differs during inspection?</h3>
            <p class="text-sm text-gray-500 leading-relaxed">If our technician finds discrepancies between online inputs and physical hardware, a fair revised price is calculated. If you decline the offer, you pay ₹0 — zero inspection fee and zero cancellation charge.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">🔒</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">100% Data Security & Privacy Guarantee</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              We guide you to factory reset your device and remove all iCloud/Google accounts. In addition, our certified lab conducts Department of Defense (DoD) standard data wiping on all acquired gadgets.
            </p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS PROCESS -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            The Process
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How It Works from Quote to Cash
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Sell your device effortlessly in 3 simple steps.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">1</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Check Price Online</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Select model, declare condition, and get an instant transparent valuation.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">2</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Free Doorstep Pickup</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Our certified executive visits your home/office at your chosen date and time.</p>
          </div>
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-base mx-auto mb-4">3</div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Instant UPI Payment</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Funds are transferred to your account on the spot before the executive leaves.</p>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Zero-Risk Selling Promise
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          SecondSale gives you full control. If you are not completely satisfied with our doorstep offer, you pay nothing and keep your phone.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>₹0</span> Zero Pickup or Cancellation Charges
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>⚡</span> Instant UPI / Bank Transfer
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🔒</span> DoD Certified Data Sanitization
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale FAQs in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          SecondSale is India's premier device buyback service with 100% free doorstep pickup, zero hidden fees, instant payment, and certified data wiping across 2,000+ cities.
        </p>
      </section>
    `
  },

  // ── 6. Privacy Policy ────────────────────────────────────
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    metaTitle: 'Privacy Policy — SecondSale',
    metaDescription: 'SecondSale privacy policy. Learn how Swastika Innovation Private Limited collects, uses, and protects your personal information.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Legal & Trust',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>🔒</span> Bank-Grade Security & Data Confidentiality
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          SecondSale <span class="text-[#2563EB]">Privacy Policy</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          We value your trust above all else. Learn how Swastika Innovation Private Limited collects, utilizes, and protects your personal information and electronic data under industry-standard encryption.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">100%</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Data Confidentiality</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">DoD</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Hardware Sanitization</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Zero</div>
            <div class="text-xs font-bold text-gray-500 mt-1">3rd-Party Selling</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">256-Bit</div>
            <div class="text-xs font-bold text-gray-500 mt-1">SSL Encrypted</div>
          </div>
        </div>
      </section>

      <!-- DATA PRINCIPLES -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Data Principles
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Our Commitment to Personal Data Protection
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We adhere to the highest standards of data governance and compliance under Indian Information Technology laws.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Transparent Collection</h3>
            <p class="text-sm text-gray-500 leading-relaxed">We only gather essential contact details, pickup address, and device serial/IMEI data necessary to fulfill transactions.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Hardware Sanitization</h3>
            <p class="text-sm text-gray-500 leading-relaxed">All purchased electronic gadgets undergo laboratory DoD-grade data erasure ensuring no personal information remains.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Zero Commercial Sale</h3>
            <p class="text-sm text-gray-500 leading-relaxed">We never sell, rent, or trade your personal email, phone number, or KYC records to external advertising agencies.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">4</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Encrypted Cloud Storage</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Your profile, invoices, and transaction logs are safeguarded in high-security cloud environments protected by SSL encryption.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">🛡️</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">Data Protection Officer</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              If you have any questions or data deletion requests regarding our Privacy Policy, you can reach our designated Grievance Officer directly at <strong>support@secondsale.com</strong>.
            </p>
          </div>
        </div>
      </section>

      <!-- POLICY DETAILS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🆔</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Device Title & Ownership Verification</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              In accordance with Indian regulations against stolen or counterfeit electronics, our field technicians require a brief inspection of a valid government ID (Aadhaar, Voter ID, or Driving License) during pickup to confirm lawful ownership.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🗑️</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">User Rights & Deletion Requests</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              You retain full rights to request an extract of all personal data held by SecondSale or request permanent deletion of your account and personal history, subject to statutory tax record retention obligations.
            </p>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Legal Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Safe, Compliant & Accountable
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          Operated by Swastika Innovation Private Limited, SecondSale upholds absolute confidentiality and adheres to the Information Technology Act, 2000 and the Digital Personal Data Protection Act.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🛡️</span> 100% Data Confidentiality
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>📜</span> IT Act 2000 Compliant
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🔐</span> Certified Hardware Sanitization
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale Privacy Commitment in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We protect your personal data with 256-bit encryption, wipe all hardware to international DoD standards, and never sell or rent your contact details to third parties.
        </p>
      </section>
    `
  },

  // ── 7. Terms & Conditions ────────────────────────────────
  {
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    metaTitle: 'Terms & Conditions — SecondSale',
    metaDescription: 'SecondSale terms and conditions for selling old devices online in India. Operated by Swastika Innovation Private Limited.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Legal & Trust',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>📜</span> Transparent Platform Terms & Ethics
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          SecondSale <span class="text-[#2563EB]">Terms & Conditions</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Clear, fair, and straightforward terms governing the sale and buyback of pre-owned electronic devices on SecondSale, operated by Swastika Innovation Private Limited.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Fair</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Market Pricing</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Instant</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Doorstep Payout</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Verified</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Ownership</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Zero</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Cancellation Penalty</div>
          </div>
        </div>
      </section>

      <!-- OPERATING RULES -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Operating Rules
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Terms of Electronic Device Trade-In
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Please review our user guidelines designed to ensure a smooth, legitimate, and secure experience for all parties.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Lawful Ownership</h3>
            <p class="text-sm text-gray-500 leading-relaxed">The seller warrants that they are at least 18 years old and the sole legal owner of the device, free of liens or financing holds.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Diagnostic Check</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Initial online price quotes are subject to a transparent 10-minute diagnostic check by our certified field technician.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Immediate Payout</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Upon agreeing to the final offer, payment is disbursed instantly via UPI or bank transfer on the spot before handover.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">4</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Zero-Fee Cancellation</h3>
            <p class="text-sm text-gray-500 leading-relaxed">If you disagree with a revised price assessment, you are under zero obligation and can decline the sale with ₹0 penalty.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">⚖️</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">Legal Title Transfer & Sales Receipt</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Upon successful payment transfer, the title of the hardware permanently passes to Swastika Innovation Private Limited, and a digital bill of sale is issued to the seller.
            </p>
          </div>
        </div>
      </section>

      <!-- TERMS DETAILS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">📋</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Seller Warranties & ID Requirements</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Sellers must present a valid government-issued photo ID (Aadhaar, Driving License, or Passport). Devices that are reported lost, stolen, blocklisted, or locked with iCloud/Google activation locks cannot be purchased.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🏢</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Swastika Innovation Operational Scope</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              SecondSale is an operating brand of Swastika Innovation Private Limited. All legal disputes, arbitration, and jurisdiction are governed exclusively by the courts of New Delhi, India.
            </p>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          Fair, Honest & Binding Terms
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          We believe in complete contractual transparency. No surprise travel fees, no deductions after agreement, and immediate electronic payouts.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>⚖️</span> Legally Verified Transactions
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🤝</span> 100% Ethical Trading
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>💼</span> Swastika Innovation Backed
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">SecondSale Terms in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          You must be 18+ and the lawful owner of the device. Online quotes are finalized upon physical doorstep diagnosis, paid instantly via UPI, and include zero cancellation fees.
        </p>
      </section>
    `
  },

  // ── 8. Valuation & Return Policy ──────────────────────────
  {
    title: 'Valuation & Return Policy',
    slug: 'valuation-and-return-policy',
    metaTitle: 'Valuation, Inspection & Return Policy — SecondSale',
    metaDescription: 'Learn how SecondSale calculates algorithmic device valuations, what happens during doorstep physical verification, and our zero-fee return guarantee.',
    isPublished: true,
    showInFooter: true,
    footerColumn: 'Legal & Trust',
    content: `
      <!-- HERO HEADER -->
      <section class="relative overflow-hidden bg-gradient-to-br from-[#E6F4FF] via-white to-white pt-10 pb-14 px-4 text-center rounded-3xl border border-[#2563EB]/10 mb-12">
        <div class="inline-flex items-center gap-2 bg-[#E6F4FF] border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#2563EB] mb-6 shadow-sm">
          <span>🔍</span> Algorithmic Valuations & Return Rights
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
          Valuation, Diagnostic & <span class="text-[#2563EB]">Return Policy</span>
        </h1>
        <p class="text-base sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Understand how SecondSale determines fair market value for your electronics, what our certified technicians inspect at your doorstep, and our zero-fee return guarantee.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Algorithm</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Dynamic Pricing</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">10-Min</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Diagnostic Check</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">100% Free</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Return Guarantee</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-2xl font-black text-[#2563EB]">Instant</div>
            <div class="text-xs font-bold text-gray-500 mt-1">Spot Settlement</div>
          </div>
        </div>
      </section>

      <!-- VALUATION RULES -->
      <section class="mb-14">
        <div class="text-center mb-10">
          <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-4 border border-[#2563EB]/10">
            Valuation Rules
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How We Value Your Gadgets Fairly
          </h2>
          <p class="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our pricing system is calibrated against live market indices to ensure you receive top value for your pre-owned devices.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Algorithmic Valuation</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Calculated dynamically based on real-time market demand, model release date, storage capacity, and hardware condition.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">10-Min Diagnostic</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Our field executive tests display touch, camera lenses, battery health, speakers, and connectivity in front of you.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Honest Grading</h3>
            <p class="text-sm text-gray-500 leading-relaxed">If the hardware matches your declared answers, the full online quote is honored without any surprise deductions.</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-[#2563EB]/30 hover:shadow-xl transition-all">
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl font-bold">4</div>
            <h3 class="text-lg font-bold text-gray-900 mb-3">Zero-Fee Return</h3>
            <p class="text-sm text-gray-500 leading-relaxed">If you do not accept a re-evaluated price, our technician hands your device back immediately with ₹0 fee.</p>
          </div>
        </div>

        <div class="bg-[#F7FAFF] rounded-3xl p-8 sm:p-10 border border-[#2563EB]/10 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto shadow-sm">
          <div class="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-[#2563EB]/20 text-2xl">🛡️</div>
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-1.5">100% Risk-Free Return Assurance</h4>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              You are never pressured to sell. SecondSale gives you the final word. If you choose not to sell, your device is handed right back to you, no questions asked.
            </p>
          </div>
        </div>
      </section>

      <!-- INSPECTION STANDARDS -->
      <section class="mb-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🔬</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Diagnostic Checklist</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              Our automated diagnostic checklist ensures objectivity during inspection:
            </p>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 list-none pl-0">
              <li>✓ Screen touch responsiveness, dead pixels & discoloration check</li>
              <li>✓ Front and rear cameras, focus sensors & flash functionality</li>
              <li>✓ Battery health status & charging port connectivity</li>
              <li>✓ Microphone, speakers & biometrics (Fingerprint / Face ID)</li>
            </ul>
          </div>
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-md relative overflow-hidden">
            <div class="w-12 h-12 bg-[#E6F4FF] rounded-xl flex items-center justify-center text-[#2563EB] mb-6 text-2xl font-bold">🤝</div>
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-4">Immediate Cancellation Protocol</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              If an issue (such as an unmentioned screen spot or non-functional microphone) is uncovered:
            </p>
            <ul class="text-xs sm:text-sm text-gray-600 space-y-2 list-none pl-0">
              <li>✓ Technician shares the exact diagnostic finding with you</li>
              <li>✓ Transparent revised pricing is generated by the app</li>
              <li>✓ If you decline, technician immediately closes the job at ₹0 fee</li>
              <li>✓ Device remains in your hands with zero shipping or travel fee</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- GUARANTEE & COMMITMENT -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center mb-8">
        <span class="inline-block bg-[#E6F4FF] text-[#2563EB] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-[#2563EB]/10">
          Our Guarantee
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-6 tracking-tight">
          No Haggling, No Pressure Guarantee
        </h2>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
          SecondSale is designed to eliminate the anxiety of device selling. Clear diagnostic reports, fair market pricing, and a guaranteed zero-fee cancellation policy.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>🔍</span> 100% Open Inspection
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>₹0</span> Zero Cancellation Charges
          </div>
          <div class="inline-flex items-center gap-2 bg-[#E6F4FF] text-[#2563EB] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-[#2563EB]/10 shadow-sm">
            <span>⚡</span> Immediate Return on Demand
          </div>
        </div>
      </section>

      <!-- 30 SEC SUMMARY -->
      <section class="py-10 bg-[#F7FAFF] rounded-3xl border border-gray-100 text-center px-4">
        <h2 class="text-lg font-black text-gray-900 mb-2">Valuation & Return Policy in 30 seconds</h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We calculate live algorithmic prices, verify conditions with a 10-minute diagnostic check, and guarantee ₹0 cancellation fee if you choose not to accept the final offer.
        </p>
      </section>
    `
  }
];

async function seedCustomPages() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log(`Updating all ${customPagesData.length} Custom CMS Pages with matching rich designs...`);

    for (const page of customPagesData) {
      const updated = await CustomPage.findOneAndUpdate(
        { slug: page.slug },
        page,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✓ Updated page: "${updated.title}" (/${updated.slug} and /page/${updated.slug}) [Column: ${updated.footerColumn}]`);
    }

    console.log('\n🎉 All 8 Custom CMS Pages successfully updated in MongoDB with matching About Us rich designs!');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding custom pages:', error);
    process.exit(1);
  }
}

seedCustomPages();
