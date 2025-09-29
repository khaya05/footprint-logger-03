
const StatItem = ({
  icon,
  label,
  value,
  bgColor = 'bg-gray-50',
  textColor = 'text-gray-600',
}) => (
  <div
    className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}
  >
    <div className='flex items-center gap-3'>
      <div className={`p-2 ${bgColor.replace('50', '100')} rounded-full`}>
        {icon}
      </div>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
    </div>
    <span className={`text-lg font-bold ${textColor}`}>{value}</span>
  </div>
);

export default StatItem