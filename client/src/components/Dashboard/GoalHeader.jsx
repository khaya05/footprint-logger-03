import React from 'react'
import { getCategoryEmoji } from '../../util/emissionFactors';

const GoalHeader = ({ category, progress }) => (
  <div className='flex items-center justify-between mb-4'>
    <div className='flex items-center gap-3'>
      <span className='text-2xl'>{getCategoryEmoji(category)}</span>
      <h2 className='text-lg font-semibold capitalize'>{category} Challenge</h2>
    </div>
    <div className='text-2xl font-bold text-green-600'>{progress}%</div>
  </div>
);

export default GoalHeader