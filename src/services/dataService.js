/**
 * Data Service for Serverless Environment (Netlify)
 * Replaces json-server by fetching a static JSON file and performing
 * filtering, searching, and sorting in the browser.
 */

let cachedData = null;

const fetchData = async () => {
  if (cachedData) return cachedData;
  const res = await fetch('/data/db.json');
  if (!res.ok) throw new Error('Failed to load static database');
  const data = await res.json();

  // Shuffle products once for a better category mix on the home page
  if (data.products && Array.isArray(data.products)) {
    const shuffled = [...data.products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    data.products = shuffled;
  }

  cachedData = data;
  return data;
};

export const dataService = {
  /**
   * Fetch a paginated feed of products with filters
   * Replicates the exact behavior for category, subcategory, search, and sort.
   */
  async getProducts({ category, subcategory, search, sort, page = 1, pageSize = 20, limit }) {
    const data = await fetchData();
    let items = [...data.products];

    // 1. Filter by category
    if (category && category !== 'all') {
      items = items.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    // 2. Filter by subcategory
    if (subcategory) {
      items = items.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }

    // 3. Search Relevance Engine
    if (search) {
      const term = search.trim().toLowerCase();
      const rawTerms = term.split(/\\s+/);

      // Define synonym mappings
      const synMap = {
        'baby': ['infant', 'infants'],
        'babies': ['infant', 'infants', 'baby'],
        'infant': ['baby', 'infants'],
        'infants': ['baby', 'infant'],
        'kid': ['kids'],
        'kids': ['kid'],
        'toddler': ['toddlers'],
        'toddlers': ['toddler'],
        'girl': ['girls'],
        'girls': ['girl'],
        'dress': ['dresses'],
        'dresses': ['dress']
      };

      // Create term groups (term + its synonyms) for 'OR' matching within 'AND' clauses
      const termGroups = rawTerms.map(t => {
        const group = [t];
        if (synMap[t]) group.push(...synMap[t]);
        return group;
      });

      // Keep items that match ALL search terms (or their synonyms) across their searchable text
      items = items.filter(item => {
        const textToSearch = [
          item.title,
          item.category,
          item.subcategory,
          item.search_text,
          item.fabric,
          item.color,
          ...(Array.isArray(item.tags) ? item.tags : [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Every group must have at least one term matched in textToSearch
        return termGroups.every(group => group.some(t => textToSearch.includes(t)));
      });

      // Apply scoring
      items = items.map(item => {
        let score = 0;
        const title = (item.title || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        const subcat = (item.subcategory || '').toLowerCase();
        
        // Exact full term scores
        if (title === term) score += 200;
        else if (title.includes(term)) score += 100;
        if (cat === term || subcat === term) score += 50;
        if (item.fabric?.toLowerCase().includes(term)) score += 20;
        if (item.tags?.some(tag => tag.toLowerCase().includes(term))) score += 10;
        
        // Partial term scores
        rawTerms.forEach(t => {
          if (title.includes(t)) score += 10;
          if (cat === t || subcat === t) score += 20;
          if (Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase() === t)) score += 15;
          if (item.fabric?.toLowerCase().includes(t)) score += 5;
        });
        
        return { ...item, _score: score };
      });

      // Default search sort is by relevance
      items.sort((a, b) => b._score - a._score);
    } else {
      // 4. Default Sorting (if not searching)
      if (sort === 'price-asc') {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        items.sort((a, b) => b.price - a.price);
      } else if (sort === 'name-asc') {
        items.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === 'rating') {
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    const totalCount = items.length;
    const itemsPerPage = limit || pageSize;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // 5. Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      data: paginatedItems,
      total: totalCount,
      pages: totalPages,
    };
  },

  /**
   * For autocomplete suggestions
   */
  async getSuggestions(search) {
    if (!search || search.length < 2) return [];
    
    // Use the same logic but return only top 6
    const result = await this.getProducts({ search, pageSize: 6 });
    return result.data;
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id) {
    const data = await fetchData();
    return data.products.find(p => String(p.id) === String(id)) || null;
  }
};
