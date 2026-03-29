import { createContext, useReducer, useEffect } from 'react';
import { cartReducer } from '../reducers/cartReducer';

export const CartContext = createContext();

const getCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('aurarose-cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getCartFromLocalStorage);

  useEffect(() => {
    localStorage.setItem('aurarose-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const incrementQty = (id) => {
    dispatch({ type: 'INCREMENT_QTY', payload: id });
  };

  const decrementQty = (id) => {
    dispatch({ type: 'DECREMENT_QTY', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        incrementQty,
        decrementQty,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
