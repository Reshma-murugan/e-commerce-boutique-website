import { useState, useEffect, useRef, useCallback } from 'react';
import { dataService } from '../services/dataService';

const PAGE_SIZE = 20;

const useProductFeed = (filters = {}) => {
  const { category, subcategory, search, sort, limit } = filters;
  const isCapped = Boolean(limit);

  const [products, setProducts] = useState([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const sentinelRef             = useRef(null);

  // Reset to page 1 when filters change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [category, subcategory, search, sort, limit]);

  // Fetch whenever page or filters change
  useEffect(() => {
    // Skip if we already know there's nothing more (but always run page 1)
    if (page > 1 && !hasMore) return;

    let cancelled = false;

    const fetchPageData = async () => {
      setLoading(true);
      try {
        const result = await dataService.getProducts({
          category,
          subcategory,
          search,
          sort,
          page,
          pageSize: PAGE_SIZE,
          limit
        });

        if (cancelled) return;

        const items = result.data;
        const totalPages = result.pages;

        setProducts(prev => page === 1 ? items : [...prev, ...items]);

        if (isCapped) {
          setHasMore(false);
        } else {
          setHasMore(page < totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPageData();

    return () => {
      cancelled = true;
    };
  }, [page, category, subcategory, search, sort, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (isCapped) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, isCapped]);

  return { products, loading, hasMore, error, sentinelRef };
};

export default useProductFeed;
