import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, User } from 'lucide-react';
import { OrderContext } from '../context/OrderContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './OrderHistory.css';

const OrderHistory = () => {
  const { orders, getOrderStatus } = useContext(OrderContext);

  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="container">
          <div className="account-tabs">
            <button className="account-tab" onClick={() => navigate('/profile')}>
              <User size={18} /> My Profile
            </button>
            <button className="account-tab active" onClick={() => navigate('/orders')}>
              <Package size={18} /> My Orders
            </button>
          </div>
          <div className="order-history-empty" style={{textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)'}}>
            <Package size={64} strokeWidth={1} className="empty-icon" style={{margin: '0 auto 16px', color: 'var(--color-text-faint)'}} />
            <h2>No Orders Yet</h2>
            <p style={{color: 'var(--color-text-muted)', marginBottom: '24px', marginTop: '8px'}}>Looks like you haven't placed any orders with us.</p>
            <Link to="/" className="continue-shopping" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--color-primary)', color: 'white', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none'}}>Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="account-tabs">
          <button className="account-tab" onClick={() => navigate('/profile')}>
            <User size={18} /> My Profile
          </button>
          <button className="account-tab active" onClick={() => navigate('/orders')}>
            <Package size={18} /> My Orders
          </button>
        </div>
        
        <div className="orders-list">
          {orders.map(order => {
            const status = getOrderStatus(order);
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            });

            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date"><Clock size={14} /> {orderDate}</span>
                  </div>
                  <span className={`order-status badge-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="order-item-thumb">
                        <img src={item.image} alt={item.title} />
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="order-item-thumb more">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="order-total-info">
                    <span className="total-label">Total Amount</span>
                    <span className="total-val">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Link to={`/orders/${order.id}`} className="track-btn">
                    Track Order <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
