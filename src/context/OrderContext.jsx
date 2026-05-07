import { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

export const OrderContext = createContext();

const STORAGE_KEY = 'aurarose-orders';

const getInitialOrders = () => {
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      // Validate uniqueness. If corrupt, fallback to reset.
      const hasDuplicates = new Set(parsed.map(o => o.id)).size !== parsed.length;
      if (!hasDuplicates) {
        return parsed;
      } else {
        console.warn("Corrupt order keys detected. Resetting dummy orders.");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (err) {
    console.error("Failed to parse orders", err);
  }

  // Generate 2 dummy orders if empty (for portfolio view)
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Order from 7 days ago (Delivered)
  const deliveredOrder = {
    id: `AR-784912`,
    createdAt: now - 7 * dayMs,
    confirmedAt: now - 7 * dayMs + 3 * 60 * 1000, 
    shippedAt: now - 6 * dayMs,
    deliveredAt: now - 2 * dayMs,
    total: 2150,
    items: [
        { id: 1, title: 'Blue Infant Romper', price: 775, quantity: 2, image: 'https://images.unsplash.com/photo-1662191367194-6dd89dcfeb8c?w=300' }
    ],
    shippingDetails: { fullName: "Jane Doe", address: "123 Port Road", city: "Mumbai", zipCode: "400001" },
    paymentMethod: "credit-card",
    userId: 'demo',
    isCancelled: false,
    isReturned: false
  };

  // Order from 2 days ago (Shipped)
  const shippedOrder = {
    id: `AR-910453`,
    createdAt: now - 2 * dayMs,
    confirmedAt: now - 2 * dayMs + 4 * 60 * 1000,
    shippedAt: now - 1 * dayMs,
    deliveredAt: now + 3 * dayMs,
    total: 899,
    items: [
        { id: 8, title: 'Stylish Infant Outfit Set', price: 899, quantity: 1, image: 'https://images.unsplash.com/photo-1626397538183-0a4165018e7b?w=300' }
    ],
    shippingDetails: { fullName: "Jane Doe", address: "123 Port Road", city: "Mumbai", zipCode: "400001" },
    paymentMethod: "debit-card",
    userId: 'demo',
    isCancelled: false,
    isReturned: false
  };

  return [shippedOrder, deliveredOrder]; // newest first
};

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [allOrders, setAllOrders] = useState(getInitialOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
  }, [allOrders]);

  const addOrder = (orderData) => {
    const now = Date.now();
    // Confirmed in 2 to 5 mins, Shipped in 1 day, Delivered in 5 days
    const confirmOffset = (Math.floor(Math.random() * 4) + 2) * 60 * 1000; // 2 to 5 mins
    const newOrder = {
      ...orderData,
      id: `AR-${now.toString().slice(-6)}`,
      userId: currentUser?.uid || 'guest',
      isCancelled: false,
      isReturned: false,
      createdAt: now,
      confirmedAt: now + confirmOffset,
      shippedAt: now + 24 * 60 * 60 * 1000,
      deliveredAt: now + 5 * 24 * 60 * 60 * 1000
    };
    
    setAllOrders(prev => [newOrder, ...prev]);
    return newOrder.id; // Return ID so we can navigate or track
  };

  const cancelOrder = (orderId) => {
    setAllOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, isCancelled: true } : o
    ));
  };

  const returnOrder = (orderId) => {
    setAllOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, isReturned: true } : o
    ));
  };
  
  // Calculate current status string dynamically
  const getOrderStatus = (order) => {
    if (order.isCancelled) return "Cancelled";
    if (order.isReturned) return "Returned";
    const now = Date.now();
    if (now >= order.deliveredAt) return "Delivered";
    if (now >= order.shippedAt) return "Shipped";
    if (now >= order.confirmedAt) return "Confirmed";
    return "Placed";
  };

  // Derived state: only show dummy orders and the current user's orders
  const currentUserId = currentUser?.uid || 'guest';
  const orders = allOrders.filter(o => o.userId === 'demo' || o.userId === currentUserId);

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder, returnOrder, getOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
