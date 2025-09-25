const PersonalizedTips = ({ tips }) => {
  return (
    <div className='p-4 bg-white rounded-2xl shadow-md'>
      <h2 className='text-lg font-semibold mb-2'>Personalized Tips</h2>
      <ul className='space-y-2'>
        {tips.map((tip, idx) => (
          <li key={idx} className='p-3 bg-green-50 rounded-md text-sm'>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalizedTips;
