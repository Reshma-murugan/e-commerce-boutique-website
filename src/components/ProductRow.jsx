import { Link } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './ProductRow.css';

const ProductRow = ({ title, products }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (!products?.length) return null;

  return (
    <section className="product-row">
      <h2 className="product-row-title">{title}</h2>
      <div className="product-row-container">
        <button 
          type="button"
          className="row-nav-btn prev" 
          onClick={() => scroll('left')}
          aria-label="Previous products"
        >
          <ChevronLeft size={24} style={{ pointerEvents: 'none' }} />
        </button>
        
        <div className="product-row-scroll" ref={scrollRef}>
        {products.map(product => {
          const wished = isInWishlist(product.id);

          const handleCart = (e) => {
            e.preventDefault();
            addToCart(product);
            addToast(`"${product.title}" added to cart!`, 'success');
          };

          const handleWish = (e) => {
            e.preventDefault();
            const added = toggleWishlist(product);
            addToast(
              added ? `"${product.title}" added to wishlist!` : `"${product.title}" removed from wishlist`,
              'wishlist'
            );
          };

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="pr-card">
              <div className="pr-img-wrap">
                <img src={product.image} alt={product.title} loading="lazy" />
                {product.discount > 0 && (
                  <span className="pr-badge">{product.discount}% OFF</span>
                )}
                <button
                  className={`pr-wish ${wished ? 'active' : ''}`}
                  onClick={handleWish}
                  aria-label="Wishlist"
                >
                  <Heart size={14} strokeWidth={2} fill={wished ? 'currentColor' : '#fff'} />
                </button>
              </div>
              <div className="pr-info">
                <p className="pr-title">{product.title}</p>
                {product.rating && (
                  <span className="pr-rating">
                    <Star size={9} fill="currentColor" strokeWidth={0} />
                    {product.rating}
                  </span>
                )}
                <div className="pr-price-row">
                  <span className="pr-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="pr-original">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <button className="pr-cart-btn" onClick={handleCart}>
                  <ShoppingCart size={12} strokeWidth={2} />
                  Add
                </button>
              </div>
            </Link>
          );
        })}
        </div>

        <button 
          type="button"
          className="row-nav-btn next" 
          onClick={() => scroll('right')}
          aria-label="Next products"
        >
          <ChevronRight size={24} style={{ pointerEvents: 'none' }} />
        </button>
      </div>
    </section>
  );
};

export default ProductRow;
