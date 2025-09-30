import SuggestionStats from './SuggestionStats';
import SuggestionActions from './SuggestionActions';
import { getCategoryEmoji } from '../../util/emissionFactors';

const SuggestionCard = ({ suggestion, isRecommended, onAccept, loading }) => {
  return (
    <div
      className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
        isRecommended
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
        </div>
      </div>

      <p className='text-gray-700 mb-4 text-sm leading-relaxed'>
        💡 {suggestion.tip}
      </p>

      <SuggestionStats suggestion={suggestion} />

      <SuggestionActions
        suggestion={suggestion}
        isRecommended={isRecommended}
        onAccept={onAccept}
        loading={loading}
      />
    </div>
  );
};

export default SuggestionCard;
