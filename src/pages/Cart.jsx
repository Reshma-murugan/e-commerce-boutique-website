import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, X } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 999;

const COUPONS = {
  'AURA10':  { type: 'percent', value: 10, label: '10% off' },
  'FIRST20': { type: 'percent', value: 20, label: '20% off on first order' },
  'SAVE200': { type: 'flat',    value: 200, label: '₹200 off' },
};

const Cart = () => {
  const { cart, removeFromCart, incrementQty, decrementQty, getCartTotal } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleRemove = (item) => {
    removeFromCart(item.id);
    addToast(`"${item.title}" removed from cart`, 'info');
  };

  const subtotal = getCartTotal();
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(subtotal * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const total = Math.max(0, subtotal - discount);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ ...COUPONS[code], code });
      setCouponError('');
      addToast(`Coupon "${code}" applied!`, 'success');
    } else {
      setCouponError('Invalid coupon code. Try AURA10, FIRST20 or SAVE200.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} strokeWidth={1} color="var(--color-border)" />
        <h2>Your cart is empty</h2>
        <p>Add some beautiful items to your cart!</p>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span className="cart-item-count">({cart.length} item{cart.length !== 1 ? 's' : ''})</span></h1>

        <div className="cart-layout">
          <div className="cart-items">
            {/* Free shipping progress */}
            <div className="free-shipping-bar">
              {amountToFreeShipping > 0 ? (
                <p className="free-shipping-msg">
                  Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for <strong>FREE delivery</strong>
                </p>
              ) : (
                <p className="free-shipping-msg free-shipping-achieved">
                  🎉 You've unlocked <strong>FREE delivery!</strong>
                </p>
              )}
              <div className="free-shipping-track">
                <div className="free-shipping-fill" style={{ width: `${shippingProgress}%` }} />
              </div>
            </div>

            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />

                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  {item.selectedSize && (
                    <p className="cart-item-size">Size: <strong>{item.selectedSize}</strong></p>
                  )}
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                  {item.originalPrice && (
                    <p className="cart-item-original">{formatPrice(item.originalPrice)}</p>
                  )}
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => decrementQty(item.id)} className="qty-btn" disabled={item.quantity === 1} aria-label="Decrease quantity">
                      <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => incrementQty(item.id)} className="qty-btn" aria-label="Increase quantity">
                      <Plus size={14} strokeWidth={2.5} />
                    </button>
                  </div>

                  <p className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</p>

                  <button onClick={() => handleRemove(item)} className="remove-btn" aria-label="Remove item">
                    <Trash2 size={15} strokeWidth={2} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            {/* Coupon */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="coupon-applied">
                  <Tag size={14} strokeWidth={2} />
                  <span><strong>{appliedCoupon.code}</strong> — {appliedCoupon.label}</span>
                  <button onClick={handleRemoveCoupon} className="coupon-remove" aria-label="Remove coupon">
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-row">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      className="coupon-input"
                    />
                    <button onClick={handleApplyCoupon} className="coupon-apply-btn">Apply</button>
                  </div>
                  {couponError && <p className="coupon-error">{couponError}</p>}
                </>
              )}
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row discount-row">
                  <span>Coupon Discount</span>
                  <span>− {formatPrice(discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-tag">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatPrice(49)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(subtotal >= FREE_SHIPPING_THRESHOLD ? total : total + 49)}</span>
              </div>
            </div>

            {appliedCoupon && (
              <p className="summary-savings">
                You save {formatPrice(discount)}{subtotal >= FREE_SHIPPING_THRESHOLD ? ' + free delivery' : ''} on this order!
              </p>
            )}

            <button onClick={() => navigate('/checkout')} className="checkout-btn">
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
