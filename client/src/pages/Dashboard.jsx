/* eslint-disable react-refresh/only-export-components */
import {
  BarGraph,
  LeaderBoard,
  NoActivities,
  RecentActivities,
  SummaryCard,
  ActiveGoal,
  WeeklyInsights,
  GoalSuggestions,
  LogProgress,
} from '../components';
import { FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import customFetch from '../util/customFetch';
import { toastService } from '../util/toastUtil';
import { useLoaderData } from 'react-router-dom';
import dayjs from 'dayjs';
import { useState } from 'react';

export const dashboardLoaderStats = async () => {
  try {
    const { data: stats } = await customFetch('/activities/stats');
    const { data: recent } = await customFetch('/activities?sort=newest');
    const { data: goalData } = await customFetch('/goals');

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

  const [goal, setGoal] = useState(goalData || null);
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

  const getWeeklyChartData = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = dayjs(date).format('YYYY-MM-DD');

      days.push({
        date: dayjs(date).format('MMM DD'),
        emissions: dailyTotals[dateStr] || 0,
      });
    }

    return days;
  };

  const chartData = getWeeklyChartData();

  const handleGoalAccepted = (acceptedGoalData) => {
    setGoal(acceptedGoalData);
    setGoalSuggestions(null);
    setGoalProgress(null);
    toastService.success("Goal accepted");
  };

  const handleSuggestionsDismiss = () => {
    setGoalSuggestions(null);
    toastService.success('Goal dismissed!');
  };

  const handleCustomizeGoal = async (goalId, customizations) => {
    try {
      const { data } = await customFetch.patch(
        `/goals/${goalId}/customize`,
        customizations
      );

      setGoal(data);
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

      setGoal(data);
      toastService.success('Goal completed! 🎉');

      setTimeout(() => {
        setGoal(null);
      }, 2000);
    } catch (error) {
      toastService.error(
        error?.response?.data?.msg || 'Failed to complete goal'
      );
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await customFetch.delete(`/goals/${goalId}/dismiss`);

      setGoal(null);
      toastService.success('Goal deleted successfully');

      try {
        const { data: suggestions } = await customFetch('/goals/suggestions');
        if (suggestions?.suggestions) {
          setGoalSuggestions(suggestions.suggestions);
          setGoalProgress(suggestions.progress);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      toastService.error(error?.response?.data?.msg || 'Failed to delete goal');
    }
  };

  if (recent?.activities.length > 0) {
    return (
      <div className='space-y-6'>
        {goalSuggestions && !goal?.goal && (
          <GoalSuggestions
            suggestions={goalSuggestions}
            onGoalAccepted={handleGoalAccepted}
            onDismiss={handleSuggestionsDismiss}
          />
        )}

        {goalProgress && !goal?.goal && !goalSuggestions && (
          <LogProgress goalProgress={goalProgress} />
        )}

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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          <ActiveGoal
            goal={goal}
            onCustomize={handleCustomizeGoal}
            onComplete={handleCompleteGoal}
            onDelete={handleDeleteGoal}
          />
          <WeeklyInsights stats={stats} recent={recent} goal={goal} />
        </div>

        <RecentActivities recent={recent} />
      </div>
    );
  } else {
    return <NoActivities />;
  }
};

export default Dashboard;
