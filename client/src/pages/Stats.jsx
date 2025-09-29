/* eslint-disable react-refresh/only-export-components */
import {
  BarGraph,
  LeaderBoard,
  NoActivities,
  PersonalizedTips,
  RecentActivities,
  SummaryCard,
  TipCard,
  ActiveGoal,
  WeeklyInsights,
  GoalSuggestions,
} from '../components';
import { FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import customFetch from '../util/customFetch';
import { toastService } from '../util/toastUtil';
import { useLoaderData } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import socket from '../util/socket';
import { useDashboardContext } from './DashboardLayout';
import { useState } from 'react';

export const dashboardLoaderStats = async () => {
  try {
    const { data: stats } = await customFetch('/activities/stats');
    const { data: recent } = await customFetch('/activities?sort=newest');
    const { data: goalData } = await customFetch('/goals/weekly');

    let goalSuggestions = null;
    if (!goalData?.goal) {
      try {
        const { data: suggestions } = await customFetch('/goals/suggestions');
        goalSuggestions = suggestions;
      } catch (error) {
        console.log('No goal suggestions available');
        console.error(error);
      }
    }

    return { stats, recent, goalData, goalSuggestions };
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Failed to fetch data.');
    return { error: error?.response?.data?.msg };
  }
};

const Dashboard = () => {
  const {
    stats,
    recent,
    goalData,
    goalSuggestions: initialSuggestions,
  } = useLoaderData();
  const { user: currentUser } = useDashboardContext();

  const [leaderboard, setLeaderboard] = useState([]);
  const [goal, setGoal] = useState(goalData?.goal || null);
  const [goalSuggestions, setGoalSuggestions] = useState(
    initialSuggestions?.suggestions || null
  );
  const [goalProgress, setGoalProgress] = useState(
    initialSuggestions?.progress || null
  );

  const dailyTotals = recent?.activities.reduce((acc, curr) => {
    const day = dayjs(curr.date).format('YYYY-MM-DD');
    acc[day] = (acc[day] || 0) + curr.emissions;
    return acc;
  }, {});

  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      emissions: total,
    }))
    .slice(0, 7);

  useEffect(() => {
    if (!currentUser) return;

    socket.on('goalSuggestionsAvailable', (data) => {
      if (data.userId === currentUser._id && data.suggestions) {
        setGoalSuggestions(data.suggestions);
        setGoalProgress(null);
      }
    });

    socket.on('goalProgressUpdate', (data) => {
      if (data.userId === currentUser._id) {
        setGoalProgress(data.progress);
        setGoalSuggestions(null);
      }
    });

    socket.on('goalUpdate', (data) => {
      if (data.goal && data.user === currentUser._id) {
        setGoal(data.goal);
        setGoalSuggestions(null);
        setGoalProgress(null);
        toastService.success(data.message || 'Goal updated!');
      }
    });

    socket.on('goalCompleted', (data) => {
      if (data.user === currentUser._id) {
        setGoal(null);
        toastService.success(data.message || 'Goal Completed! 🎊');
      }
    });

    socket.on('goalDismissed', (data) => {
      if (data.user === currentUser._id) {
        setGoal(null);
        toastService.error(data.message || 'Goal dismissed');
      }
    });

    socket.on('newWeeklyGoal', (data) => {
      if (data.user === currentUser._id) {
        setGoal(data.goal);
        toastService.success(data.message || 'New goal generated!');
      }
    });

    socket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data.leaderboard);
    });

    return () => {
      socket.off('goalSuggestionsAvailable');
      socket.off('goalProgressUpdate');
      socket.off('goalUpdate');
      socket.off('goalCompleted');
      socket.off('goalDismissed');
      socket.off('newWeeklyGoal');
      socket.off('leaderboardUpdate');
    };
  }, [currentUser]);

  const handleGoalAccepted = (acceptedGoal) => {
    console.log('Goal accepted:', acceptedGoal);
    setGoal(acceptedGoal);
    setGoalSuggestions(null);
    setGoalProgress(null);
    toastService.success('Goal accepted! Start tracking your progress!');
  };

  const handleSuggestionsDismiss = () => {
    setGoalSuggestions(null);
  };

  const handleCustomizeGoal = async (goalId, customizations) => {
    try {
      const { data } = await customFetch.patch(
        `/goals/${goalId}/customize`,
        customizations
      );
      setGoal(data.goal);
      toastService.success('Goal customized successfully!');
    } catch (error) {
      toastService.error(
        error?.response?.data?.msg || 'Failed to customize goal'
      );
    }
  };

  const handleCompleteGoal = async (goalId) => {
    try {
      const { data } = await customFetch.patch(`/goals/${goalId}/complete`);
      setGoal(null);
      toastService.success('Congratulations! Goal completed! 🎉');
    } catch (error) {
      toastService.error(
        error?.response?.data?.msg || 'Failed to complete goal'
      );
    }
  };

  console.log('Current goal state:', goal);
  console.log('Goal progress:', goalProgress);

  if (recent?.activities.length > 0) {
    return (
      <div className='space-y-6'>
        {goalSuggestions && !goal && (
          <GoalSuggestions
            suggestions={goalSuggestions}
            onGoalAccepted={handleGoalAccepted}
            onDismiss={handleSuggestionsDismiss}
          />
        )}

        {goalProgress && !goal && !goalSuggestions && (
          <div className='p-4 bg-blue-50 border border-blue-200 rounded-xl'>
            <div className='flex items-center gap-3'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-blue-600 text-sm font-semibold'>
                    {Math.round(
                      ((Math.min(goalProgress.activitiesCount / 5, 1) +
                        Math.min(goalProgress.totalEmissions / 20, 1)) /
                        2) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className='flex-1'>
                <p className='text-blue-800 font-medium'>
                  Keep logging! Need {5 - goalProgress.activitiesCount} more
                  activities and {Math.ceil(20 - goalProgress.totalEmissions)}{' '}
                  more kg CO₂ to unlock challenges.
                </p>
                <div className='mt-2 flex gap-4 text-sm text-blue-600'>
                  <span>📊 {goalProgress.activitiesCount}/5 activities</span>
                  <span>
                    📈 {Math.round(goalProgress.totalEmissions * 10) / 10}/20 kg
                    CO₂
                  </span>
                  {goalProgress.categoriesUsed && (
                    <span>🏷️ {goalProgress.categoriesUsed} categories</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show existing tip card for pending goals (from loader) */}
        {/* {goalData?.tip && !goal && (
          <TipCard goal={goalData} onAccepted={setGoal} />
        )} */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <SummaryCard
            value={stats.userStats.totalEmissions}
            label='Total Emissions'
            icon={<FaLeaf className='text-2xl text-green-500' />}
          />

          <SummaryCard
            value={stats.monthlySummary.totalEmissions}
            label='Your Monthly Emissions'
            icon={<FiCalendar className='text-2xl text-orange-500' />}
          />

          <SummaryCard
            value={stats.monthlySummary.avgEmission}
            label='Your Monthly Avg'
            icon={<FiCalendar className='text-2xl text-orange-500' />}
          />

          <SummaryCard
            value={stats.weeklySummary.totalEmissions}
            label='Your Weekly Emissions'
            icon={<FiTrendingUp className='text-2xl text-blue-500' />}
          />

          <SummaryCard
            value={stats.weeklySummary.avgEmission}
            label='Your Weekly Avg'
            icon={<FiTrendingUp className='text-2xl text-blue-500' />}
          />

          <SummaryCard
            value={stats.communityAvg}
            label='Community Avg'
            icon={<FiUsers className='text-2xl text-purple-500' />}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <BarGraph data={chartData} />
          <LeaderBoard data={leaderboard} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          <ActiveGoal
            goal={goal || goalData}
            onCustomize={handleCustomizeGoal}
            onComplete={handleCompleteGoal}
          />
          <WeeklyInsights
            stats={stats}
            recent={recent}
            goal={goal || goalData}
          />
        </div>

        <RecentActivities recent={recent} />
      </div>
    );
  } else {
    return <NoActivities />;
  }
};

export default Dashboard;
