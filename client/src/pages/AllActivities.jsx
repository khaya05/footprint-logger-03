/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { ActivityCard, NoActivities, SearchActivity } from '../components';
import customFetch from '../util/customFetch';
import { toastService } from '../util/toastUtil';
import { createContext, useContext } from 'react';
import Pagination from '@mui/material/Pagination';

const ActivitiesContext = createContext();

export const activitiesLoader = async ({ request }) => {
  try {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const { data } = await customFetch('/activities', {
      params,
    });

    return { data, searchValues: { ...params } };
  } catch (error) {
    toastService.error(
      error?.response?.data?.msg || 'Failed to fetch activities'
    );
  }
};

const AllActivities = () => {
  const { data, searchValues } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = Number(searchValues.page) || 1;

  const handlePageChange = (_, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (data?.activities?.length > 0) {
    return (
      <ActivitiesContext.Provider value={{ data, searchValues }}>
        <SearchActivity />

        <p className='m-4 text-xl font-bold'>
          Activities ({data?.activities?.length})
        </p>
        <div className='flex flex-col md:grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4 mb-4'>
          {data.activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>

        {data?.totalActivities > 12 && (
          <Pagination
            count={data.pages}
            page={currentPage}
            onChange={handlePageChange}
            color='green'
          />
        )}
      </ActivitiesContext.Provider>
    );
  } else {
    return <NoActivities />;
  }
};

export const useActivityContext = () => useContext(ActivitiesContext);

export default AllActivities;
