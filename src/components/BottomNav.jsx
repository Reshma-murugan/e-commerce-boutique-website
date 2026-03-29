import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Home, Heart, ShoppingBag, LayoutGrid } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import './BottomNav.css';

const BottomNav = () => {
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { pathname } = useLocation();

  const links = [
    { to: '/',           label: 'Home',       Icon: Home },
    { to: '/categories', label: 'Categories', Icon: LayoutGrid },
    { to: '/wishlist',   label: 'Wishlist',   Icon: Heart,       badge: wishlist.length },
    { to: '/cart',       label: 'Cart',       Icon: ShoppingBag, badge: getCartCount() },
  ];

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="bottom-nav">
      {links.map(({ to, label, Icon, badge }) => (
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
      ))}
    </nav>
  );
};

export default BottomNav;
