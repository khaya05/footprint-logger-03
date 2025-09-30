import React from 'react'

const CustomizeForm = ({
  currentTarget,
  value,
  onChange,
  onSubmit,
  onCancel,
}) => (
  <form onSubmit={onSubmit} className='mb-4 p-4 border rounded-lg bg-gray-50'>
    <h3 className='font-medium mb-3'>Customize Your Goal</h3>
    <input
      type='number'
      step='0.1'
      min='0.1'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={currentTarget?.toFixed(1)}
      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3'
    />
    <div className='flex gap-2'>
      <button
        type='submit'
        className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium'
      >
        Save Changes
      </button>
      <button
        type='button'
        onClick={onCancel}
        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium'
      >
        Cancel
      </button>
    </div>
  </form>
);

export default CustomizeForm