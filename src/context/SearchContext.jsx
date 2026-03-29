import { createContext, useState, useEffect, useContext } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(''); // The actually applied search filter
  const [searchInput, setSearchInput] = useState(''); // The text currently being typed in the header
  // Only load lightweight product list for autocomplete suggestions
  // Full product data is fetched on-demand by useProductFeed
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search_text_contains=${encodeURIComponent(searchInput)}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data ?? []);
        
        // Relevancy Engine
        const term = searchInput.trim().toLowerCase();
        const ranked = data.map(item => {
          let score = 0;
          
          const title = (item.title || '').toLowerCase();
          const category = (item.category || '').toLowerCase();
          const subcat = (item.subcategory || '').toLowerCase();
          
          // Exact Title match gets maximum priority
          if (title === term) score += 200;
          else if (title.includes(term)) score += 100;
          
          // Category matches get high priority
          if (category === term || subcat === term) score += 50;
          
          // Fabric and explicit tags get normal priority
          if (item.fabric?.toLowerCase().includes(term)) score += 20;
          if (item.tags?.some(tag => tag.toLowerCase().includes(term))) score += 10;
          
          return { ...item, _score: score };
        });
        
        // Sort by highest score first
        ranked.sort((a, b) => b._score - a._score);
        
        // Return top 6 highly matched suggestions
        setSuggestions(ranked.slice(0, 6));
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([]);
      }
    }, 200); // 200ms debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchInput]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchInput, setSearchInput, suggestions }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
