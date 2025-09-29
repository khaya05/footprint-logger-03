import React from 'react'

const SuggestionStats = ({ suggestion }) => (
  <div className='bg-white/70 rounded-lg p-3 mb-4 space-y-2 shadow'>
    <div className='flex justify-between text-sm'>
      <span className='text-gray-600'>Current week total:</span>
      <span className='font-medium'>{suggestion.currentWeekly} kg CO₂</span>
    </div>
    <div className='flex justify-between text-sm'>
      <span className='text-gray-600'>Target reduction:</span>
      <span className='font-medium text-red-600'>
        -{suggestion.targetReduction} kg CO₂ ({suggestion.reductionPercent}%)
      </span>
    </div>
    <div className='flex justify-between text-sm border-t pt-2'>
      <span className='text-gray-600'>New target:</span>
      <span className='font-semibold text-green-600'>
        {(suggestion.currentWeekly - suggestion.targetReduction).toFixed(1)} kg
        CO₂
      </span>
    </div>
  </div>
);
export default SuggestionStats