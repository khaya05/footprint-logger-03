import { FaSearch, FaFilter } from 'react-icons/fa';
import { FaArrowRotateLeft } from 'react-icons/fa6';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  showAdvanced,
  toggleAdvanced,
  activeFiltersCount,
  clearAllFilters,
}) => {
  return (
    <div className='p-4 border-b border-gray-100'>
      <div className='flex items-center space-x-3'>
        <div className='relative flex-1'>
          <FaSearch
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            size={20}
          />
          <input
            type='text'
            placeholder='Search activities or notes...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
          />
        </div>

        <button
          onClick={toggleAdvanced}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showAdvanced
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaFilter size={18} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className='bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center'>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className='flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
            title='Clear all filters'
          >
            <FaArrowRotateLeft size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
