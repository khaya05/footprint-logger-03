import { useState } from 'react';
import customFetch from '../../util/customFetch.js';
import { toastService } from '../../util/toastUtil.js';
import Card from './Card.jsx';
import CardContent from './CardContent.jsx';
import SuggestionHeader from './SuggestionHeader.jsx';
import SuggestionCard from './SuggestionCard.jsx';

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
      const acceptedResponse = await customFetch.patch(
        `/goals/${data.goal._id}/accept`
      );
      
      toastService.success(`${suggestion.title} accepted!`);

      if (onGoalAccepted) {
        onGoalAccepted(acceptedResponse.data);
      }
    } catch (error) {
      toastService.error(error?.response?.data?.msg || 'Failed to accept goal');
    } finally {
      setLoading(null);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
  };

  return (
    <Card className='md:col-span-3'>
      <CardContent>
        <SuggestionHeader onDismiss={handleDismiss} />

        <p className='text-gray-600 mb-6'>
          Great job logging your activities! Here are personalized Tips based on
          activities with highest emissions:
        </p>

        <div className='grid gap-4 md:grid-cols-2'>
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              isRecommended={index === 0}
              onAccept={handleAcceptGoal}
              loading={loading}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSuggestions;
