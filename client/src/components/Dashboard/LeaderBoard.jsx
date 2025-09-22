import Card from './Card';
import CardContent from './CardContent';

const LeaderBoard = () => {
  const fakeLeaderboard = [
    { id: 1, name: 'Alice', avg: 22 },
    { id: 2, name: 'Bob', avg: 25 },
    { id: 3, name: 'Lerato', avg: 27 },
    { id: 4, name: 'Zama', avg: 29 },
    { id: 5, name: 'Luke', avg: 31 },
  ];

  return (
    <Card>
      <CardContent>
        <h3 className='text-lg font-semibold mb-4'>Leaderboard</h3>
        <ul className='space-y-2'>
          {fakeLeaderboard.map((user, idx) => (
            <li key={user.id} className='flex justify-between text-sm'>
              <span>
                {idx + 1}. {user.name}
              </span>
              <span className='text-gray-600'>{user.avg} kg</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LeaderBoard;
