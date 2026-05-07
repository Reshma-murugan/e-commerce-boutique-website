import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { getCategoryMeta, getSubcategoryMeta } from '../data/taxonomy';
import ProductCard from '../components/ProductCard';
import Error from '../components/Error';
import { SkeletonGrid } from '../components/Loading';
import useProductFeed from '../hooks/useProductFeed';
import { useSearch } from '../context/SearchContext.jsx';
import './CategoryListing.css';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A – Z' },
];

const CategoryListing = () => {
  const { slug, sub } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');
  const { searchTerm } = useSearch();

  const catMeta = getCategoryMeta(slug);
  const subMeta = sub ? getSubcategoryMeta(slug, sub) : null;

  const { products: filtered, loading, hasMore, error, sentinelRef } = useProductFeed({
    category: slug,
    subcategory: sub,
    sort,
    search: searchTerm,
  });

  const { visibleItems, hasMore: _, sentinelRef: __ } = { visibleItems: filtered, hasMore, sentinelRef };

  if (!catMeta) return <Error message={`Category "${slug}" not found.`} />;
  if (error) return <Error message="Could not load products. Please try refreshing the page." />;

  const pageTitle = subMeta ? subMeta.label : catMeta.label;
  const pageDesc  = subMeta ? subMeta.desc  : catMeta.description;

  return (
    <div className="category-listing-page">
      {/* Breadcrumb */}
      <div className="cl-breadcrumb-bar">
        <div className="container">
          <nav className="cl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/categories">Categories</Link>
            <span>/</span>
            {sub ? (
              <>
                <Link to={`/categories/${slug}`}>{catMeta.label}</Link>
                <span>/</span>
                <span>{subMeta?.label || sub}</span>
              </>
            ) : (
              <span>{catMeta.label}</span>
            )}
          </nav>
        </div>
      </div>

      {/* Page header */}
      <div className="cl-header" style={{ '--cl-accent': catMeta.accent, '--cl-bg': catMeta.color }}>
        <div className="container">
          <button
            className="back-btn"
            onClick={() => navigate(sub ? `/categories/${slug}` : '/categories')}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            {sub ? catMeta.label : 'All Categories'}
          </button>


          {/* Subcategory quick-nav — always visible */}
          <div className="cl-subcat-nav">
            {catMeta.subcategories.map(s => (
              <Link
                key={s.slug}
                to={`/categories/${slug}/${s.slug}`}
                className={`cl-subcat-nav-item ${s.slug === sub ? 'active' : ''}`}
                style={{ '--cl-accent': catMeta.accent }}
              >
                <div className="cl-subcat-nav-img">
                  <img src={s.image} alt={s.label} loading="lazy" />
                </div>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>

          <h1 className="cl-title">{pageTitle}</h1>
          {searchTerm && <p className="cl-desc" style={{marginTop: 'var(--space-2)', fontWeight: 600}}>Results for "{searchTerm}"</p>}
          {sub && !searchTerm && <p className="cl-age">{catMeta.age}</p>}
          {!searchTerm && <p className="cl-desc">{pageDesc}</p>}
        </div>
      </div>

      <div className="container">

        {/* Toolbar */}
        <div className="cl-toolbar">
          <p className="cl-count">{loading && filtered.length === 0 ? 'Loading...' : `${filtered.length} products`}</p>
          <div className="cl-toolbar-right">
            <select
              id="sortProducts"
              name="sortProducts"
              className="cl-sort"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="cl-view-toggle">
              <button
                className={`cl-view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} strokeWidth={2} />
              </button>
              <button
                className={`cl-view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        {filtered.length === 0 && loading ? (
          <SkeletonGrid count={8} />
        ) : filtered.length === 0 && !loading ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p className="no-results-title">No products found in this category</p>
            <p className="no-results-sub">Try browsing a different subcategory</p>
          </div>
        ) : (
          <>
            <div className={view === 'list' ? 'cl-list-view' : 'products-grid'}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} listView={view === 'list'} />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="infinite-sentinel">
                <div className="infinite-spinner" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;
