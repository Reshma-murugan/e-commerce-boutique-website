import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Save, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { OrderContext } from '../context/OrderContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './Profile.css';

const PROFILE_KEY = 'aurarose-profile';

const defaultProfile = {
  phone: '',
  address: '',
  city: '',
  zipCode: '',
};

const getSavedProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useContext(ToastContext);
  const { orders, getOrderStatus } = useContext(OrderContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(getSavedProfile);
  const [saved, setSaved] = useState(false);

  // Reset "saved" tick after 2s
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
    setSaved(true);
    addToast('Profile saved successfully!', 'success');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="account-tabs">
          <button className="account-tab active" onClick={() => navigate('/profile')}>
            <User size={18} /> My Profile
          </button>
          <button className="account-tab" onClick={() => navigate('/orders')}>
            <Package size={18} /> My Orders
          </button>
        </div>

        {/* ── Identity card ─────────────────────────── */}
        <div className="profile-card identity-card">
          <div className="avatar-wrap">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="profile-avatar"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="profile-avatar-fallback">
                <User size={36} strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="identity-info">
            <h2 className="profile-name">{currentUser?.displayName || 'User'}</h2>
            <p className="profile-email">{currentUser?.email}</p>
            <span className="google-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Signed in with Google
            </span>
          </div>

          <button onClick={handleLogout} className="profile-logout-btn">
            Sign Out
          </button>
        </div>

        {/* ── Editable form ─────────────────────────── */}
        <form onSubmit={handleSave} className="profile-form-grid">

          {/* Contact Info */}
          <div className="profile-card">
            <div className="profile-section-header">
              <Phone size={16} strokeWidth={2} />
              <h3>Contact Information</h3>
            </div>

            <div className="profile-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="profile-card">
            <div className="profile-section-header">
              <MapPin size={16} strokeWidth={2} />
              <h3>Default Delivery Address</h3>
            </div>

            <div className="profile-field">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 42 Rose Garden Lane"
              />
            </div>

            <div className="profile-field-row">
              <div className="profile-field">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="zipCode">PIN Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="e.g. 400001"
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="profile-save-row">
            <button type="submit" className={`profile-save-btn ${saved ? 'saved' : ''}`}>
              {saved ? (
                <>
                  <CheckCircle size={16} strokeWidth={2.5} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} strokeWidth={2} />
                  Save Changes
                </>
              )}
            </button>
            <p className="profile-save-hint">
              Your details will be auto-filled at checkout.
            </p>
          </div>

          {/* My Orders Preview */}
          <div className="profile-card recent-orders-card">
            <div className="profile-section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} strokeWidth={2} />
                <h3>Recent Orders</h3>
              </div>
              <button 
                type="button" 
                className="view-all-orders-btn"
                onClick={() => navigate('/orders')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                View All
              </button>
            </div>

            <div className="recent-orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {!orders || orders.length === 0 ? (
                <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>No orders placed yet.</p>
              ) : (
                orders.slice(0, 2).map(order => {
                  const status = getOrderStatus(order);
                  return (
                    <div 
                      key={order.id} 
                      className="recent-order-item" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px' }}>{order.id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{formatPrice(order.total)} • {order.items.length} items</div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', backgroundColor: 'var(--color-secondary)' }}>
                        {status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;
