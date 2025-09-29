import React from 'react'

const Section = ({ title, children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {title && (
      <h3 className='text-sm font-medium text-gray-700 mb-3'>{title}</h3>
    )}
    {children}
  </div>
);

export default Section