import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TAXONOMY } from '../data/taxonomy';
import './Categories.css';

// Flatten all subcategories with parent info
const ALL_SUBCATS = Object.entries(TAXONOMY).flatMap(([catSlug, cat]) =>
  cat.subcategories.map(sub => ({
    ...sub,
    catSlug,
    catLabel: cat.label,
    catAccent: cat.accent,
  }))
);

const FILTERS = [
  { slug: 'all',     label: 'All' },
  { slug: 'infant',  label: 'Infants' },
  { slug: 'toddler', label: 'Toddlers' },
  { slug: 'girls',   label: 'Girls' },
];

const Categories = () => {
  const [active, setActive] = useState('all');

  const visible = active === 'all'
    ? ALL_SUBCATS
    : ALL_SUBCATS.filter(s => s.catSlug === active);

  return (
    <div className="categories-page">
      {/* Hero */}
      <div className="categories-hero">
        <p className="categories-eyebrow">Shop by Style</p>
        <h1 className="categories-title">Our Collections</h1>
        <p className="categories-subtitle">
          Find the perfect style for every stage of childhood
        </p>
      </div>

      <div className="container">
        {/* Filter Buttons */}
        <div className="cat-filters">
          {FILTERS.map(f => (
            <button
              key={f.slug}
              className={`cat-filter-btn ${active === f.slug ? 'active' : ''}`}
              onClick={() => setActive(f.slug)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Subcategory Grid */}
        <div className="subcat-grid">
          {visible.map(sub => (
            <Link
              key={`${sub.catSlug}-${sub.slug}`}
              to={`/categories/${sub.catSlug}/${sub.slug}`}
              className="subcat-card"
              style={{ '--cat-accent': sub.catAccent }}
            >
              <div className="subcat-img-wrap">
                <img src={sub.image} alt={sub.label} loading="lazy" />
                <div className="subcat-img-overlay" />
                <span className="subcat-cat-tag">{sub.catLabel}</span>
              </div>
              <div className="subcat-body">
                <span className="subcat-label">{sub.label}</span>
                <span className="subcat-desc">{sub.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
