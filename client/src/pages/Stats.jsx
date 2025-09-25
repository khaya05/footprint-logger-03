/* eslint-disable react-refresh/only-export-components */
import {
  BarGraph,
  LeaderBoard,
  NoActivities,
  PersonalizedTips,
  RecentActivities,
  SummaryCard,
  TipCard,
  WeeklyGoal,
  WeeklyInsights,
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
    return { stats, recent, goalData };
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Failed to fetch data.');
    return { error: error?.response?.data?.msg };
  }
};

// achievedReduction

const Dashboard = () => {
  const { stats, recent, goalData } = useLoaderData();
  const { user: currentUser } = useDashboardContext();

  const [leaderboard, setLeaderboard] = useState([]);
  const [goal, setGoal] = useState(goalData?.goal || null);

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

  // useEffect(() => {
  //   const fetchGoal = async () => {
  //     try {
  //       const res = await customFetch('/goals/weekly');
  //       const data = await res.json();
  //       setGoal(data);
  //     } catch (err) {
  //       console.error('Error fetching goal:', err);
  //     }
  //   };

  //   fetchGoal();
  // }, []);

  console.log(goalData);

  useEffect(() => {
    if (!currentUser) return;

    socket.on('goalUpdate', (data) => {
      if (data.goal && data.user === currentUser._id) {
        setGoal(data.goal);
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
      socket.off('goalUpdate');
      socket.off('goalCompleted');
      socket.off('goalDismissed');
      socket.off('newWeeklyGoal');
      socket.off('leaderboardUpdate');
    };
  }, [currentUser]);

  if (recent?.activities.length > 0) {
    return (
      <div className='space-y-6'>
        {goalData.tip && <TipCard goal={goalData} onAccepted={setGoal} />}
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
          <WeeklyGoal goal={goalData} />
          <WeeklyInsights stats={stats} />
        </div>
        {/* <PersonalizedTips  /> */}
        <RecentActivities recent={recent} />
      </div>
    );
  } else {
    return <NoActivities />;
  }
};

export default Dashboard;
