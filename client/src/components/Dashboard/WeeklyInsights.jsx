
const WeeklyInsights = ({ stats }) => {
  return (
    <div className='p-4 bg-white rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold mb-2'>Weekly Insights</h2>
      <p className='text-gray-700'>{stats.message}</p>
    </div>
  );
};

export default WeeklyInsights;
