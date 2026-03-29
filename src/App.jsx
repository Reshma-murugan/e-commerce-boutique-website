import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Categories from './pages/Categories'
import CategoryListing from './pages/CategoryListing'
import SearchResults from './pages/SearchResults'
import About from './pages/About'
import NotFound from './pages/NotFound'
import './App.css'

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'
  useEffect(() => {
    // POP = browser back/forward — restore scroll naturally
    // PUSH/REPLACE = new navigation — scroll to top
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);
  return null;
};

function App() {
  return (
    <div className="app">
      <Header />
      <ScrollToTop />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryListing />} />
          <Route path="/categories/:slug/:sub" element={<CategoryListing />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      <BottomNav />
    </div>
  )
}

export default App
