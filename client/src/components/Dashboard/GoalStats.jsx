import React from 'react'

const StatRow = ({ label, value, highlight }) => (
  <div
    className={`flex justify-between text-sm ${
      highlight ? 'border-t pt-2' : ''
    }`}
  >
    <span className='text-gray-600'>{label}:</span>
    <span
      className={highlight ? 'font-semibold text-green-600' : 'font-medium'}
    >
      {value}
    </span>
  </div>
);

const GoalStats = ({ achieved, target }) => (
  <div className='mb-4 space-y-2'>
    <StatRow
      label='Current reduction'
      value={`${(achieved || 0).toFixed(1)} kg CO₂`}
    />
    <StatRow
      label='Target reduction'
      value={`${(target || 0).toFixed(1)} kg CO₂`}
    />
    <StatRow
      label='Progress'
      value={`${(achieved || 0).toFixed(1)} / ${(target || 0).toFixed(
        1
      )} kg CO₂`}
      highlight
    />
  </div>
);

export default GoalStats