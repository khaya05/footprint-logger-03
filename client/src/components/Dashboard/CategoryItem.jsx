import React from 'react'

const CategoryItem = ({ category, data, getCategoryIcon }) => (
  <div className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md'>
    <div className='flex items-center gap-2'>
      {getCategoryIcon(category)}
      <span className='text-sm text-gray-700 capitalize'>{category}</span>
    </div>
    <div className='text-right'>
      <div className='text-sm font-medium text-gray-800'>
        {data.total.toFixed(1)} kg CO₂
      </div>
      <div className='text-xs text-gray-500'>{data.count} activities</div>
    </div>
  </div>
);

export default CategoryItem