import { useState, useEffect } from 'react';
import Card from './Card';
import CardContent from './CardContent';
import customFetch from '../../util/customFetch';
import { CiMedal, CiTrophy } from 'react-icons/ci';
import { FaAward } from 'react-icons/fa';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, _] = useState('all-time');
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    fetchMyRank();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get(`/leaderboard/${period}`);
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const { data } = await customFetch.get(
        `/leaderboard/my-rank?period=${period}`
      );
      setMyRank(data.rank);
    } catch (error) {
      console.error('Failed to fetch rank:', error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <CiTrophy className='text-yellow-500 w-5 h-5' />;
    if (rank === 2) return <FaAward className='text-gray-400 w-5 h-5' />;
    if (rank === 3) return <CiMedal className='text-orange-500 w-5 h-5' />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600 font-bold';
    if (rank === 2) return 'text-gray-600 font-semibold';
    if (rank === 3) return 'text-orange-600 font-semibold';
    return 'text-gray-800';
  };

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Leaderboard</h3>
          {myRank && (
            <div className='text-sm text-gray-600'>
              Your rank:{' '}
              <span className='font-bold text-green-600'>#{myRank}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className='text-center py-8 text-gray-500'>Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No data available yet
          </div>
        ) : (
          <ul className='space-y-2'>
            {leaderboard.map((user) => (
              <li
                key={user.userId}
                className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${
                  user.rank <= 3 ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-8'>
                    {getRankIcon(user.rank) || (
                      <span className='text-gray-600 font-medium'>
                        {user.rank}
                      </span>
                    )}
                  </div>
                  <span className={getRankColor(user.rank)}>{user.name}</span>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-gray-800'>
                    {user.weeklyEmissions ||
                      user.monthlyEmissions ||
                      user.totalEmissions}{' '}
                    kg
                  </div>
                  <div className='text-xs text-gray-500'>
                    {user.activitiesCount} activities
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderBoard;
