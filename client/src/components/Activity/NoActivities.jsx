import { Link } from 'react-router-dom';

const NoActivities = () => {
  return (
    <div className='h-[100vh] flex flex-col justify-center items-center'>
      <p className='font-bold mb-4'>
        {' '}
        You don't have any activities to display
      </p>
      <Link
        to='add-activity'
        className='bg-green-500 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-green-600 text-white transition-all'
      >
        + Add Activity
      </Link>
    </div>
  );
};

export default NoActivities;
