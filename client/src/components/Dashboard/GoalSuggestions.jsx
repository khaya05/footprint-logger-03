import { useState } from 'react';
import customFetch from '../../util/customFetch.js';
import { toastService } from '../../util/toastUtil.js';
import Card from './Card.jsx';
import CardContent from './CardContent.jsx';

const GoalSuggestions = ({ suggestions, onGoalAccepted, onDismiss }) => {
  const [loading, setLoading] = useState(null);

  const handleAcceptGoal = async (suggestion) => {
    setLoading(suggestion.id);
    try {
      const goalData = {
        category: suggestion.category,
        targetReduction: suggestion.targetReduction,
        tip: suggestion.tip,
        totalEmissions: suggestion.totalEmissions,
      };

      const { data } = await customFetch.post('/goals', goalData);
      const acceptedGoal = await customFetch.patch(
        `/goals/${data.goal._id}/accept`
      );

      toastService.success(`${suggestion.title} accepted!`);
      if (onGoalAccepted) onGoalAccepted(acceptedGoal.data.goal);
    } catch (error) {
      toastService.error(error?.response?.data?.msg || 'Failed to accept goal');
    } finally {
      setLoading(null);
    }
  };

  const handleCustomizeGoal = (suggestion) => {
    // TODO: Open customization modal/form
    console.log('Customize goal:', suggestion);
    toastService.success('Customization coming soon!');
    // toastService.info('Customization coming soon!');
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    // toastService.info('You can create goals anytime from the goals page');
    toastService.success('You can create goals anytime from the goals page');
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100',
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const getImpactColor = (impact) => {
    const colors = {
      high: 'text-blue-600 bg-blue-100',
      medium: 'text-purple-600 bg-purple-100',
      low: 'text-gray-600 bg-gray-100',
    };
    return colors[impact] || 'text-gray-600 bg-gray-100';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      transport: '🚗',
      energy: '⚡',
      food: '🥗',
      digital: '💻',
    };
    return emojis[category];
  };

  return (
    <Card className='md:col-span-3'>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-semibold text-green-700'>
            🎉 Tips Unlocked!
          </h3>
          <button
            onClick={handleDismiss}
            className='text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100'
          >
            Maybe Later
          </button>
        </div>

        <p className='text-gray-600 mb-6'>
          Great job logging your activities! Here are personalized Tips
          based on your data:
        </p>

        <div className='grid gap-4 md:grid-cols-2'>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                index === 0
                  ? 'border-green-200 bg-green-50 ring-2 ring-green-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className='flex items-center gap-3 mb-3'>
                <span className='text-2xl'>
                  {getCategoryEmoji(suggestion.category)}
                </span>
                <div>
                  <h4 className='font-semibold text-lg'>{suggestion.title}</h4>
                  <div className='flex gap-2 mt-1'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        suggestion.difficulty
                      )}`}
                    >
                      {suggestion.difficulty}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                        suggestion.impact
                      )}`}
                    >
                      {suggestion.impact} impact
                    </span>
                  </div>
                </div>
              </div>

              <p className='text-gray-700 mb-4 text-sm leading-relaxed'>
                💡 {suggestion.tip}
              </p>

              <div className='bg-white/70 rounded-lg p-3 mb-4 space-y-2 shadow'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Current week total:</span>
                  <span className='font-medium'>
                    {suggestion.currentWeekly} kg CO₂
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Target reduction:</span>
                  <span className='font-medium text-red-600'>
                    -{suggestion.targetReduction} kg CO₂ (
                    {suggestion.reductionPercent}%)
                  </span>
                </div>
                <div className='flex justify-between text-sm border-t pt-2'>
                  <span className='text-gray-600'>New target:</span>
                  <span className='font-semibold text-green-600'>
                    {(
                      suggestion.currentWeekly - suggestion.targetReduction
                    ).toFixed(1)}{' '}
                    kg CO₂
                  </span>
                </div>
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={() => handleAcceptGoal(suggestion)}
                  disabled={loading === suggestion.id}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    index === 0
                      ? 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 hover:cursor-pointer'
                      : 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400 hover:cursor-pointer'
                  } disabled:cursor-not-allowed`}
                >
                  {loading === suggestion.id
                    ? 'Starting...'
                    : 'Start Challenge'}
                </button>
                <button
                  onClick={() => handleCustomizeGoal(suggestion)}
                  className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium hover:cursor-pointer'
                >
                  Customize
                </button>
              </div>

              {index === 0 && (
                <div className='flex items-center gap-1 mt-3 text-xs text-green-600'>
                  <span>⭐</span>
                  <span>Recommended based on your highest emissions</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='mt-6 p-3 bg-blue-50 rounded-lg'>
          <p className='text-sm text-blue-700'>
            💡 <strong>Tip:</strong> You can always create custom goals or
            modify these Tips later from the Goals page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSuggestions;
