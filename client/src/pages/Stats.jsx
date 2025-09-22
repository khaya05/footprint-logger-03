/* eslint-disable react-refresh/only-export-components */
import {
  BarGraph,
  LeaderBoard,
  NoActivities,
  RecentActivities,
  SummaryCard,
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
    return { stats, recent };
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Failed to fetch data.');
    return { error: error?.response?.data?.msg };
  }
};

const Dashboard = () => {
  const { stats, recent } = useLoaderData();
  const { user: currentUser } = useDashboardContext();

  const dailyTotals = recent.activities.reduce((acc, curr) => {
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

  const [goal, setGoal] = useState(null);
  useEffect(() => {
    socket.on('goal:update', (data) => {
      if (data.user === currentUser._id) {
        setGoal(data.goal);
      }
    });

    return () => socket.off('goal:update');
  }, [currentUser]);

  if (recent?.activities.length > 0) {
    return (
      <div className='space-y-6'>
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
          <LeaderBoard />
        </div>
        <RecentActivities recent={recent} />
      </div>
    );
  } else {
    return <NoActivities />;
  }
};

export default Dashboard;
