const WeeklyGoal = ({ goal }) => {
  const progress = (goal.achievedReduction / goal.targetReduction) * 100;

  if (goal) {
    return (
      <div className='p-4 bg-white rounded-2xl shadow-md'>
        <h2 className='text-lg font-semibold mb-2'>Weekly Goal</h2>
        <p className='text-gray-700 mb-2'>
          {goal.category} — {goal.achievedReduction} / {goal.targetReduction} kg
          CO₂ saved
        </p>
        <div className='w-full bg-gray-200 rounded-full h-3'>
          <div
            className='bg-green-500 h-3 rounded-full w-full'
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className='flex gap-2 mt-2'>
          <button
            className='bg-blue-100 text-blue-500 ring-blue-500 p-2 rounded-sm'
            onClick={() => console.log('Customize goal')}
          >
            Customize
          </button>
          <button
            className='bg-green-500 text-white p-2 rounded-sm'
            onClick={() => console.log('Complete goal')}
          >
            Mark as Completed
          </button>
        </div>
      </div>
    );
  } else {
    return <p>No goals set yet</p>;
  }
};

export default WeeklyGoal;
