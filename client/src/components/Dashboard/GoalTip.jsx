import React from 'react'

const GoalTip = ({ tip }) => (
  <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
    <p className='text-sm text-blue-800'>
      {tip || 'Stay committed to your emission reduction goal!'}
    </p>
  </div>
);

export default GoalTip