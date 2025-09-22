const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

export default Card;
