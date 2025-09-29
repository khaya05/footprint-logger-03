import Card from './Card';
import CardContent from './CardContent';
import { FaCar, FaUtensils, FaLaptop } from 'react-icons/fa';
import { FiZap, FiActivity } from 'react-icons/fi';
import { BsBarChartFill } from 'react-icons/bs';
import StatItem from './StatItem';
import Section from './Section';
import CategoryItem from './CategoryItem';

const WeeklyInsights = ({ stats, recent }) => {
  const getTopCategory = () => {
    if (!stats?.categories) return null;

    let topCategory = { name: null, total: 0 };
    Object.entries(stats.categories).forEach(([name, data]) => {
      if (data.total > topCategory.total) {
        topCategory = { name, total: data.total };
      }
    });

    return topCategory.name ? topCategory : null;
  };

  const getWeeklyCategories = () => {
    if (!recent?.activities) return {};

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyActivities = recent.activities.filter(
      (activity) => new Date(activity.date) >= weekAgo
    );

    const weeklyCategories = {};
    weeklyActivities.forEach((activity) => {
      if (!weeklyCategories[activity.category]) {
        weeklyCategories[activity.category] = { total: 0, count: 0 };
      }
      weeklyCategories[activity.category].total += activity.emissions || 0;
      weeklyCategories[activity.category].count += 1;
    });

    return weeklyCategories;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: <FaCar className='w-4 h-4 text-blue-600' />,
      energy: <FiZap className='w-4 h-4 text-yellow-500' />,
      food: <FaUtensils className='w-4 h-4 text-green-600' />,
      digital: <FaLaptop className='w-4 h-4 text-purple-600' />,
    };
    return icons[category] || <BsBarChartFill className='w-4 h-4 text-gray-600' />;
  };

  const topCategory = getTopCategory();
  const weeklyCategories = getWeeklyCategories();
  const hasWeeklyCategories = Object.keys(weeklyCategories).length > 0;

  return (
    <Card>
      <CardContent>
        <h2 className='text-lg font-semibold mb-4'>Weekly Summary</h2>

        <div className='space-y-4'>
          <StatItem
            icon={<BsBarChartFill className='w-4 h-4 text-blue-600' />}
            label='Total Emissions'
            value={`${
              stats?.weeklySummary?.totalEmissions?.toFixed(1) || '0.0'
            } kg CO₂`}
            bgColor='bg-blue-50'
            textColor='text-blue-600'
          />

          <StatItem
            icon={<FiActivity className='w-4 h-4 text-green-600' />}
            label='Activities Logged'
            value={stats?.weeklySummary?.count || 0}
            bgColor='bg-green-50'
            textColor='text-green-600'
          />

          {topCategory && (
            <StatItem
              icon={getCategoryIcon(topCategory.name)}
              label={`Highest Overall: ${topCategory.name}`}
              value={`${topCategory.total.toFixed(1)} kg CO₂`}
              bgColor='bg-orange-50'
              textColor='text-orange-600'
            />
          )}

          <Section title="This Week's Emissions by Category">
            <div className='space-y-2'>
              {hasWeeklyCategories ? (
                Object.entries(weeklyCategories)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([category, data]) => (
                    <CategoryItem
                      key={category}
                      category={category}
                      data={data}
                      getCategoryIcon={getCategoryIcon}
                    />
                  ))
              ) : (
                <div className='text-center py-4 text-gray-500 text-sm'>
                  No activities logged this week
                </div>
              )}
            </div>
          </Section>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyInsights;
