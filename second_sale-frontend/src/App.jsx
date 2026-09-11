import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';
import './index.css';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import BrandSelectionPage from './pages/BrandSelectionPage.jsx';
import ModelSelectionPage from './pages/ModelSelectionPage.jsx';
import VariantSelectionPage from './pages/VariantSelectionPage.jsx';
import ConditionQuizPage from './pages/ConditionQuizPage.jsx';
import SchedulePickupPage from './pages/SchedulePickupPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Partner from './pages/Partner.jsx';
import Corporate from './pages/Corporate.jsx';
import HelpCenter from './pages/HelpCenter.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import FAQPage from './pages/FAQPage.jsx';
import CompareSecondSaleVsCashify from './pages/CompareSecondSaleVsCashify.jsx';
import CashifyAlternatives from './pages/CashifyAlternatives.jsx';
import BestPlaceToSellPhone from './pages/BestPlaceToSellPhone.jsx';
import CityLandingPage from './pages/CityLandingPage.jsx';
import CategoryHubPage from './pages/CategoryHubPage.jsx';
import { CATEGORY_HUBS } from './data/categoryHubs.js';
import WhatsAppButton from './components/WhatsAppButton.jsx';

// Buy Refurbished Pages (Cashify-style with native payment flow)
import RefurbishedCatalogPage from './pages/buy/RefurbishedCatalogPage.jsx';
import RefurbishedProductDetailPage from './pages/buy/RefurbishedProductDetailPage.jsx';
import RefurbishedCheckoutPage from './pages/buy/RefurbishedCheckoutPage.jsx';
import RefurbishedOrderSuccessPage from './pages/buy/RefurbishedOrderSuccessPage.jsx';

// Laptop Pages
import LaptopBrandSelectionPage from './pages/LaptopBrandSelectionPage.jsx';
import LaptopModelSelectionPage from './pages/LaptopModelSelectionPage.jsx';
import LaptopModelDetailsPage from './pages/LaptopModelDetailsPage.jsx';
import LaptopConditionQuizPage from './pages/LaptopConditionQuizPage.jsx';

// Mac Pages
import MacBrandSelectionPage from './pages/MacBrandSelectionPage.jsx';
import MacModelSelectionPage from './pages/MacModelSelectionPage.jsx';
import MacModelDetailsPage from './pages/MacModelDetailsPage.jsx';
import MacConditionQuizPage from './pages/MacConditionQuizPage.jsx';

// Tablet Pages
import TabletBrandSelectionPage from './pages/TabletBrandSelectionPage.jsx';
import TabletModelSelectionPage from './pages/TabletModelSelectionPage.jsx';
import TabletVariantSelectionPage from './pages/TabletVariantSelectionPage.jsx';
import TabletConditionQuizPage from './pages/TabletConditionQuizPage.jsx';
import SellTvPage from './pages/SellTvPage.jsx';

// Earbuds Pages
import EarbudsBrandSelectionPage from './pages/EarbudsBrandSelectionPage.jsx';
import EarbudsModelSelectionPage from './pages/EarbudsModelSelectionPage.jsx';
import EarbudsModelDetailsPage from './pages/EarbudsModelDetailsPage.jsx';
import EarbudsConditionQuizPage from './pages/EarbudsConditionQuizPage.jsx';

// Smartwatch Pages
import SmartwatchBrandSelectionPage from './pages/SmartwatchBrandSelectionPage.jsx';
import SmartwatchModelSelectionPage from './pages/SmartwatchModelSelectionPage.jsx';
import SmartwatchModelDetailsPage from './pages/SmartwatchModelDetailsPage.jsx';
import SmartwatchConditionQuizPage from './pages/SmartwatchConditionQuizPage.jsx';

