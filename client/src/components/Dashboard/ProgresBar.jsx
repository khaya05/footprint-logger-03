import React from 'react'

const ProgressBar = ({ progress }) => (
  <div className='w-full bg-gray-200 rounded-full h-3 mb-4'>
    <div
      className={`h-3 rounded-full transition-all duration-300 ${
        progress >= 100
          ? 'bg-green-500'
          : progress >= 50
          ? 'bg-yellow-500'
          : 'bg-blue-500'
      }`}
      style={{ width: `${Math.min(progress, 100)}%` }}
    />
  </div>
);

export default ProgressBar