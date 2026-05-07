import { useSearch } from '../context/SearchContext.jsx';
import ProductCard from '../components/ProductCard';
import ProductRow from '../components/ProductRow';
import Error from '../components/Error';
import Loading, { SkeletonGrid } from '../components/Loading';
import useProductFeed from '../hooks/useProductFeed';
import './SearchResults.css';

const SearchResults = () => {
  const { searchTerm } = useSearch();

  const { products, loading, hasMore, error, sentinelRef } = useProductFeed({
    search: searchTerm,
  });

  const { products: fallbackProducts } = useProductFeed({
    limit: 10,
    sort: 'rating'
  });

  if (error) {
    return (
      <div className="search-results-page">
        <div className="container">
          <Error message="Could not load search results. Please try again." />
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          {searchTerm ? (
            <h1 className="search-title">
              Results for "<span>{searchTerm}</span>"
            </h1>
          ) : (
            <h1 className="search-title">All Products</h1>
          )}
          <p className="search-subtitle">
            {loading && products.length === 0 
              ? 'Searching...' 
              : `${products.length} matching products found`}
          </p>
        </div>

        {products.length === 0 && loading ? (
          <SkeletonGrid count={12} />
        ) : products.length === 0 && !loading ? (
          <div>
            <div className="no-results" style={{ gridColumn: '1 / -1', minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span className="no-results-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</span>
              <p className="no-results-title" style={{ fontSize: '1.25rem', fontWeight: 600 }}>No products found</p>
              <p className="no-results-sub" style={{ color: 'var(--color-text-faint)' }}>Try a different search term or browse our categories.</p>
            </div>

            {fallbackProducts?.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <ProductRow title="You May Also Like" products={fallbackProducts} />
              </div>
            )}
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

export default SearchResults;
