import { useState } from 'react';
import { Form, useSubmit, Link } from 'react-router-dom';
import { FiFilter, FiRotateCcw } from 'react-icons/fi';
import { CATEGORIES, SORT_OPTIONS } from '../../util/emissionFactors';
import { useActivityContext } from '../../pages/AllActivities';
import { FormInputElement, FormSelectElement } from '..';

const SearchActivity = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { searchValues } = useActivityContext();
  const { search, category, sort } = searchValues;

  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;

    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };

  const resertForm = () => {
    setShowFilters(false);
  };

  return (
    <div className='bg-white p-4 rounded mb-8 shadow'>
      <div className='flex items-center justify-between mb-4'>
        <h4 className='text-lg font-medium text-gray-700'>Search</h4>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition shadow ${
              showFilters
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          <Link
            to='/dashboard/activities'
            onClick={resertForm}
            className='flex items-center gap-1 px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50 transition'
          >
            <FiRotateCcw />
            <span>Reset</span>
          </Link>
        </div>
      </div>

      <Form className='space-y-4'>
        <div className='relative'>
          <FormInputElement
            type='search'
            name='search'
            defaultValue={search}
            placeholder='Search for activity or notes'
            onChange={debounce((form) => {
              submit(form);
            })}
          />
        </div>

        {showFilters && (
          <div className='md:flex md:gap-4'>
            <FormSelectElement
              label='Filter By Category'
              name='category'
              defaultValue={category}
              options={[{ value: 'all', label: 'ALL' }, ...CATEGORIES]}
              onChange={(e) => {
                submit(e.currentTarget.form);
              }}
            />
            <FormSelectElement
              label='Sort'
              name='sort'
              defaultValue={sort}
              options={SORT_OPTIONS}
              onChange={(e) => {
                submit(e.currentTarget.form);
              }}
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default SearchActivity;
