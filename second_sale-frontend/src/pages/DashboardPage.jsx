import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/order.service';
import { userService } from '../services/user.service';
import NoIndexSEO from '../components/seo/NoIndexSEO';
import { deviceService } from '../services/device.service';
import { isSpecialModel } from '../utils/specialModels';
import { formatCurrency } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

// --- Icons (SVGs matching SecondSale style) ---
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
);
const IconAddress = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconPayment = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);
const IconEarnings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m17 5-5-3-5 3" /><path d="m17 19-5 3-5-3" /><path d="M2 12h20" /><path d="m5 7-3 5 3 5" /><path d="m19 7 3 5-3 5" /></svg>
);
const IconReferral = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect width="20" height="5" x="2" y="7" /><line x1="12" x2="12" y1="22" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [refurbishedOrders, setRefurbishedOrders] = useState([]);
  const [referral, setReferral] = useState({ referralCode: '', totalReferrals: 0, totalEarnings: 0, referrals: [] });
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  const fetchData = async () => {
    try {
      const [userRes, ordersRes, refRes, refBuyRes] = await Promise.all([
        userService.getMe(),
        orderService.getOrders(),
        userService.getReferrals().catch(() => ({ data: { referralCode: 'GENERATE123', totalReferrals: 0, totalEarnings: 0, referrals: [] } })),
        orderService.getRefurbishedOrders().catch(() => ({ data: [] })),
      ]);

      setUser(userRes.data.user);
      setOrders(ordersRes.data || []);
      setRefurbishedOrders(refBuyRes.data || []);
      setReferral(refRes.data);
      setAddresses(userRes.data.user.addresses || []);
      setPaymentMethods(userRes.data.user.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAddress = async (addressData) => {
    try {
      const res = await userService.addAddress(addressData);
      setAddresses(res.data);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await userService.deleteAddress(id);
      setAddresses(res.data);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const res = await userService.addPaymentMethod(paymentData);
      setPaymentMethods(res.data);
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      const res = await userService.deletePaymentMethod(id);
      setPaymentMethods(res.data);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        fetchData();
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const res = await userService.updateMe(updates);
      setUser(res.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const copyCode = () => {
    if (referral.referralCode) {
      navigator.clipboard.writeText(referral.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <Loader />;

  const menuItems = [
    { name: 'Orders', icon: <IconOrders /> },
    { name: 'Address', icon: <IconAddress /> },
    { name: 'Payment', icon: <IconPayment /> },
    { name: 'Earnings', icon: <IconEarnings /> },
    { name: 'Referral', icon: <IconReferral /> },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-8">
      <NoIndexSEO title="My Dashboard" path="/dashboard" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-8">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6">
            {/* User Profile Card */}
            <div
              onClick={() => setActiveTab('Profile')}
              className={`rounded-2xl border p-6 shadow-sm flex items-center gap-4 cursor-pointer transition-all ${activeTab === 'Profile' ? 'bg-[#E6F4FF] border-[#2563EB]' : 'bg-white border-gray-100 hover:border-[#2563EB]/50'}`}
            >
              <div className="w-16 h-16 rounded-full bg-[#E6F4FF] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-bold text-[#111827] truncate">{user?.name || 'User Name'}</h3>
                <p className="text-sm text-gray-500 font-medium truncate">{user?.phone || 'Phone number'}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                    ${activeTab === item.name
                      ? 'bg-[#E6F4FF] text-[#2563EB]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className={`p-2 rounded-lg transition-colors
                    ${activeTab === item.name ? 'bg-white shadow-sm text-[#2563EB]' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-[15px]">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] text-[#EF4444] font-bold text-[15px] hover:bg-[#FEE2E2] transition-colors mt-auto"
            >
              <div className="p-1 rounded bg-white shadow-sm">
                <IconLogout />
              </div>
              Log Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[500px] p-8 overflow-hidden">
            {activeTab === 'Profile' && (
              <ProfileTab
                user={user}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
            {activeTab === 'Orders' && (
              <OrdersTab
                orders={orders}
                refurbishedOrders={refurbishedOrders}
                setSelectedReportOrder={setSelectedReportOrder}
                onCancel={handleCancelOrder}
              />
            )}
            {activeTab === 'Address' && (
              <AddressTab
                addresses={addresses}
                onAdd={handleAddAddress}
                onDelete={handleDeleteAddress}
              />
            )}
            {activeTab === 'Payment' && (
              <PaymentTab
                paymentMethods={paymentMethods}
                onAdd={handleAddPayment}
                onDelete={handleDeletePayment}
              />
            )}
            {activeTab === 'Earnings' && <EarningsTab />}
            {activeTab === 'Referral' && (
              <ReferralTab
                referral={referral}
                copyCode={copyCode}
                copied={copied}
              />
            )}
          </div>
        </div>
      </div>

      {selectedReportOrder && (
        <DeviceEvaluationReportModal
          order={selectedReportOrder}
          onClose={() => setSelectedReportOrder(null)}
        />
      )}
    </div>
  );
}

// --- Sub-components for Tabs ---

function ProfileTab({ user, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedName = `${formData.firstName} ${formData.lastName}`.trim();
    await onUpdateProfile({
      name: updatedName,
      phone: formData.phone
      // email is typically not updated directly or needs a different flow, but we can send it if backend supports
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-12 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-[#111827]">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 border border-[#2563EB] text-[#2563EB] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#E6F4FF] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 5 1 1-11 11-4 1 1-4Z" /><path d="m15 8 1 1" /></svg>
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-4 text-[#111827] font-bold focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all disabled:opacity-80"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-4 text-[#111827] font-bold focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all disabled:opacity-80"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-4 text-[#111827] font-bold focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all disabled:opacity-80"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">email</label>
            <input
              type="email"
              value={formData.email}
              disabled={true} // Email usually requires verification to change
              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-4 text-[#111827] font-bold focus:outline-none opacity-80 cursor-not-allowed"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#2563EB] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#1D4ED8] transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                const parts = (user.name || '').split(' ');
                setFormData({
                  firstName: parts[0] || '',
                  lastName: parts.slice(1).join(' ') || '',
                  phone: user.phone || '',
                  email: user.email || ''
                });
              }}
              className="bg-gray-100 text-gray-500 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="border border-gray-100 rounded-2xl p-6 flex items-start gap-5">
        <div className="w-10 h-10 rounded-full bg-[#E6F4FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[15px] font-black text-[#111827]">WhatsApp Updates</h4>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#2563EB]" style={{ right: 0, borderColor: '#2563EB' }} />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-[#2563EB] cursor-pointer"></label>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
            Order updates, pickup reminders, and exclusive offers on WhatsApp ({user?.phone || ''}).
          </p>
          <p className="text-xs text-gray-400 font-medium mt-3">
            Reply STOP to any WhatsApp message to opt out instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders = [], refurbishedOrders = [], setSelectedReportOrder, onCancel }) {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('sell'); // 'sell' | 'buy'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredOrders = orders.filter(order => {
    if (categoryFilter === 'All') return true;
    const cat = (order.device?.category || '').toLowerCase();
    if (categoryFilter === 'TV') return cat === 'tv';
    if (categoryFilter === 'Earbuds') return cat === 'earbuds';
    if (categoryFilter === 'Smartwatch') return cat === 'smartwatch';
    if (categoryFilter === 'Gaming') return cat === 'gaming' || cat === 'console';
    if (categoryFilter === 'Laptop') return cat === 'laptop';
    if (categoryFilter === 'Mobile') return cat === 'mobile' || (!['laptop', 'tv', 'earbuds', 'smartwatch', 'gaming', 'console'].includes(cat));
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Order Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Order History & Live Tracking</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track your device selling requests and certified refurbished purchases</p>
        </div>

        {/* Toggle Pill: Sell vs Buy */}
        <div className="flex items-center gap-2 bg-gray-100/90 p-1 rounded-2xl w-fit self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setOrderType('sell')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-none cursor-pointer ${orderType === 'sell'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'bg-transparent text-gray-500 hover:text-gray-900'
              }`}
          >
            <span>Device Sales</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${orderType === 'sell' ? 'bg-blue-50 text-[#2563EB]' : 'bg-gray-200 text-gray-600'}`}>
              {orders.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('buy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-none cursor-pointer ${orderType === 'buy'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'bg-transparent text-gray-500 hover:text-gray-900'
              }`}
          >
            <span>Refurbished Purchases</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${orderType === 'buy' ? 'bg-blue-50 text-[#2563EB]' : 'bg-gray-200 text-gray-600'}`}>
              {refurbishedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* ─── VIEW 1: REFURBISHED PURCHASES ──────────────────────────────── */}
      {orderType === 'buy' ? (
        refurbishedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-blue-600">
              <IconOrders />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No refurbished purchases yet</h3>
            <p className="text-gray-500 text-xs mb-6 max-w-sm">
              Discover certified refurbished smartphones, laptops, and tablets with 6 months warranty and free doorstep delivery.
            </p>
            <button
              onClick={() => navigate('/buy-refurbished')}
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 border-none cursor-pointer transition-all"
            >
              Browse Refurbished Store →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {refurbishedOrders.map((ro) => (
                <div
                  key={ro._id || ro.orderId}
                  className="bg-white border border-gray-100 rounded-[36px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden space-y-6"
                >
                  {/* Top Bar: Order ID, Date, Live Status Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-50">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-black text-[#2563EB] tracking-wider">
                          #{ro.orderId}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(ro.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">Certified Refurbished Device Order</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Order Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-black capitalize ${ro.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ro.orderStatus === 'shipped' || ro.orderStatus === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          ro.orderStatus === 'confirmed' || ro.orderStatus === 'packed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            ro.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        {ro.orderStatus ? ro.orderStatus.replace(/_/g, ' ') : 'Placed'}
                      </span>

                      {/* Payment Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${ro.payment?.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        ro.payment?.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                          ro.payment?.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                        }`}>
                        {ro.payment?.status === 'confirmed' ? 'Paid / Verified' :
                          ro.payment?.status === 'failed' ? 'Payment Failed' :
                            ro.payment?.status === 'refunded' ? 'Refunded' : 'Payment Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Device & Price Details */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {ro.item?.image && (
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-2.5 border border-gray-100 shrink-0">
                        <img
                          src={ro.item.image}
                          alt={ro.item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="text-lg font-black text-[#111827]">{ro.item?.title}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs text-gray-500">
                        {ro.item?.conditionGrade && (
                          <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] rounded-md font-bold capitalize">
                            {ro.item.conditionGrade} Grade
                          </span>
                        )}
                        {ro.item?.storage && <span>{ro.item.storage}</span>}
                        {ro.item?.color && <span>• {ro.item.color}</span>}
                        <span>• 6M Warranty</span>
                      </div>

                      <div className="text-base font-black text-emerald-600 mt-1">
                        ₹{Number(ro.item?.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/buy-refurbished/order-success/${ro.orderId}`)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-[#2563EB] bg-[#2563EB] text-white hover:bg-blue-700 font-black text-xs transition-all cursor-pointer shadow-sm shadow-blue-500/20"
                      >
                        Track Order & View Receipt →
                      </button>

                      {ro.deliveryDetails?.expectedDate && (
                        <span className="text-[11px] text-gray-400 font-medium">
                          Expected: {ro.deliveryDetails.expectedDate}
                        </span>
                      )}
                      {ro.deliveryDetails?.trackingNumber && (
                        <span className="text-[10px] text-gray-500 font-mono">
                          AWB: {ro.deliveryDetails.trackingNumber} {ro.deliveryDetails.courierPartner ? `(${ro.deliveryDetails.courierPartner})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* ─── VIEW 2: DEVICE SELLING REQUESTS ─────────────────────────────── */
        <>
          {/* Category Filter */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0 w-fit">
            {['All', 'Mobile', 'Laptop', 'TV', 'Earbuds', 'Smartwatch', 'Gaming'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${categoryFilter === cat ? 'bg-white text-[#2563EB] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <IconOrders />
              </div>
              <p className="text-gray-500 font-bold">You haven't placed any device selling orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order) => (
                  <div key={order.orderId} className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    {/* Category Tag */}
                    <div className="absolute top-0 right-10">
                      <div className={`px-4 py-1.5 rounded-b-xl text-[9px] font-black uppercase tracking-widest ${order.device?.category === 'tv'
                        ? 'bg-purple-100 text-purple-700 font-extrabold'
                        : order.device?.category === 'laptop'
                          ? 'bg-blue-50 text-blue-500'
                          : 'bg-[#E6F4FF] text-[#2563EB]'
                        }`}>
                        {order.device?.category === 'tv' ? 'Television (TV)' : (order.device?.category || 'Mobile')}
                      </div>
                    </div>
                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E6F4FF] rounded-full flex items-center justify-center text-[#2563EB]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#111827]">
                            {order.leadStatus === 'pickup_scheduled' || order.status === 'scheduled' ? 'Pickup & Inspection Scheduled' :
                              order.leadStatus === 'quote_sent' ? 'Valuation Quote Sent' :
                                order.status === 'completed' ? 'Order Completed' :
                                  order.status === 'cancelled' ? 'Order Cancelled' : 'Order Confirmed'}
                          </h4>
                          <p className="text-sm font-bold text-gray-400">
                            {order.leadStatus === 'pickup_scheduled' || order.status === 'scheduled' ? 'Inspection team has been scheduled for your device.' :
                              order.leadStatus === 'quote_sent' ? 'Check your offered price below or wait for pickup.' :
                                'Your device order has been placed and is being processed.'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                        className="px-8 py-3 rounded-xl border-2 border-[#2563EB] text-[#2563EB] font-black text-sm hover:bg-[#2563EB] hover:text-white transition-all"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Device Info Row */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center p-4">
                        <img
                          src={order.device?.imageUrl || "https://img.freepik.com/free-photo/mobile-phone-with-blank-screen_23-2148151433.jpg"}
                          alt={order.device?.modelName}
                          className="max-h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                        <h3 className="text-xl font-black text-[#111827] mb-1">{order.device?.modelName}</h3>
                        <p className="text-sm font-bold text-gray-400">
                          {order.device?.category === 'laptop'
                            ? `${order.device?.processor} / ${order.device?.ram} / ${order.device?.storage}`
                            : order.device?.category === 'tv'
                              ? `${order.device?.screenSize || ''} • ${order.device?.tvType || 'Smart TV'} • Condition: ${order.device?.screenCondition || 'Good'}`
                              : (order.device?.category === 'earbuds' || order.device?.category === 'smartwatch' || order.device?.category === 'gaming' || order.device?.category === 'console')
                                ? `${order.device?.storage || 'Standard Edition'}`
                                : `${order.device?.storage} / ${order.device?.ram || '8 GB'}`
                          }
                        </p>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                          <p className="font-black text-[#111827] uppercase">{order.orderId}</p>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quote</p>
                          <p className="text-2xl font-black text-[#111827]">
                            {order.priceBreakdown?.finalPrice > 0
                              ? formatCurrency(order.priceBreakdown.finalPrice)
                              : <span className="text-amber-600 text-sm font-extrabold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">Pending Quote</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions for Mobile-ish view */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setSelectedReportOrder(order)}
                        className="flex-1 bg-gray-50 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-100 transition-all text-sm"
                      >
                        Evaluation Report
                      </button>
                      {['placed', 'scheduled'].includes(order.status) && (
                        <button
                          onClick={() => onCancel(order.orderId)}
                          className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-100 transition-all text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button className="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all">
                  <IconChevronLeft />
                </button>
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-[#E6F4FF] text-[#2563EB] flex items-center justify-center font-black">1</span>
                </div>
                <button className="flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 hover:text-[#111827] hover:border-gray-200 transition-all">
                  <IconChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AddressTab({ addresses, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    name: '',
    phone: '',
    pincode: '',
    address: '',
    landmark: '',
    city: '',
    state: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setShowForm(false);
    setFormData({ label: 'Home', name: '', phone: '', pincode: '', address: '', landmark: '', city: '', state: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Manage Your Saved Addresses</h2>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or remove your saved locations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
        >
          <span className="text-[#2563EB] text-xl">{showForm ? '×' : '+'}</span> {showForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Label (e.g. Home, Office)"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />
          <input
            placeholder="Full Name"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            placeholder="Phone Number"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <input
            placeholder="Pincode"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <textarea
              placeholder="Full Address"
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <input
            placeholder="Landmark"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
          />
          <input
            placeholder="City"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
          <input
            placeholder="State"
            className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
          <button type="submit" className="md:col-span-2 bg-[#2563EB] text-white font-bold py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors mt-2">
            Save Address
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 font-medium">(0 addresses out of 3)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-gray-100 rounded-2xl p-5 relative group hover:border-[#2563EB]/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-[#E6F4FF] text-[#2563EB] text-xs font-bold rounded-full uppercase">{addr.label}</span>
                <button
                  onClick={() => onDelete(addr._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                </button>
              </div>
              <h4 className="font-bold text-[#111827]">{addr.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
              <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">📞 {addr.phone}</p>
              {addr.isDefault && <p className="text-[10px] text-[#2563EB] font-bold mt-3 uppercase tracking-wider">Default Address</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentTab({ paymentMethods, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('bank');
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, type });
    setShowForm(false);
    setFormData({ accountName: '', accountNumber: '', ifscCode: '', bankName: '', upiId: '' });
  };

  const bankAccounts = paymentMethods.filter(pm => pm.type === 'bank');
  const upiIds = paymentMethods.filter(pm => pm.type === 'upi');

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manage Your Saved Payment Methods</p>
        <h2 className="text-3xl font-bold text-[#111827]">Payments</h2>
      </div>

      <div className="space-y-4">
        {/* Forms for adding */}
        {showForm && (
          <div className="bg-gray-50 rounded-3xl p-6 border border-[#2563EB]/20">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setType('bank')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${type === 'bank' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Bank Account
              </button>
              <button
                onClick={() => setType('upi')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${type === 'upi' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                UPI ID
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'bank' ? (
                <>
                  <input
                    placeholder="Account Holder Name"
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Bank Name"
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Account Number"
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                  />
                  <input
                    placeholder="IFSC Code"
                    className="p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    required
                  />
                </>
              ) : (
                <div className="md:col-span-2">
                  <input
                    placeholder="UPI ID (e.g. name@bank)"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-[#2563EB] text-white font-bold py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                  Save Payment Method
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bank Account List */}
        <div className="border border-gray-100 rounded-3xl p-6 relative overflow-hidden group hover:border-[#2563EB]/20 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#E6F4FF] group-hover:text-[#2563EB] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#111827]">Bank Accounts</h4>
                {bankAccounts.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium">Not added</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {bankAccounts.map(bank => (
                      <div key={bank._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{bank.bankName}</p>
                          <p className="text-xs text-gray-500">A/c: ****{bank.accountNumber.slice(-4)} • {bank.accountName}</p>
                        </div>
                        <button
                          onClick={() => onDelete(bank._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Bank transfers are sent directly to your account.</p>
              </div>
            </div>
            {!showForm && <button onClick={() => { setShowForm(true); setType('bank'); }} className="text-[#2563EB] font-bold text-sm hover:underline">Add New Bank Account</button>}
          </div>
        </div>

        {/* UPI List */}
        <div className="border border-gray-100 rounded-3xl p-6 relative overflow-hidden group hover:border-[#2563EB]/20 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#E6F4FF] group-hover:text-[#2563EB] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#111827]">UPI Transfer</h4>
                {upiIds.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium">Not added</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {upiIds.map(upi => (
                      <div key={upi._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{upi.upiId}</p>
                        </div>
                        <button
                          onClick={() => onDelete(upi._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Instant transfer to your UPI linked account.</p>
              </div>
            </div>
            {!showForm && <button onClick={() => { setShowForm(true); setType('upi'); }} className="text-[#2563EB] font-bold text-sm hover:underline">Add New UPI ID</button>}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-gray-50/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Secured by SSL Encryption. 100% Safe and Confidential Payment Info
          </p>
        </div>
      </div>
    </div>
  );
}

function EarningsTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#2563EB] rounded-3xl p-10 text-white text-center relative overflow-hidden mb-10">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4">Earnings Dashboard</h2>
          <span className="inline-block bg-white text-[#2563EB] px-6 py-2 rounded-full font-bold text-sm">Coming Soon</span>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <p className="text-center text-gray-600 font-medium max-w-lg mx-auto mb-12">
        We're building powerful tools to help you track and maximize your earnings on SecondSale.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Earnings Analytics', desc: 'Visualize your earnings trends and identify your best performing activities.', icon: <IconEarnings /> },
          { title: 'Refer & Earn', desc: 'Invite friends to join SecondSale and earn bonuses for each successful referral.', icon: <IconReferral /> },
          { title: 'Earnings History', desc: 'Track your complete earnings history with detailed transaction records.', icon: <IconOrders /> },
        ].map((card) => (
          <div key={card.title} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-[#E6F4FF] rounded-2xl flex items-center justify-center text-[#2563EB] mb-6">
              {card.icon}
            </div>
            <h4 className="font-bold text-[#111827] mb-3">{card.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{card.desc}</p>
            <button className="text-[#2563EB] font-bold text-sm flex items-center gap-1 group">
              Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralTab({ referral, copyCode, copied }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">Refer & Earn</p>
        <h2 className="text-3xl font-bold text-[#111827] max-w-md leading-tight">
          Share your referral link, earn instant rewards
        </h2>
        <p className="text-sm text-gray-500 mt-4 max-w-lg">
          Generate your referral link, invite your friends, and their bonus applies automatically when they complete their first sale.
        </p>
      </div>

      <div className="border border-[#2563EB]/30 bg-white rounded-3xl p-8 relative">
        <div className="absolute top-4 right-6 text-[#2563EB]/20">
          <IconReferral />
        </div>

        <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-4">Your Referral Link</p>

        <div className="mb-8">
          <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl p-5 text-gray-500 font-medium">
            {referral.referralCode || 'Referral code not generated yet'}
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            Generate link to activate
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-[#1D4ED8] text-white font-bold py-4 rounded-2xl hover:bg-[#0452B8] transition-colors shadow-lg shadow-blue-200">
            Generate Link
          </button>
          <button
            onClick={copyCode}
            className="flex-1 border border-gray-100 text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      {referral.referrals?.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-[#111827] mb-4">Your Referrals ({referral.totalReferrals})</h3>
          <div className="space-y-3">
            {referral.referrals.map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-gray-900">{ref.name}</p>
                  <p className="text-xs text-gray-500">Joined on {new Date(ref.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge status="completed" text="+ ₹500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const supportsESIM = (modelName) => {
  if (!modelName) return false;
  const name = modelName.toLowerCase();
  const allowed = [
    'iphone 13 pro', 'iphone 13 pro max',
    'iphone 14 pro', 'iphone 14 pro max',
    'iphone 15 pro', 'iphone 15 pro max',
    'iphone 16 pro', 'iphone 16 pro max',
    'iphone 17', 'iphone 17 air', 'iphone 17 pro', 'iphone 17 pro max'
  ];
  return allowed.some(pattern => name.includes(pattern));
};

function DeviceEvaluationReportModal({ order, onClose }) {
  const isLaptop = order.device?.category === 'laptop';

  const issueLabels = {
    // Physical issues
    'glass_crack': 'Glass Crack',
    'back_panel': 'Back Panel Damage/Scratches',
    'camera_glass_broken': 'Camera Glass Broken',

    // Technical issues
    'battery_service': 'Battery Warning / Service Required',
    'front_camera': 'Front Camera faulty',
    'back_camera': 'Back Camera faulty',
    'volume_button': 'Volume button issue',
    'wifi_issue': 'Wifi/Wireless issue',
    'finger_touch': 'Finger touch/Touch ID issue',
    'face_unlock': 'Face unlock/Face ID issue',
    'speaker_faulty': 'Speaker faulty',
    'power_button': 'Power button issue',
    'charging_port': 'Charging port issue',
    'audio_receiver': 'Audio receiver issue',
    'bluetooth': 'Bluetooth issue',
    'vibrator': 'Vibrator issue',
    'microphone': 'Microphone issue',
    'proximity_sensor': 'Proximity sensor issue',
  };

  const physicalIssues = order.device?.physicalIssues || [];
  const technicalIssues = order.device?.technicalIssues || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center relative border-b border-gray-50">
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-900 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <h2 className="text-2xl font-black text-[#111827] mb-2">Device Evaluation Report</h2>
          <p className="text-sm font-bold text-gray-400">This is the report that you filled while selling this device.</p>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-10">
          {/* Device Evaluation Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#2563EB] mb-1">Device Evaluation</h3>
              <p className="text-sm font-black text-[#111827]">Summary</p>
            </div>

            <div className="space-y-4">
              <ReportRow label="Device Category" value={isLaptop ? 'Laptop' : 'Mobile'} />
              {!isSpecialModel(order.device?.brand, order.device?.modelName) && (
                <ReportRow label="Device Age" value={order.device?.deviceAge || '3 - 6 Months'} />
              )}
              {isLaptop ? (
                <>
                  <ReportRow label="Processor" value={order.device?.processor || 'N/A'} />
                  <ReportRow label="Generation" value={order.device?.generation || 'N/A'} />
                  <ReportRow label="RAM" value={order.device?.ram || 'N/A'} />
                  <ReportRow label="Storage" value={order.device?.storage || 'N/A'} />
                  <ReportRow label="Graphics" value={order.device?.hasDedicatedGpu ? order.device?.graphicsCard : 'Integrated'} />
                  <ReportRow label="Screen Size" value={order.device?.screenSize || 'N/A'} />
                  <ReportRow label="Touch Screen" value={order.device?.hasTouchscreen ? 'Yes' : 'No'} />
                  <ReportRow label="Accessories" value={Array.isArray(order.device?.accessories) ? order.device.accessories.join(', ') : order.device?.accessories || 'None'} />
                </>
              ) : (
                <>
                  {!isSpecialModel(order.device?.brand, order.device?.modelName) && (
                    <ReportRow label="Under Warranty" value={order.device?.underWarranty ? 'Yes' : 'No'} isAlert={!order.device?.underWarranty} />
                  )}
                  {supportsESIM(order.device?.modelName) && order.device?.eSIMSupport && (
                    <ReportRow label="eSIM Support" value={order.device.eSIMSupport === 'esim_only_global' ? 'Dual eSIM Only' : 'Physical + eSIM'} />
                  )}
                  <ReportRow label="Calls Functional" value={order.device?.ableToMakeCalls ? 'Yes' : 'No'} isAlert={!order.device?.ableToMakeCalls} />
                  <ReportRow label="Touch screen working" value={order.device?.isTouchScreenWorking ? 'Yes' : 'No'} isAlert={!order.device?.isTouchScreenWorking} />
                  <ReportRow label="Screen Original" value={order.device?.isScreenOriginal ? 'Yes' : 'No'} isAlert={!order.device?.isScreenOriginal} />
                  <ReportRow label="Accessories" value={Array.isArray(order.device?.accessories) ? order.device.accessories.join(', ') : 'None'} />
                </>
              )}
            </div>
          </div>

          {/* Physical Condition Section (Mobile Only) */}
          {!isLaptop && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-[#111827]">Physical Condition</h3>
              <div className="space-y-3">
                {physicalIssues.length === 0 ? (
                  <p className="text-sm font-bold text-gray-400 italic">No physical issues reported</p>
                ) : (
                  physicalIssues.map(id => (
                    <div key={id} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                      <p className="text-sm font-black text-[#EF4444]">{issueLabels[id] || id}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Technical Condition Section (Mobile Only) */}
          {!isLaptop && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-[#111827]">Technical Condition</h3>
              <div className="space-y-3">
                {technicalIssues.length === 0 ? (
                  <div className="p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No technical issues reported</p>
                  </div>
                ) : (
                  technicalIssues.map(id => (
                    <div key={id} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                      <p className="text-sm font-black text-[#EF4444]">{issueLabels[id] || id}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="flex-1 bg-[#111827] text-white font-black py-4 rounded-2xl hover:bg-black transition-all">Close Report</button>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ label, value, isAlert }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-black text-[#111827]">{label}</span>
      <span className={`text-sm font-black ${isAlert ? 'text-[#EF4444]' : 'text-gray-500'}`}>{value}</span>
    </div>
  );
}
