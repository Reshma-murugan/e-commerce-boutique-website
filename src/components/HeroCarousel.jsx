import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from '../assets/imageCarosel/AuraRose.png';
import img2 from '../assets/imageCarosel/img2.jpg';
import img3 from '../assets/imageCarosel/img3.jpg';
import img4 from '../assets/imageCarosel/img4.jpg';
import './HeroCarousel.css';

const SLIDES = [
  {
    id: 1,
    image: img1,
    tag: 'New Collection 2026',
    title: 'Fashion for Your\nLittle Princess',
    subtitle: 'Curated styles for infants, toddlers & girls',
    cta: 'Shop Now',
    link: '/categories',
    overlay: 'rgba(0,0,0,0)',
  },
  {
    id: 2,
    image: img2,
    tag: 'New Collection 2026',
    title: 'Fashion for Your\nLittle Princess',
    subtitle: 'Curated styles for infants, toddlers & girls',
    cta: 'Shop Now',
    link: '/categories',
    overlay: 'rgba(0,0,0,0)',
  },
  {
    id: 3,
    image: img3,
    tag: 'Festive Season',
    title: 'Celebrate in\nStyle',
    subtitle: 'Anarkalis, lehengas & ethnic wear for little ones',
    cta: 'Shop Festive',
    link: '/categories/girls/festive',
    overlay: 'rgba(0,0,0,0)',
  },
  {
    id: 4,
    image: img4,
    tag: 'Summer Essentials',
    title: 'Breezy Looks\nfor Sunny Days',
    subtitle: 'Light, airy dresses perfect for warm weather',
    cta: 'Shop Summer',
    link: '/categories/girls/summer',
    overlay: 'rgba(0,0,0,0)',
  },
];

const total = SLIDES.length;

// Returns the position slot relative to center: -2, -1, 0, 1, 2
const getOffset = (index, current) => {
  let offset = index - current;
  // Wrap around for circular effect
  if (offset > total / 2)  offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
};

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % total), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), []);

  // First slide stays for 5s (brand ad), rest cycle at 2s
  useEffect(() => {
    const duration = current === 0 ? 5000 : 2000;
    timerRef.current = setTimeout(next, duration);
    return () => clearTimeout(timerRef.current);
  }, [current, next]);

  return (
    <section className="hero-carousel">
      <div className="hc-track">
        {SLIDES.map((s, i) => {
          const offset = getOffset(i, current);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          return (
            <div
              key={s.id}
              className={`hc-slide ${isCenter ? 'center' : ''} ${isVisible ? 'visible' : 'hidden'}`}
              style={{ '--offset': offset }}
              onClick={() => !isCenter && (offset < 0 ? prev() : next())}
              aria-hidden={!isCenter}
            >
              <img
                src={s.image}
                alt={s.title}
                className="hc-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="hc-overlay" style={{ background: s.overlay }} />


            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button className="hc-arrow hc-arrow-prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>
      <button className="hc-arrow hc-arrow-next" onClick={next} aria-label="Next slide">
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Dots */}
      <div className="hc-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hc-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>


    </section>
  );
};

export default HeroCarousel;
