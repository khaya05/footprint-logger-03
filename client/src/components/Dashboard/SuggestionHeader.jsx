import React from 'react'

const SuggestionHeader = ({ onDismiss }) => (
  <div className='flex items-center justify-between mb-4'>
    <h3 className='text-xl font-semibold text-green-700'>🎉 Tips Unlocked!</h3>
    <button
      onClick={onDismiss}
      className='text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100'
    >
      Maybe Later
    </button>
  </div>
);

export default SuggestionHeader