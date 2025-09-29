import React from 'react'

const SuggestionActions = ({
  suggestion,
  isRecommended,
  onAccept,
  loading,
}) => (
  <div className='flex gap-2'>
    <button
      onClick={() => onAccept(suggestion)}
      disabled={loading === suggestion.id}
      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
        isRecommended
          ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 hover:cursor-pointer'
          : 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400 hover:cursor-pointer'
      } disabled:cursor-not-allowed`}
    >
      {loading === suggestion.id ? 'Starting...' : 'Start Challenge'}
    </button>
  </div>
);
export default SuggestionActions