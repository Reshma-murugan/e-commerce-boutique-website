import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useMemo } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { dataService } from '../services/dataService';
import useProductFeed from '../hooks/useProductFeed';
import Loading from '../components/Loading';
import Error from '../components/Error';
import ProductRow from '../components/ProductRow';
import { formatPrice } from '../utils/formatPrice';
import './ProductDetails.css';

const FABRIC_MAP = {
  rompers: 'Soft Cotton (100%)',
  onesies: 'Organic Cotton',
  summer:  'Cotton Lawn',
  party:   'Tulle & Satin',
  festive: 'Silk Blend',
  winter:  'Wool Blend / Fleece',
  casual:  'Cotton Jersey',
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dataService.getProductById(id);
        if (!cancelled) {
          if (data) {
            setProduct(data);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);
  const { products: similarProducts } = useProductFeed(
    product ? { category: product.category, subcategory: product.subcategory, limit: 20 } : {}
  );
  const { products: youMayLike } = useProductFeed(
    product ? { category: product.category, limit: 20 } : {}
  );

  const similar = useMemo(
    () => similarProducts.filter(p => p.id !== product?.id).slice(0, 10),
    [similarProducts, product]
  );
  const mayLike = useMemo(
    () => youMayLike.filter(p => p.id !== product?.id && p.subcategory !== product?.subcategory).slice(0, 10),
    [youMayLike, product]
  );

  if (loading) return <Loading />;
  if (error || !product) return <Error message="Product not found." />;

  const wished = isInWishlist(product.id);
  const fabric = product.fabric || FABRIC_MAP[product.subcategory] || 'Premium Cotton';
  const baseImage = product.image;

  // 4 fake "angles" from one image using CSS transform hints
  const ANGLES = [
    { label: 'Front',  style: {} },
    { label: 'Side',   style: { transform: 'scaleX(-1)' } },
    { label: 'Detail', style: { transform: 'scale(1.35)', objectPosition: 'center 20%' } },
    { label: 'Full',   style: { transform: 'scale(0.92)', objectPosition: 'center bottom' } },
  ];

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({ ...product, selectedSize });
    addToast(`"${product.title}" added to cart!`, 'success');
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    addToast(
      added ? `"${product.title}" added to wishlist!` : `"${product.title}" removed from wishlist`,
      'wishlist'
    );
  };

  // Delivery date: 3-5 days from today
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="product-details">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>

        <div className="product-details-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            {/* Thumbnails — 4 fake angles */}
            <div className="gallery-thumbs">
              {ANGLES.map((angle, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`${angle.label} view`}
                >
                  <img
                    src={baseImage}
                    alt={angle.label}
                    loading="lazy"
                    style={angle.style}
                  />
                </button>
              ))}
            </div>

            {/* Main image with active angle transform */}
            <div className="gallery-main">
              {product.discount > 0 && (
                <span className="pd-discount-badge">{product.discount}% OFF</span>
              )}
              <img
                key={activeImg}
                src={baseImage}
                alt={`${product.title} — ${ANGLES[activeImg].label} view`}
                className="product-detail-image"
                loading="eager"
                style={ANGLES[activeImg].style}
              />
              {/* Prev / Next */}
              <button
                className="gallery-nav gallery-nav-prev"
                onClick={() => setActiveImg(i => (i - 1 + ANGLES.length) % ANGLES.length)}
                aria-label="Previous view"
              >‹</button>
              <button
                className="gallery-nav gallery-nav-next"
                onClick={() => setActiveImg(i => (i + 1) % ANGLES.length)}
                aria-label="Next view"
              >›</button>
              {/* Dot indicators */}
              <div className="gallery-dots">
                {ANGLES.map((_, i) => (
                  <button
                    key={i}
                    className={`gallery-dot ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={ANGLES[i].label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="product-info-section">
            <span className="product-detail-category">{product.subcategory}</span>
            <h1 className="product-detail-title">{product.title}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="pd-rating">
                <span className="pd-rating-pill">
                  <Star size={12} fill="currentColor" strokeWidth={0} />
                  {product.rating}
                </span>
                <span className="pd-rating-count">{product.reviewCount?.toLocaleString('en-IN')} ratings</span>
              </div>
            )}

            {/* Price */}
            <div className="pd-price-row">
              <span className="product-detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="pd-original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="pd-discount-pct">{product.discount}% off</span>
                </>
              )}
            </div>
            <p className="pd-tax-note">Inclusive of all taxes</p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="pd-size-section">
                <div className="pd-size-header">
                  <span className="pd-size-label">
                    Size {selectedSize && <strong>: {selectedSize}</strong>}
                  </span>
                </div>
                <div className="pd-size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="pd-size-error">Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <button onClick={handleAddToCart} className="add-to-cart-detail-btn">
                <ShoppingCart size={18} strokeWidth={2} />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`wishlist-detail-btn ${wished ? 'active' : ''}`}
              >
                <Heart size={18} strokeWidth={2} fill={wished ? 'currentColor' : 'none'} />
                {wished ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Delivery & trust info */}
            <div className="pd-delivery-section">
              <div className="pd-delivery-row">
                <Truck size={16} strokeWidth={2} color="var(--color-primary)" />
                <div>
                  <span className="pd-delivery-title">Free Delivery</span>
                  <span className="pd-delivery-sub">Estimated by {deliveryStr}</span>
                </div>
              </div>
              <div className="pd-delivery-row">
                <RotateCcw size={16} strokeWidth={2} color="#16a34a" />
                <div>
                  <span className="pd-delivery-title">7-Day Easy Returns</span>
                  <span className="pd-delivery-sub">Return or exchange within 7 days</span>
                </div>
              </div>
              <div className="pd-delivery-row">
                <ShieldCheck size={16} strokeWidth={2} color="#2563eb" />
                <div>
                  <span className="pd-delivery-title">100% Authentic</span>
                  <span className="pd-delivery-sub">Quality checked & certified</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="product-detail-description">{product.description}</p>

            {/* Product details */}
            <div className="product-features">
              <h3>Product Details</h3>
              <ul>
                <li><span>Fabric</span><span>{fabric}</span></li>
                <li><span>Care</span><span>Machine wash cold, gentle cycle</span></li>
                <li><span>Fit</span><span>Regular fit, true to size</span></li>
                <li><span>Occasion</span><span>{product.subcategory?.charAt(0).toUpperCase() + product.subcategory?.slice(1)}</span></li>
                <li><span>Country of Origin</span><span>India</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <ProductRow title="Similar Products" products={similar} />

        {/* You May Also Like */}
        <ProductRow title="You May Also Like" products={mayLike} />

      </div>
    </div>
  );
};

export default ProductDetails;
