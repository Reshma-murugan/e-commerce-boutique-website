import { Link } from 'react-router-dom';
import { Heart, Leaf, ShieldCheck, Sparkles, Users, Package, Star, Award } from 'lucide-react';
import './About.css';

const STATS = [
  { value: '10,000+', label: 'Happy Families' },
  { value: '500+',    label: 'Curated Styles' },
  { value: '4.8★',    label: 'Average Rating' },
  { value: '7-Day',   label: 'Easy Returns' },
];

const VALUES = [
  {
    Icon: Heart,
    title: 'Made with Love',
    desc: 'Every piece is handpicked with care. We treat every child like our own and every outfit like a gift.',
  },
  {
    Icon: Leaf,
    title: 'Safe & Gentle',
    desc: 'All fabrics are tested for skin safety. No harsh dyes, no rough seams — just soft, breathable comfort.',
  },
  {
    Icon: ShieldCheck,
    title: '100% Authentic',
    desc: 'We source directly from trusted manufacturers. Every product is quality-checked before it reaches you.',
  },
  {
    Icon: Sparkles,
    title: 'Style at Every Age',
    desc: 'From newborns to tweens, we believe every child deserves to feel confident and beautiful.',
  },
];

const TEAM = [
  {
    name: 'Priya Sharma',
    role: 'Founder & Creative Director',
    // Indian woman, professional
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
    quote: '"I started AuraRose because I couldn\'t find clothes that were both beautiful and comfortable for my daughter."',
  },
  {
    name: 'Ananya Mehta',
    role: 'Head of Curation',
    // Woman smiling, professional
    image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300',
    quote: '"Every style we add goes through a 12-point quality check. If I wouldn\'t dress my child in it, it doesn\'t make the cut."',
  },
  {
    name: 'Riya Kapoor',
    role: 'Customer Experience Lead',
    // Woman, warm smile
    image: 'https://images.pexels.com/photos/3756678/pexels-photo-3756678.jpeg?auto=compress&cs=tinysrgb&w=300',
    quote: '"Our customers are our community. Every feedback shapes what we do next."',
  },
];

const About = () => (
  <div className="about-page">

    {/* Hero */}
    <section className="about-hero">
      <div className="about-hero-content">
        <p className="about-eyebrow">Our Story</p>
        <h1 className="about-title">Dressing Little Ones<br />with Love Since 2020</h1>
        <p className="about-hero-sub">
          AuraRose Boutique was born from a simple belief — every child deserves to feel
          beautiful, comfortable, and confident in what they wear.
        </p>
        <Link to="/categories" className="about-hero-cta">Shop the Collection</Link>
      </div>
      <div className="about-hero-image">
        <img
          src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="AuraRose Boutique — little girl in a beautiful dress"
        />
      </div>
    </section>

    {/* Stats */}
    <div className="about-stats">
      {STATS.map(({ value, label }) => (
        <div key={label} className="about-stat">
          <span className="about-stat-value">{value}</span>
          <span className="about-stat-label">{label}</span>
        </div>
      ))}
    </div>

    {/* Mission */}
    <section className="about-mission">
      <div className="about-mission-text">
        <p className="about-section-eyebrow">Our Mission</p>
        <h2 className="about-section-title">More Than Just Clothes</h2>
        <p className="about-mission-body">
          We started AuraRose in 2020 with a single rack of handpicked dresses and a dream.
          Today, we serve over 10,000 families across India — but our mission hasn't changed.
        </p>
        <p className="about-mission-body">
          We believe children's clothing should be joyful, safe, and accessible. That's why
          every piece in our collection is carefully sourced, quality-tested, and priced fairly.
          No compromises on comfort. No compromises on style.
        </p>
        <p className="about-mission-body">
          From a newborn's first outfit to a girl's birthday gown — we want to be part of
          every precious moment.
        </p>
      </div>
      <div className="about-mission-image">
        <img
          src="https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Mother and child — our mission"
        />
      </div>
    </section>

    {/* Values */}
    <section className="about-values">
      <div className="about-section-header">
        <p className="about-section-eyebrow">What We Stand For</p>
        <h2 className="about-section-title">Our Values</h2>
      </div>
      <div className="about-values-grid">
        {VALUES.map(({ Icon, title, desc }) => (
          <div key={title} className="about-value-card">
            <div className="about-value-icon">
              <Icon size={24} strokeWidth={1.8} />
            </div>
            <h3 className="about-value-title">{title}</h3>
            <p className="about-value-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Team */}
    <section className="about-team">
      <div className="about-section-header">
        <p className="about-section-eyebrow">The People Behind AuraRose</p>
        <h2 className="about-section-title">Meet Our Team</h2>
      </div>
      <div className="about-team-grid">
        {TEAM.map(({ name, role, image, quote }) => (
          <div key={name} className="about-team-card">
            <div className="about-team-img-wrap">
              <img src={image} alt={name} loading="lazy" />
            </div>
            <div className="about-team-info">
              <h3 className="about-team-name">{name}</h3>
              <p className="about-team-role">{role}</p>
              <p className="about-team-quote">{quote}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA banner */}
    <section className="about-cta-banner">
      <Heart size={32} strokeWidth={1.5} color="var(--color-primary)" />
      <h2>Ready to find the perfect outfit?</h2>
      <p>Browse our full collection of handpicked styles for every little one.</p>
      <Link to="/categories" className="about-cta-btn">Shop Now</Link>
    </section>

  </div>
);

export default About;
