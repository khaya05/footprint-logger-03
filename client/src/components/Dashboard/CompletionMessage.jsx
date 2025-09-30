import React from 'react'

const CompletionMessage = ({ category }) => (
  <div className='mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center'>
    <span className='text-green-800 font-medium'>Goal Completed!</span>
    <p className='text-sm text-green-600 mt-1'>
      Great job reducing your {category} emissions!
    </p>
  </div>
);

export default CompletionMessage