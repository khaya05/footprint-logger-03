import React from 'react'

const LogProgress = ({goalProgress}) => {
  return (
    <div className='p-4 bg-blue-50 border border-blue-200 rounded-xl'>
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>
          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
            <span className='text-blue-600 text-sm font-semibold'>
              {Math.round(
                ((Math.min(goalProgress.activitiesCount / 5, 1) +
                  Math.min(goalProgress.totalEmissions / 20, 1)) /
                  2) *
                  100
              )}
              %
            </span>
          </div>
        </div>
        <div className='flex-1'>
          <p className='text-blue-800 font-medium'>
            Keep logging! Need {5 - goalProgress.activitiesCount} more
            activities and {Math.ceil(20 - goalProgress.totalEmissions)} more kg
            CO₂ to unlock challenges.
          </p>
          <div className='mt-2 flex gap-4 text-sm text-blue-600'>
            <span>📊 {goalProgress.activitiesCount}/5 activities</span>
            <span>
              📈 {Math.round(goalProgress.totalEmissions * 10) / 10}/20 kg CO₂
            </span>
            {goalProgress.categoriesUsed && (
              <span>🏷️ {goalProgress.categoriesUsed} categories</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogProgress