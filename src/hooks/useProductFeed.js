import { useState, useEffect, useRef, useCallback } from 'react';

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
  const abortRef                = useRef(null);

  const buildUrl = useCallback((pageNum) => {
    const params = new URLSearchParams();

    // If search is active, weMUST fetch everything to sort by relevance locally!
    if (!search && isCapped) {
      params.set('_page', 1);
      params.set('_per_page', limit);
    } else if (!search) {
      params.set('_page', pageNum);
      params.set('_per_page', PAGE_SIZE);
    }

    if (category)    params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (search)      params.set('search_text_contains', search);

    if (sort === 'price-asc')  { params.set('_sort', 'price'); }
    if (sort === 'price-desc') { params.set('_sort', '-price'); }
    if (sort === 'name-asc')   { params.set('_sort', 'title'); }
    if (sort === 'rating')     { params.set('_sort', '-rating'); }

    return `/api/products?${params.toString()}`;
  }, [category, subcategory, search, sort, limit, isCapped]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [category, subcategory, search, sort, limit]);

  // Fetch whenever page or buildUrl changes
  useEffect(() => {
    // Skip if we already know there's nothing more (but always run page 1)
    if (page > 1 && !hasMore) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildUrl(page), { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (cancelled) return;

        let items = Array.isArray(json) ? json : (json.data ?? []);
        let totalPages = json.pages ?? null;

        // --- Client-Side Search Relevancy & Pagination ---
        if (search) {
          const term = search.trim().toLowerCase();
          const ranked = items.map(item => {
            let score = 0;
            const title = (item.title || '').toLowerCase();
            const cat = (item.category || '').toLowerCase();
            const subcat = (item.subcategory || '').toLowerCase();
            
            if (title === term) score += 200;
            else if (title.includes(term)) score += 100;
            if (cat === term || subcat === term) score += 50;
            if (item.fabric?.toLowerCase().includes(term)) score += 20;
            if (item.tags?.some(tag => tag.toLowerCase().includes(term))) score += 10;
            
            return { ...item, _score: score };
          });
          
          ranked.sort((a, b) => b._score - a._score);
          
          // Apply local pagination
          const limitCount = isCapped ? limit : PAGE_SIZE;
          const startIndex = (page - 1) * limitCount;
          items = ranked.slice(startIndex, startIndex + limitCount);
          totalPages = Math.ceil(ranked.length / limitCount);
        }
        // --------------------------------------------------

        setProducts(prev => page === 1 ? items : [...prev, ...items]);

        if (isCapped) {
          setHasMore(false);
        } else if (totalPages !== null) {
          setHasMore(page < totalPages);
        } else {
          setHasMore(items.length === PAGE_SIZE);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page, buildUrl]); // eslint-disable-line react-hooks/exhaustive-deps

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
