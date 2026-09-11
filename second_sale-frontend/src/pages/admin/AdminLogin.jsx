import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import NoIndexSEO from '../../components/seo/NoIndexSEO';
import './admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminService.login({ email, password });
      localStorage.setItem('adminToken', response.data.token);
      if (response.data.admin) {
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }

      const user = response.data.admin;
      if (user?.role === 'sales' && Array.isArray(user.permissions) && user.permissions.length > 0) {
        if (user.permissions.includes('dashboard')) {
          navigate('/admin/dashboard');
        } else {
          // Direct to first permitted module
          const firstModule = user.permissions[0];
          navigate(`/admin/${firstModule}`);
        }
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <NoIndexSEO title="Admin Login" path="/admin/login" />
      <div className="admin-login-card">
        <h1>SecondSale Admin</h1>
        <p>Enter your system keys to access dashboard</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="admin-field">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              required
              placeholder="admin@secondsale.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
