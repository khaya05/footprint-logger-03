import customFetch from '../../util/customFetch.js';
import { useState } from 'react';
import { toastService } from '../../util/toastUtil.js';

const TipCard = ({ goal, onAccepted }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.patch(`/goals/${goal._id}/accept`);
      toastService.success(data.message || 'Goal accepted!');
      if (onAccepted) onAccepted(data.goal);
    } catch (error) {
      toastService.error(error?.response?.data?.msg || 'Failed to accept goal');
    } finally {
      setLoading(false);
    }
  };

  if (goal.status === 'accepted' || goal.status === 'customized') {
    return (
      <div className='p-4 bg-green-50 border border-green-200 rounded-xl shadow flex items-center justify-between'>
        <span className='text-sm font-medium text-green-700'>
          Tracking goal: {goal.tip}
        </span>
        <span className='px-3 py-1 text-xs bg-green-600 text-white rounded-lg'>
          Active
        </span>
      </div>
    );
  }

  if (goal.status === 'completed') {
    return (
      <div className='p-4 bg-blue-50 border border-blue-200 rounded-xl shadow flex items-center justify-between'>
        <span className='text-sm font-medium text-blue-700'>
          🎉 Goal completed: {goal.tip}
        </span>
      </div>
    );
  }

  if (goal.status === 'dismissed') {
    return null;
  }

  return (
    <div className='p-4 bg-white rounded-xl shadow flex items-center justify-between'>
      <span className='text-sm font-medium'>{goal.tip}</span>
      <button
        onClick={handleAccept}
        disabled={loading}
        className='px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 hover:cursor-pointer'
      >
        {loading ? 'Accepting...' : 'Try It'}
      </button>
    </div>
  );
};

export default TipCard;
