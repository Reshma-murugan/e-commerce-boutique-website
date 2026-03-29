import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-logo">AuraRose</span>
              <p className="footer-desc">Fashion for your little princess. Curated with love for infants, toddlers, and girls.</p>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><Link to="/?category=infant">Infants</Link></li>
                <li><Link to="/?category=toddler">Toddlers</Link></li>
                <li><Link to="/?category=girls">Girls</Link></li>
                <li><Link to="/">All Products</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Account</h4>
              <ul className="footer-links">
                <li><Link to="/wishlist">My Wishlist</Link></li>
                <li><Link to="/cart">My Cart</Link></li>
                <li><Link to="/checkout">Checkout</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AuraRose Boutique. All rights reserved.</p>
            <p className="footer-tagline">Made with <Heart size={12} fill="currentColor" style={{display:'inline', verticalAlign:'middle', color:'#ff4d7d'}} /> for little ones</p>
          </div>
        </div>
      </footer>

      {/* Minimal footer shown on mobile above bottom nav */}
      <div className="footer-mobile">
        &copy; {new Date().getFullYear()} AuraRose Boutique
      </div>
    </>
  );
};

export default Footer;