// Gaming Console Pages
import GamingBrandSelectionPage from './pages/GamingBrandSelectionPage.jsx';
import GamingModelSelectionPage from './pages/GamingModelSelectionPage.jsx';
import GamingModelDetailsPage from './pages/GamingModelDetailsPage.jsx';
import GamingConditionQuizPage from './pages/GamingConditionQuizPage.jsx';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminDevices from './pages/admin/AdminDevices.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminPartners from './pages/admin/AdminPartners.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminPincodes from './pages/admin/AdminPincodes.jsx';
import AdminSiteSettings from './pages/admin/AdminSiteSettings.jsx';
import AdminRefurbished from './pages/admin/AdminRefurbished.jsx';
import AdminHomepage from './pages/admin/AdminHomepage.jsx';
import AdminPages from './pages/admin/AdminPages.jsx';
import AdminSalesUsers from './pages/admin/AdminSalesUsers.jsx';
import CustomPageView from './pages/CustomPageView.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Sync Favicon dynamically from Site Settings
  useEffect(() => {
    const applyFavicon = (url) => {
      if (!url) return;
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = url;
    };

    fetch(API_BASE + "/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.faviconUrl) applyFavicon(data.faviconUrl);
      })
      .catch(() => {});

    const onSettingsUpdate = (e) => {
      if (e?.detail?.faviconUrl) applyFavicon(e.detail.faviconUrl);
    };
    window.addEventListener("site-settings-updated", onSettingsUpdate);
    return () => window.removeEventListener("site-settings-updated", onSettingsUpdate);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          {/* Mobile flow */}
          <Route path="/sell-old-mobile-phones/brand" element={<BrandSelectionPage />} />
          <Route path="/sell-old-mobile-phones/:brand" element={<ModelSelectionPage />} />
          <Route path="/sell-old-mobile-phones/:brand/:slug" element={<VariantSelectionPage />} />
          <Route path="/sell-old-mobile-phones/:brand/:slug/quiz" element={<ConditionQuizPage />} />
          {/* Laptop flow */}
          <Route path="/sell-old-laptops/brand" element={<LaptopBrandSelectionPage />} />
          <Route path="/sell-old-laptops/:brand" element={<LaptopModelSelectionPage />} />
          <Route path="/sell-old-laptops/:brand/:slug" element={<LaptopModelDetailsPage />} />
          <Route path="/sell-old-laptops/:brand/:slug/quiz" element={<LaptopConditionQuizPage />} />
          {/* Mac flow */}
          <Route path="/sell-imac/brand" element={<MacBrandSelectionPage />} />
          <Route path="/sell-imac/:brand" element={<MacModelSelectionPage />} />
          <Route path="/sell-imac/:brand/:slug" element={<MacModelDetailsPage />} />
          <Route path="/sell-imac/:brand/:slug/quiz" element={<MacConditionQuizPage />} />
          {/* Tablet flow */}
          <Route path="/sell-tablet/brand" element={<TabletBrandSelectionPage />} />
          <Route path="/sell-tablet/:brand" element={<TabletModelSelectionPage />} />
          <Route path="/sell-tablet/:brand/:slug" element={<TabletVariantSelectionPage />} />
          <Route path="/sell-tablet/:brand/:slug/quiz" element={<TabletConditionQuizPage />} />
          {/* TV Trade-in Flow */}
          <Route path="/sell-tv" element={<SellTvPage />} />
          {/* Earbuds Flow */}
          <Route path="/sell-earbuds/brand" element={<EarbudsBrandSelectionPage />} />
          <Route path="/sell-earbuds/:brand" element={<EarbudsModelSelectionPage />} />
          <Route path="/sell-earbuds/:brand/:slug" element={<EarbudsModelDetailsPage />} />
          <Route path="/sell-earbuds/:brand/:slug/quiz" element={<EarbudsConditionQuizPage />} />
          {/* DeviceKart URL compatibility aliases */}
          <Route path="/sell/earbuds/brand" element={<EarbudsBrandSelectionPage />} />
          <Route path="/sell/earbuds/:brand" element={<EarbudsModelSelectionPage />} />
          <Route path="/sell/earbuds/:brand/:slug" element={<EarbudsModelDetailsPage />} />
          <Route path="/sell/earbuds/:brand/:slug/quiz" element={<EarbudsConditionQuizPage />} />

          {/* Smartwatch Flow */}
          <Route path="/sell-smartwatch/brand" element={<SmartwatchBrandSelectionPage />} />
          <Route path="/sell-smartwatch/:brand" element={<SmartwatchModelSelectionPage />} />
          <Route path="/sell-smartwatch/:brand/:slug" element={<SmartwatchModelDetailsPage />} />
          <Route path="/sell-smartwatch/:brand/:slug/quiz" element={<SmartwatchConditionQuizPage />} />
          <Route path="/sell/smartwatch/brand" element={<SmartwatchBrandSelectionPage />} />
          <Route path="/sell/smartwatch/:brand" element={<SmartwatchModelSelectionPage />} />
          <Route path="/sell/smartwatch/:brand/:slug" element={<SmartwatchModelDetailsPage />} />
          <Route path="/sell/smartwatch/:brand/:slug/quiz" element={<SmartwatchConditionQuizPage />} />

          {/* Gaming Console Flow */}
          <Route path="/sell-gaming/brand" element={<GamingBrandSelectionPage />} />
          <Route path="/sell-gaming/:brand" element={<GamingModelSelectionPage />} />
          <Route path="/sell-gaming/:brand/:slug" element={<GamingModelDetailsPage />} />
          <Route path="/sell-gaming/:brand/:slug/quiz" element={<GamingConditionQuizPage />} />
          <Route path="/sell/gaming/brand" element={<GamingBrandSelectionPage />} />
          <Route path="/sell/gaming/:brand" element={<GamingModelSelectionPage />} />
          <Route path="/sell/gaming/:brand/:slug" element={<GamingModelDetailsPage />} />
          <Route path="/sell/gaming/:brand/:slug/quiz" element={<GamingConditionQuizPage />} />
          <Route path="/sell/console/brand" element={<GamingBrandSelectionPage />} />
          <Route path="/sell/console/:brand" element={<GamingModelSelectionPage />} />
          <Route path="/sell/console/:brand/:slug" element={<GamingModelDetailsPage />} />
          <Route path="/sell/console/:brand/:slug/quiz" element={<GamingConditionQuizPage />} />
          {/* Buy Refurbished Flow (Cashify-style) */}
          <Route path="/buy-refurbished" element={<RefurbishedCatalogPage />} />
          <Route path="/buy-refurbished/product/:slug" element={<RefurbishedProductDetailPage />} />
          <Route path="/buy-refurbished/checkout" element={<RefurbishedCheckoutPage />} />
          <Route path="/buy-refurbished/order-success/:orderId" element={<RefurbishedOrderSuccessPage />} />

          {/* Dynamic CMS Pages (e.g. /page/warranty-policy) */}
          <Route path="/page/:slug" element={<CustomPageView />} />

          {/* Shared */}

          <Route path="/schedule-pickup" element={<ProtectedRoute><SchedulePickupPage /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/valuation-and-return-policy" element={<CustomPageView slugOverride="valuation-and-return-policy" />} />
          <Route path="/compare/secondsale-vs-cashify" element={<CompareSecondSaleVsCashify />} />
          <Route path="/alternatives/cashify-alternatives" element={<CashifyAlternatives />} />
          <Route path="/best-place-to-sell-old-phone-india" element={<BestPlaceToSellPhone />} />
          <Route path="/sell-old-phone-in/:city" element={<CityLandingPage />} />
          {CATEGORY_HUBS.map((hub) => (
            <Route key={hub.slug} path={`/${hub.slug}`} element={<CategoryHubPage />} />
          ))}

          {/* Admin Flow */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route path="dashboard" element={<AdminProtectedRoute requiredPermission="dashboard"><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="homepage" element={<AdminProtectedRoute requiredPermission="homepage"><AdminHomepage /></AdminProtectedRoute>} />
            <Route path="pages" element={<AdminProtectedRoute requiredPermission="pages"><AdminPages /></AdminProtectedRoute>} />
            <Route path="users" element={<AdminProtectedRoute requiredPermission="users"><AdminUsers /></AdminProtectedRoute>} />
            <Route path="devices" element={<AdminProtectedRoute requiredPermission="devices"><AdminDevices /></AdminProtectedRoute>} />
            <Route path="refurbished" element={<AdminProtectedRoute requiredPermission="refurbished"><AdminRefurbished /></AdminProtectedRoute>} />
            <Route path="categories" element={<AdminProtectedRoute requiredPermission="categories"><AdminCategories /></AdminProtectedRoute>} />
            <Route path="partners" element={<AdminProtectedRoute requiredPermission="partners"><AdminPartners /></AdminProtectedRoute>} />
            <Route path="orders" element={<AdminProtectedRoute requiredPermission="orders"><AdminOrders /></AdminProtectedRoute>} />
            <Route path="pincodes" element={<AdminProtectedRoute requiredPermission="pincodes"><AdminPincodes /></AdminProtectedRoute>} />
            <Route path="site-settings" element={<AdminProtectedRoute requiredPermission="site-settings"><AdminSiteSettings /></AdminProtectedRoute>} />
            <Route path="sales-users" element={<AdminProtectedRoute requiredPermission="sales-users"><AdminSalesUsers /></AdminProtectedRoute>} />
          </Route>

          {/* Dynamic CMS Pages (Supports both direct /:slug and legacy /page/:slug) */}
          <Route path="/page/:slug" element={<CustomPageView />} />
          <Route path="/:slug" element={<CustomPageView />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <WhatsAppButton />
    </>
  );
}

export default App;