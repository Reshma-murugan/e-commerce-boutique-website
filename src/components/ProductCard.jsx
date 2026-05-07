import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    addToast(`"${product.title}" added to cart!`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    addToast(
      added ? `"${product.title}" added to wishlist!` : `"${product.title}" removed from wishlist`,
      'wishlist'
    );
  };

  const wished = isInWishlist(product.id);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.title} className="product-image" loading="lazy" />

        {/* Badges */}
        <div className="product-badges">
          {product.discount > 0 && (
            <span className="badge badge-discount">{product.discount}% OFF</span>
          )}
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && !product.isNew && (
            <span className="badge badge-bestseller">Bestseller</span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className={`wishlist-btn ${wished ? 'active' : ''}`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} strokeWidth={2} fill={wished ? 'currentColor' : '#fff'} />
        </button>

        <div className="product-overlay">
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            <ShoppingCart size={16} strokeWidth={2} />
            Add
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="product-rating">
            <span className="rating-pill">
              <Star size={10} fill="currentColor" strokeWidth={0} />
              {product.rating}
            </span>
            <span className="rating-count">({product.reviewCount?.toLocaleString('en-IN')})</span>
          </div>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="product-sizes">
            {product.sizes.slice(0, 3).map(s => (
              <span key={s} className="size-chip">{s}</span>
            ))}
            {product.sizes.length > 3 && (
              <span className="size-chip size-chip-more">+{product.sizes.length - 3}</span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>

      <div className="product-card-mobile-action">
        <button onClick={handleAddToCart}>
          <ShoppingCart size={14} strokeWidth={2} />
          Add
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
