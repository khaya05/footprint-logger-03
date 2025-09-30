import React from 'react';

const ActionButtons = ({ progress, onCustomize, onComplete, onDelete }) => (
  <div className='flex gap-2 mt-4'>
    <button
      onClick={onCustomize}
      className='flex-1 bg-blue-100 text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-200 hover:cursor-pointer transition-colors text-sm font-medium'
    >
      Customize
    </button>
    {progress >= 100 ? (
      <button
        onClick={onComplete}
        className='flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium'
      >
        Mark Complete
      </button>
    ) : (
      <button
        disabled
        className='flex-1 bg-gray-200 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm font-medium'
      >
        Complete ({progress}%)
      </button>
    )}
    <button
      onClick={onDelete}
      className='px-4 py-2 bg-red-100 text-red-600 border border-red-200 rounded-md hover:bg-red-200 hover:cursor-pointer transition-colors text-sm font-medium'
    >
      Delete
    </button>
  </div>
);

export default ActionButtons;
