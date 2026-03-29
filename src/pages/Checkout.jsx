import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './Checkout.css';

const STORAGE_KEY = 'aurarose-checkout-info';

const defaultForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  paymentMethod: 'credit-card'
};

const getSavedForm = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultForm, ...JSON.parse(saved) } : defaultForm;
  } catch {
    return defaultForm;
  }
};

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [formData, setFormData] = useState(getSavedForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // persist everything except paymentMethod for security
      const { paymentMethod, ...toSave } = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderNumber = `AR-${Date.now().toString().slice(-6)}`;
    setOrderSnapshot({ items: [...cart], total: getCartTotal() });
    setOrderPlaced(orderNumber);
  };

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-animation">
          <Check size={40} strokeWidth={3} color="white" />
        </div>
        <p className="success-order-number">Order #{orderPlaced}</p>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">Thank you for shopping at AuraRose Boutique. We'll send a confirmation to your email shortly.</p>

        <div className="success-summary">
          {orderSnapshot.items.map(item => (
            <div key={item.id} className="success-item">
              <img src={item.image} alt={item.title} className="success-item-img" />
              <div className="success-item-info">
                <span>{item.title}</span>
                <span className="success-item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="success-item-price">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="success-total">
            <span>Total Paid</span>
            <span>{formatPrice(orderSnapshot.total)}</span>
          </div>
        </div>

        <button
          className="success-cta"
          onClick={() => { clearCart(); navigate('/'); }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-steps">
          <div className="checkout-step done">
            <span className="step-num">1</span>
            <span className="step-label">Cart</span>
          </div>
          <div className="checkout-step-line" />
          <div className="checkout-step active">
            <span className="step-num">2</span>
            <span className="step-label">Details</span>
          </div>
          <div className="checkout-step-line" />
          <div className="checkout-step">
            <span className="step-num">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>

              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Shipping Address</h2>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Payment Method</h2>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                  />
                  <span>Credit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debit-card"
                    checked={formData.paymentMethod === 'debit-card'}
                    onChange={handleInputChange}
                  />
                  <span>Debit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={formData.paymentMethod === 'cash-on-delivery'}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order · {formatPrice(getCartTotal())}
            </button>
          </form>

          <div className="order-summary-checkout">
            <h2 className="summary-title">Order Summary</h2>

            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.title} className="order-item-image" />
                  <div className="order-item-info">
                    <p className="order-item-title">{item.title}</p>
                    <p className="order-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
