import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Home, Heart, ShoppingBag, LayoutGrid } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './BottomNav.css';

const BottomNav = () => {
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { currentUser, loginWithGoogle } = useAuth();
  const { pathname } = useLocation();

  const links = [
    { to: '/',           label: 'Home',       Icon: Home },
    { to: '/categories', label: 'Categories', Icon: LayoutGrid },
    { to: '/wishlist',   label: 'Wishlist',   Icon: Heart,       badge: wishlist.length },
    { to: '/cart',       label: 'Cart',       Icon: ShoppingBag, badge: getCartCount() },
    { 
      to: '#', 
      label: currentUser ? (currentUser.displayName?.split(' ')[0] || 'Account') : 'Account', 
      Icon: Home, // Placeholder Icon, will use avatar if logged in
      isAuth: true 
    },
  ];

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, Icon, badge, isAuth }) => {
        if (isAuth) {
          return (
            <button
              key="auth-btn"
              onClick={!currentUser ? loginWithGoogle : undefined}
              className={`bottom-nav-item auth-item ${currentUser ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="bottom-nav-avatar" />
                ) : (
                  <Home size={22} strokeWidth={currentUser ? 2.5 : 1.8} />
                )}
              </span>
              <span className="bottom-nav-label">{label}</span>
            </button>
          );
        }
        return (
          <Link
            key={to}
            to={to}
            className={`bottom-nav-item ${isActive(to) ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">
              <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 1.8} />
              {badge > 0 && <span className="bottom-nav-badge">{badge}</span>}
            </span>
            <span className="bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
