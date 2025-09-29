import { useState } from 'react';
import Card from './Card';
import CardContent from './CardContent';
import { getCategoryEmoji } from '../../util/emissionFactors';

const ActiveGoal = ({ goal, onCustomize, onComplete }) => {
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [customTarget, setCustomTarget] = useState('');
  const [customTip, setCustomTip] = useState('');

  if (!goal.goal) {
    return (
      <Card>
        <CardContent>
          <h2 className='text-lg font-semibold mb-2'>Weekly Goal</h2>
          <p className='text-gray-500'>
            No active goal yet. Start the challenges above to set your first
            goal!
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress =
    goal.goal.achievedReduction && goal.goal.targetReduction
      ? Math.min(
          100,
          Math.round(
            (goal.goal.achievedReduction / goal.goal.targetReduction) * 100
          )
        )
      : 0;

  const handleCustomizeSubmit = (e) => {
    e.preventDefault();
    if (onCustomize && (customTarget || customTip)) {
      const updates = {};
      if (customTarget) updates.targetReduction = parseFloat(customTarget);
      if (customTip) updates.tip = customTip;

      window.scroll(0, 0);
      onCustomize(goal.goal._id, updates);
      setShowCustomizeForm(false);
      setCustomTarget('');
      setCustomTip('');
    }
  };

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>
              {getCategoryEmoji(goal.goal.category)}
            </span>
            <div>
              <h2 className='text-lg font-semibold capitalize'>
                {goal.goal.category} Challenge
              </h2>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-green-600'>{progress}%</div>
          </div>
        </div>

        <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
          <p className='text-sm text-blue-800'>
            💡{' '}
            {goal.goal.tip || 'Stay committed to your emission reduction goal!'}
          </p>
        </div>

        <div className='mb-4 space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Current reduction:</span>
            <span className='font-medium'>
              {(goal.goal.achievedReduction || 0).toFixed(1)} kg CO₂
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Target reduction:</span>
            <span className='font-medium'>
              {(goal.goal.targetReduction || 0).toFixed(1)} kg CO₂
            </span>
          </div>
          <div className='flex justify-between text-sm border-t pt-2'>
            <span className='text-gray-600'>Progress:</span>
            <span className='font-semibold text-green-600'>
              {(goal.goal.achievedReduction || 0).toFixed(1)} /{' '}
              {(goal.goal.targetReduction || 0).toFixed(1)} kg CO₂
            </span>
          </div>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-3 mb-4'>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              progress >= 100
                ? 'bg-green-500'
                : progress >= 50
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {showCustomizeForm && (
          <form
            onSubmit={handleCustomizeSubmit}
            className='mb-4 p-4 border rounded-lg bg-gray-50'
          >
            <h3 className='font-medium mb-3'>Customize Your Goal</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Target Reduction (kg CO₂)
                </label>
                <input
                  type='number'
                  step='0.1'
                  min='0.1'
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  placeholder={goal.goal.targetReduction?.toFixed(1)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>
            <div className='flex gap-2 mt-3'>
              <button
                type='submit'
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium'
              >
                Save Changes
              </button>
              <button
                type='button'
                onClick={() => setShowCustomizeForm(false)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium'
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {goal.goal.status !== 'completed' && (
          <div className='flex gap-2 mt-4'>
            {!showCustomizeForm && (
              <button
                onClick={() => setShowCustomizeForm(true)}
                className='flex-1 bg-blue-100 text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium'
              >
                Customize
              </button>
            )}
            {progress >= 100 && (
              <button
                onClick={() => onComplete && onComplete(goal.goal._id)}
                className='flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium'
              >
                🎉 Mark Complete
              </button>
            )}
            {progress < 100 && (
              <button
                disabled
                className='flex-1 bg-gray-200 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed text-sm font-medium'
              >
                Complete Goal ({progress}%)
              </button>
            )}
          </div>
        )}

        {goal.goal.status === 'completed' && (
          <div className='mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center'>
            <span className='text-green-800 font-medium'>
              🎉 Goal Completed!
            </span>
            <p className='text-sm text-green-600 mt-1'>
              Great job reducing your {goal.goal.category} emissions!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveGoal;
