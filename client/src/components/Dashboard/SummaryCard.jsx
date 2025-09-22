import Card from './Card';
import CardContent from './CardContent';

const SummaryCard = ({ value, label, icon }) => {
  return (
    <Card>
      <CardContent className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-500'>{label}</p>
          <h2 className='text-xl font-semibold'>{value.toFixed(2)} kg CO₂</h2>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
