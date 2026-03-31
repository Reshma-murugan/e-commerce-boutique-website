import logo from '../assets/brandLogo/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, Home, Search, X, LayoutGrid, User, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { useSearch } from '../context/SearchContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/formatPrice';
import './Header.css';

const Header = () => {
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { searchTerm, setSearchTerm, searchInput, setSearchInput, suggestions } = useSearch();
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const suggestions_filtered = searchInput.trim().length > 1 ? suggestions : [];
  const suggestionCategories = [...new Set(suggestions_filtered.map(p => p.category).filter(Boolean))];

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setShowSuggestions(true);
  };

  const executeSearch = (term, category = null) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    if (category) {
      if (window.location.pathname !== `/categories/${category}`) {
        navigate(`/categories/${category}`);
      }
    } else {
      if (window.location.pathname !== '/search') navigate('/search');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      executeSearch(searchInput);
    }
  };

  const handleSelectProduct = (product) => {
    setSearchInput('');
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="AuraRose Boutique" className="logo-img" />
        </Link>

        <div className="header-search" ref={wrapperRef}>
          <Search size={16} className="search-icon" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchInput.trim().length > 1 && setShowSuggestions(true)}
            className="header-search-input"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && (suggestionCategories.length > 0 || suggestions_filtered.length > 0)}
          />
          {(searchInput || searchTerm) && (
            <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
              <X size={14} strokeWidth={2.5} />
            </button>
          )}

          {showSuggestions && searchInput.trim().length > 1 && (
            <ul className="search-suggestions" role="listbox">
              {/* Keyword & Category Suggestions */}
              {suggestionCategories.slice(0, 3).map(cat => (
                <li
                  key={`cat-${cat}`}
                  className="suggestion-item text-suggestion"
                  role="option"
                  onMouseDown={() => executeSearch(searchInput, cat)}
                >
                  <Search size={14} className="suggestion-icon" />
                  <span className="suggestion-text">
                    Search "<strong>{searchInput}</strong>" in <span style={{textTransform: 'capitalize'}}>{cat}</span>
                  </span>
                </li>
              ))}
              
              <li
                className="suggestion-item text-suggestion"
                role="option"
                onMouseDown={() => executeSearch(searchInput)}
              >
                <Search size={14} className="suggestion-icon" />
                <span className="suggestion-text">
                  Search all for "<strong>{searchInput}</strong>"
                </span>
              </li>

              {/* Top Custom Matches */}
              {suggestions_filtered.length > 0 && (
                <div className="suggestion-divider">Top Products</div>
              )}
              {suggestions_filtered.slice(0, 2).map(product => (
                <li
                  key={product.id}
                  className="suggestion-item product-suggestion"
                  role="option"
                  onMouseDown={() => handleSelectProduct(product)}
                >
                  <img src={product.image} alt={product.title} className="suggestion-img" loading="lazy" />
                  <div className="suggestion-info">
                    <span className="suggestion-title">
                      {highlightMatch(product.title, searchInput)}
                    </span>
                    <span className="suggestion-meta">
                      <span className="suggestion-category">{product.category}</span>
                      <span className="suggestion-price">{formatPrice(product.price)}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav className="nav">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            <Home size={16} strokeWidth={2} />
            <span className="nav-link-label">Home</span>
          </Link>
          <Link to="/categories" className={`nav-link ${pathname.startsWith('/categories') ? 'active' : ''}`}>
            <LayoutGrid size={16} strokeWidth={2} />
            <span className="nav-link-label">Categories</span>
          </Link>
          <Link to="/wishlist" className={`nav-link wishlist-link ${pathname === '/wishlist' ? 'active' : ''}`}>
            <Heart size={16} strokeWidth={2} />
            <span className="nav-link-label">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/cart" className={`nav-link cart-link ${pathname === '/cart' ? 'active' : ''}`}>
            <ShoppingBag size={16} strokeWidth={2} />
            <span className="nav-link-label">Cart</span>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          <div className="nav-auth">
            {currentUser ? (
              <div className="user-menu-wrapper">
                <button className="nav-link user-profile-btn" aria-label="User profile">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="" className="user-avatar" />
                  ) : (
                    <User size={16} strokeWidth={2} />
                  )}
                  <span className="nav-link-label">{currentUser.displayName?.split(' ')[0] || 'Account'}</span>
                </button>
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{currentUser.displayName}</p>
                    <p className="user-email">{currentUser.email}</p>
                  </div>
                  <button onClick={logout} className="dropdown-item logout-btn">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={loginWithGoogle} className="nav-link login-btn">
                <User size={16} strokeWidth={2} />
                <span className="nav-link-label">Sign In</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

// Bold the matching part of the title
const highlightMatch = (title, term) => {
  const idx = title.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <strong>{title.slice(idx, idx + term.length)}</strong>
      {title.slice(idx + term.length)}
    </>
  );
};

export default Header;
