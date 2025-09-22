import { SlCalender } from 'react-icons/sl';
import { Link } from 'react-router-dom';

import {
  FaEdit,
  FaRegTrashAlt,
  FaBalanceScale,
  FaFileAlt,
} from 'react-icons/fa';
import { FaBoltLightning } from 'react-icons/fa6';
import { CATEGORIES } from '../../util/emissionFactors';
import { useDashboardContext } from '../../pages/DashboardLayout';

const ActivityCard = ({ activity }) => {
  const { setDeleteId, setShowConfirmDelete, setCurrentTab } =
    useDashboardContext();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    return CATEGORIES.find((cat) => cat.value === category).color;
  };

  const getCategoryIcon = (category) => {
    return CATEGORIES.find((cat) => cat.value === category).icon;
  };

  const handleDeleteActivity = (id) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
    console.log('hey');
  };

  return (
    <>
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
        <div className='p-6 pb-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>
                {getCategoryIcon(activity.category)}
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 capitalize'>
                  {activity.activity}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(
                    activity.category
                  )}`}
                >
                  {activity.category}
                </span>
              </div>
            </div>

            <div className='flex space-x-2'>
              <Link
                to={`../edit-activity/${activity._id}`}
                onClick={() => setCurrentTab('Activities')}
                className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200'
              >
                <FaEdit size={18} />
              </Link>
              <button
                type='button'
                className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200'
                onClick={() => handleDeleteActivity(activity._id)}
              >
                <FaRegTrashAlt size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className='px-6 pb-6'>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-orange-50 rounded-lg p-3'>
              <div className='flex items-center space-x-2'>
                <FaBalanceScale size={16} className='text-orange-500' />
                <span className='text-sm font-medium text-orange-600'>
                  Amount
                </span>
              </div>
              <p className='text-lg font-semibold text-orange-900 mt-1'>
                {activity.amount} {activity.unit}
              </p>
            </div>

            <div className='bg-green-50 rounded-lg p-3'>
              <div className='flex items-center space-x-2'>
                <FaBoltLightning size={16} className='text-green-500' />
                <span className='text-sm font-medium text-green-600'>
                  Emissions
                </span>
              </div>
              <p className='text-lg font-semibold text-green-700 mt-1'>
                {activity.emissions} kg CO₂
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2 mb-3'>
            <SlCalender size={16} className='text-gray-500' />
            <span className='text-sm text-gray-600'>
              {formatDate(activity.date)}
            </span>
          </div>

          {activity.notes && (
            <div className='flex items-start space-x-2'>
              <FaFileAlt size={16} className='text-gray-500 mt-0.5' />
              <p className='text-sm text-gray-600 italic'>"{activity.notes}"</p>
            </div>
          )}
        </div>

        <div className='px-6 py-3 bg-gray-50 rounded-b-xl'>
          <p className='text-xs text-gray-400'>
            Added {formatDate(activity.createdAt)}
          </p>
        </div>
      </div>
    </>
  );
};

export default ActivityCard;
