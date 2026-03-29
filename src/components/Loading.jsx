import './Loading.css';

// Grid of skeleton cards — matches the product grid layout
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img shimmer" />
    <div className="skeleton-body">
      <div className="skeleton-line shimmer" style={{ width: '80%' }} />
      <div className="skeleton-line shimmer" style={{ width: '50%' }} />
      <div className="skeleton-line shimmer" style={{ width: '65%', height: '20px' }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

// Full-page fallback (used by ProductDetails while fetching single product)
const Loading = () => <div className="skeleton-page"><SkeletonGrid count={4} /></div>;

export default Loading;
