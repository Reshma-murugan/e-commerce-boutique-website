import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import Loading, { SkeletonGrid } from '../components/Loading';
import Error from '../components/Error';
import useProductFeed from '../hooks/useProductFeed';
import infantImg  from '../assets/mainCategoryImage/infantGirl.jpg';
import toddlerImg from '../assets/mainCategoryImage/toddlerGirl.jpg';
import girlsImg   from '../assets/mainCategoryImage/girl.jpg';
import './Home.css';

const TRUST_BADGES = [
  { Icon: Truck,       title: 'Free Delivery',     sub: 'On orders above ₹999' },
  { Icon: RotateCcw,   title: '7-Day Returns',      sub: 'Easy & hassle-free' },
  { Icon: ShieldCheck, title: '100% Authentic',     sub: 'Quality certified' },
  { Icon: Headphones,  title: '24/7 Support',       sub: 'Always here to help' },
];

const SHOP_CATEGORIES = [
  { key: 'infant',  label: 'Baby',    age: '0 – 24 Months', image: infantImg  },
  { key: 'toddler', label: 'Toddler', age: '2 – 5 Years',   image: toddlerImg },
  { key: 'girls',   label: 'Girls',   age: '6 – 14 Years',  image: girlsImg   },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Paginated feed — fetches 20 at a time from server
  const { products, loading, hasMore, error, sentinelRef } = useProductFeed({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  // Best sellers & new arrivals — single capped requests, no infinite scroll
  const { products: bestSellers } = useProductFeed({ sort: 'rating', limit: 20 });
  const { products: newArrivals  } = useProductFeed({ limit: 20 });

  const topBestSellers = useMemo(() => bestSellers.filter(p => p.isBestSeller).slice(0, 4), [bestSellers]);
  const topNewArrivals = useMemo(() => newArrivals.filter(p => p.isNew).slice(0, 4), [newArrivals]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust badges */}
      <div className="trust-strip">
        {TRUST_BADGES.map(({ Icon, title, sub }) => (
          <div key={title} className="trust-item">
            <Icon size={22} strokeWidth={1.8} color="var(--color-primary)" />
            <div>
              <p className="trust-title">{title}</p>
              <p className="trust-sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        {/* Shop by Category — circular photo cards */}
        <section className="category-section">
          <div className="category-section-header">
            <h2 className="category-section-title">Shop by Category</h2>
            <p className="category-section-sub">Perfect outfits for every age</p>
          </div>
          <div className="category-circles">
            {SHOP_CATEGORIES.map(({ key, label, age, image }) => (
              <Link key={key} to={`/categories/${key}`} className="category-circle-item">
                <div className="category-circle-img-wrap">
                  <img src={image} alt={label} className="category-circle-img" loading="lazy" />
                </div>
                <span className="category-circle-label">{label}</span>
                <span className="category-circle-age">{age}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        {topBestSellers.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <div>
                <h2 className="home-section-title">Best Sellers</h2>
                <p className="home-section-sub">Most loved by our customers</p>
              </div>
              <Link to="/categories" className="home-section-link">View All →</Link>
            </div>
            <div className="products-grid">
              {topBestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {topNewArrivals.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <div>
                <h2 className="home-section-title">New Arrivals</h2>
                <p className="home-section-sub">Fresh styles just added</p>
              </div>
              <Link to="/categories" className="home-section-link">View All →</Link>
            </div>
            <div className="products-grid">
              {topNewArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All products */}
        <div className="filters-section">
          <div className="home-section-header" style={{ marginBottom: 'var(--space-5)' }}>
            <div>
              <h2 className="home-section-title">All Products</h2>
              <p className="home-section-sub">Browse our full collection</p>
            </div>
          </div>
          <div className="category-filters">
            {['all', 'infant', 'toddler', 'girls'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <Error message="Could not load products. Make sure json-server is running on port 3000." />
        ) : products.length === 0 && loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 && !loading ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p className="no-results-title">No products found</p>
            <p className="no-results-sub">Try a different category or search term</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="infinite-sentinel">
                <div className="infinite-spinner" />
              </div>
            )}
            {loading && products.length > 0 && (
              <div className="infinite-sentinel">
                <div className="infinite-spinner" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
