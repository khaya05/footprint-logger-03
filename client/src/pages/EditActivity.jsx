/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ActivityForm } from '../components';
import customFetch from '../util/customFetch';
import { toastService } from '../util/toastUtil';
import { useDashboardContext } from './DashboardLayout';

export const editActivityLoader = async ({ params }) => {
  try {
    const { data } = await customFetch(`/activities/${params.id}`);
    return data;
  } catch (error) {
    toastService.error(
      error?.response?.data?.msg || 'failed to fetch activity.'
    );
    return { error: error?.response?.data?.msg };
  }
};

const EditActivity = () => {
  const { activity } = useLoaderData();
  const { setCurrentTab } = useDashboardContext();

  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard/activities');
    setCurrentTab('Activities');
  };

  return (
    <ActivityForm
      isEdit={true}
      initialData={activity}
      activityId={activity._id}
      onSuccess={handleSuccess}
    />
  );
};

export default EditActivity;
