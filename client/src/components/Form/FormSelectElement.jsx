const FormSelectElement = ({
  name,
  label,
  options,
  error,
  placeholder = 'Select...',
  required,
  onChange
}) => {
  return (
    <div className='w-full mt-2'>
      <label
        htmlFor={name}
        className='capitalize text-sm font-medium text-gray-700'
      >
        {label || name}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        onChange={onChange}
        className='block h-10 w-[100%] px-3 mt-1 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white'
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
    </div>
  );
};

export default FormSelectElement;
