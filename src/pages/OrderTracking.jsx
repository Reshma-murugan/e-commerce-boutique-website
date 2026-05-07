import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ClipboardList, PackageCheck, Truck, Home, XCircle, Ban, RefreshCcw } from 'lucide-react';
import { OrderContext } from '../context/OrderContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const { orders, getOrderStatus, cancelOrder, returnOrder } = useContext(OrderContext);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      setStatus(getOrderStatus(foundOrder));
    }
  }, [id, orders, getOrderStatus]);

  if (!order) {
    return (
      <div className="order-tracking-page not-found">
        <h2>Order Not Found</h2>
        <p>We couldn't find an order with ID {id}.</p>
        <Link to="/orders" className="back-btn">Back to Orders</Link>
      </div>
    );
  }

  // Define steps
  // Placed -> Confirmed -> Shipped -> Delivered
  const steps = [
    { key: 'Placed', label: 'Order Placed', time: order.createdAt, icon: ClipboardList },
    { key: 'Confirmed', label: 'Order Confirmed', time: order.confirmedAt, icon: PackageCheck },
    { key: 'Shipped', label: 'Shipped', time: order.shippedAt, icon: Truck },
    { key: 'Delivered', label: 'Delivered', time: order.deliveredAt, icon: Home }
  ];

  const currentStatusIndex = steps.findIndex(s => s.key === status);
  const canCancel = status === 'Placed' || status === 'Confirmed';
  const canReturn = status === 'Delivered';

  const handleCancelClick = () => {
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!cancelReason) return;
    cancelOrder(order.id); // In a real app we might pass cancelReason to backend here
    setStatus("Cancelled");
    setShowCancelModal(false);
  };

  const handleReturnClick = () => {
    setReturnReason('');
    setShowReturnModal(true);
  };

  const confirmReturn = () => {
    if (!returnReason) return;
    returnOrder(order.id);
    setStatus("Returned");
    setShowReturnModal(false);
  };

  const cancellationReasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Estimated delivery time is too long",
    "Other"
  ];

  const returnReasons = [
    "Item damaged or defective",
    "Doesn't fit properly",
    "Not as described / wrong item",
    "No longer needed",
    "Other"
  ];

  return (
    <div className="order-tracking-page">
      {/* Return Modal Overlay */}
      {showReturnModal && (
        <div className="action-modal-overlay">
          <div className="action-modal">
            <div className="action-modal-icon-wrap return">
              <RefreshCcw size={32} color="#f59e0b" strokeWidth={2} />
            </div>
            <h3>Return Order?</h3>
            <p>Please tell us why you want to return order #{order.id}:</p>
            
            <div className="reason-selector">
              {returnReasons.map(reason => (
                <label key={reason} className="reason-option return-option">
                  <input 
                    type="radio" 
                    name="returnReason" 
                    value={reason} 
                    checked={returnReason === reason}
                    onChange={(e) => setReturnReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowReturnModal(false)} className="modal-btn-keep">
                Keep Order
              </button>
              <button 
                onClick={confirmReturn} 
                className={`modal-btn-confirm return-btn ${!returnReason ? 'disabled' : ''}`}
                disabled={!returnReason}
              >
                Initiate Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal Overlay */}
      {showCancelModal && (
        <div className="action-modal-overlay">
          <div className="action-modal">
            <div className="action-modal-icon-wrap cancel">
              <Ban size={32} color="#ef4444" strokeWidth={2} />
            </div>
            <h3>Cancel Order?</h3>
            <p>Please tell us why you want to cancel order #{order.id}:</p>
            
            <div className="reason-selector">
              {cancellationReasons.map(reason => (
                <label key={reason} className="reason-option">
                  <input 
                    type="radio" 
                    name="cancelReason" 
                    value={reason} 
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowCancelModal(false)} className="modal-btn-keep">
                Keep Order
              </button>
              <button 
                onClick={confirmCancel} 
                className={`modal-btn-confirm ${!cancelReason ? 'disabled' : ''}`}
                disabled={!cancelReason}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        
        <div className="tracking-header">
          <h1>Track Your Order</h1>
          <p>Order #{order.id}</p>
        </div>

        <div className="tracking-card">
          {status === 'Cancelled' && (
            <div className="cancelled-banner">
              <XCircle size={28} strokeWidth={2.5} />
              <div className="cancelled-text">
                <h2>Order Cancelled</h2>
                <p>This order has been cancelled and will not be shipped.</p>
              </div>
            </div>
          )}

          {status === 'Returned' && (
            <div className="cancelled-banner returned-banner">
              <RefreshCcw size={28} strokeWidth={2.5} />
              <div className="cancelled-text">
                <h2>Return Requested</h2>
                <p>We've received your return request. We will email you the shipping label shortly.</p>
              </div>
            </div>
          )}

          {status !== 'Cancelled' && status !== 'Returned' && (
            <div className="timeline-container">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isActive = index === currentStatusIndex;
                const Icon = step.icon;
                
                // Format date nicely
                const dateObj = new Date(step.time);
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={index} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-icon-wrap">
                      <div className="step-icon">
                        {isCompleted && !isActive ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                      </div>
                      {index < steps.length - 1 && <div className="step-line"></div>}
                    </div>
                    <div className="step-content">
                      <h4 className="step-title">{step.label}</h4>
                      <p className="step-date">{dateStr}</p>
                      <p className="step-time">{timeStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="order-details-grid">
          <div className="details-card">
            <h3>Shipping Details</h3>
            <div className="details-content">
              <p><strong>{order.shippingDetails?.fullName}</strong></p>
              <p>{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}, {order.shippingDetails?.zipCode}</p>
            </div>
          </div>

          <div className="details-card">
            <h3>Order Summary</h3>
            <div className="details-content">
              {order.items.map(item => (
                <div key={item.id} className="summary-item-row">
                  <div className="summary-item-info-wrap">
                    <img src={item.image} alt={item.title} className="summary-item-img" />
                    <span className="summary-item-title">{item.quantity}x {item.title}</span>
                  </div>
                  <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="summary-total-row">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tracking-footer">
          {canCancel && (
            <button onClick={handleCancelClick} className="cancel-order-btn">
              <Ban size={16} /> Cancel Order
            </button>
          )}
          {canReturn && (
            <button onClick={handleReturnClick} className="cancel-order-btn return-trigger">
              <RefreshCcw size={16} /> Return Order
            </button>
          )}
          <Link to="/orders" className="back-btn">Back to My Orders</Link>
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;
