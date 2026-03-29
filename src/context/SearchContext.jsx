import { createContext, useState, useEffect, useContext } from 'react';
import { dataService } from '../services/dataService';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(''); // The actually applied search filter
  const [searchInput, setSearchInput] = useState(''); // The text currently being typed in the header
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const data = await dataService.getSuggestions(searchInput);
        if (!cancelled) {
          setSuggestions(data);
        }
      } catch (err) {
        if (!cancelled) setSuggestions([]);
      }
    }, 200); // 200ms debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchInput]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchInput, setSearchInput, suggestions }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
