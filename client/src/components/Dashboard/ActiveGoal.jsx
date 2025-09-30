import { useState } from 'react';
import Card from './Card';
import CardContent from './CardContent';
import GoalHeader from './GoalHeader';
import GoalTip from './GoalTip';
import GoalStats from './GoalStats';
import ProgressBar from './ProgresBar';
import CustomizeForm from './CustomizeForm';
import ActionButtons from './ActionButtons';
import CompletionMessage from './CompletionMessage';
import { toastService } from '../../util/toastUtil';

const ActiveGoal = ({ goal, onCustomize, onComplete, onDelete }) => {
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [customTarget, setCustomTarget] = useState('');

  const calculateProgress = (achieved, target) => {
    if (!achieved || !target) return 0;
    return Math.min(100, Math.round((achieved / target) * 100));
  };

  if (!goal?.goal) {
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

  const g = goal.goal;
  const progress = calculateProgress(g.achievedReduction, g.targetReduction);
  const isCompleted = g.status === 'completed';

  const handleCustomize = (e) => {
    e.preventDefault();
    if (onCustomize && customTarget) {
      onCustomize(g._id, { targetReduction: parseFloat(customTarget) });
      setShowCustomizeForm(false);
      setCustomTarget('');
    }
  };

  const handleDelete = () => {
    window.scroll(0, 0);
    toastService.error('deleting goal');
    onDelete(g._id);
  };

  return (
    <Card>
      <CardContent>
        <GoalHeader category={g.category} progress={progress} />
        <GoalTip tip={g.tip} />
        <GoalStats achieved={g.achievedReduction} target={g.targetReduction} />
        <ProgressBar progress={progress} />

        {showCustomizeForm && (
          <CustomizeForm
            currentTarget={g.targetReduction}
            value={customTarget}
            onChange={setCustomTarget}
            onSubmit={handleCustomize}
            onCancel={() => setShowCustomizeForm(false)}
          />
        )}

        {!isCompleted && !showCustomizeForm && (
          <ActionButtons
            progress={progress}
            onCustomize={() => setShowCustomizeForm(true)}
            onComplete={() => onComplete(g._id)}
            onDelete={handleDelete}
          />
        )}

        {isCompleted && <CompletionMessage category={g.category} />}
      </CardContent>
    </Card>
  );
};

export default ActiveGoal;
