import { useState } from 'react';
import Card from './Card';
import CardContent from './CardContent';

const ActiveGoal = ({ goal, onCustomize, onComplete }) => {
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [customTarget, setCustomTarget] = useState('');
  const [customTip, setCustomTip] = useState('');

  if (!goal) {
    return (
      <Card>
        <CardContent>
          <h2 className='text-lg font-semibold mb-2'>Weekly Goal</h2>
          <p className='text-gray-500'>
            No active goal yet. Complete the challenges above to set your first
            goal!
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress =
    goal.achievedReduction && goal.targetReduction
      ? Math.min(
          100,
          Math.round((goal.achievedReduction / goal.targetReduction) * 100)
        )
      : 0;

  const getCategoryEmoji = (category) => {
    const emojis = {
      transport: '🚗',
      energy: '⚡',
      food: '🥗',
      digital: '💻',
    };
    return emojis[category] || '🎯';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      customized: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || colors.pending;
  };

  const handleCustomizeSubmit = (e) => {
    e.preventDefault();
    if (onCustomize && (customTarget || customTip)) {
      const updates = {};
      if (customTarget) updates.targetReduction = parseFloat(customTarget);
      if (customTip) updates.tip = customTip;

      onCustomize(goal._id, updates);
      setShowCustomizeForm(false);
      setCustomTarget('');
      setCustomTip('');
    }
  };

  const getDaysRemaining = () => {
    if (!goal.weekEnd) return 0;
    const now = new Date();
    const end = new Date(goal.weekEnd);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>{getCategoryEmoji(goal.category)}</span>
            <div>
              <h2 className='text-lg font-semibold capitalize'>
                {goal.category} Challenge
              </h2>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  goal.status
                )}`}
              >
                {goal.status}
              </span>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-green-600'>{progress}%</div>
            <div className='text-xs text-gray-500'>
              {getDaysRemaining()} days left
            </div>
          </div>
        </div>

        <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
          <p className='text-sm text-blue-800'>
            💡 {goal.tip || 'Stay committed to your emission reduction goal!'}
          </p>
        </div>

        <div className='mb-4 space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Current reduction:</span>
            <span className='font-medium'>
              {(goal.achievedReduction || 0).toFixed(1)} kg CO₂
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Target reduction:</span>
            <span className='font-medium'>
              {(goal.targetReduction || 0).toFixed(1)} kg CO₂
            </span>
          </div>
          <div className='flex justify-between text-sm border-t pt-2'>
            <span className='text-gray-600'>Progress:</span>
            <span className='font-semibold text-green-600'>
              {(goal.achievedReduction || 0).toFixed(1)} /{' '}
              {(goal.targetReduction || 0).toFixed(1)} kg CO₂
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
                  placeholder={goal.targetReduction?.toFixed(1)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Personal Tip
                </label>
                <input
                  type='text'
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder='Add your personal reminder...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
            <div className='flex gap-2 mt-3'>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium'
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

        {goal.status !== 'completed' && (
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
                onClick={() => onComplete && onComplete(goal._id)}
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

        {goal.status === 'completed' && (
          <div className='mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-center'>
            <span className='text-green-800 font-medium'>
              🎉 Goal Completed!
            </span>
            <p className='text-sm text-green-600 mt-1'>
              Great job reducing your {goal.category} emissions!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveGoal;
