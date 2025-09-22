import { useDashboardContext } from '../../pages/DashboardLayout';
import Card from './Card';
import CardContent from './CardContent';
import { Link } from 'react-router-dom';

const RecentActivities = ({ recent }) => {
  const { setCurrentTab } = useDashboardContext();
  return (
    <Card>
      <CardContent>
        <div className='w-full flex justify-between items-center'>
          <h3 className='text-lg font-semibold mb-4'>Your Recent Activities</h3>
          <Link
            to='add-activity'
            className='bg-gray-200 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-green-500 hover:text-white transition-all'
          >
            + Add Activity
          </Link>
        </div>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='text-left py-2'>Date</th>
              <th className='text-left'>Activity</th>
              <th className='text-left'>Category</th>
              <th className='text-right'>Emissions (kg)</th>
            </tr>
          </thead>
          <tbody>
            {recent.activities.slice(0, 5).map((log) => (
              <tr key={log._id} className='border-b'>
                <td className='py-2'>{log.date.split('T')[0]}</td>
                <td>{log.activity}</td>
                <td className='capitalize'>{log.category}</td>
                <td className='text-right'>{log.emissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link
          className='my-4 mx-auto text-green-500'
          to='activities'
          onClick={() => setCurrentTab('Activities')}
        >
          See all activities
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
