import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    addToast(`"${product.title}" moved to cart!`, 'success');
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    addToast(`"${product.title}" removed from wishlist`, 'info');
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <Heart size={64} strokeWidth={1} color="var(--color-border)" />
        <h2>Your wishlist is empty</h2>
        <p>Save items you love and come back to them later!</p>
        <Link to="/" className="continue-shopping-btn">Start Browsing</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="wishlist-title">
          My Wishlist <span className="wishlist-count">({wishlist.length})</span>
        </h1>

        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-card">
              <Link to={`/product/${product.id}`} className="wishlist-card-image-link">
                <img src={product.image} alt={product.title} className="wishlist-card-image" loading="lazy" />
              </Link>

              <div className="wishlist-card-info">
                <span className="wishlist-card-category">{product.category}</span>
                <Link to={`/product/${product.id}`} className="wishlist-card-title">
                  {product.title}
                </Link>
                <p className="wishlist-card-price">{formatPrice(product.price)}</p>

                <div className="wishlist-card-actions">
                  <button onClick={() => handleMoveToCart(product)} className="move-to-cart-btn">
                    <ShoppingCart size={14} strokeWidth={2} />
                    Move to Cart
                  </button>
                  <button onClick={() => handleRemove(product)} className="remove-wishlist-btn" aria-label="Remove from wishlist">
                    <X size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
