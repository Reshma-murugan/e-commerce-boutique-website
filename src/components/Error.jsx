import { AlertTriangle } from 'lucide-react';
import './Error.css';

const Error = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <AlertTriangle size={48} strokeWidth={1.5} />
      </div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message || 'Unable to load data. Please try again later.'}</p>
    </div>
  );
};

export default Error;
