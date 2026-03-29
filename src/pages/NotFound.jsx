import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '1rem',
    textAlign: 'center', padding: '2rem'
  }}>
    <p style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>404</p>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>Page not found</h1>
    <p style={{ color: 'var(--color-text-muted)', maxWidth: 320 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'var(--color-primary)', color: 'white',
      padding: '0.75rem 1.5rem', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.875rem',
      boxShadow: 'var(--shadow-brand)', marginTop: '0.5rem'
    }}>
      <Home size={16} strokeWidth={2} />
      Back to Home
    </Link>
  </div>
);

export default NotFound;
