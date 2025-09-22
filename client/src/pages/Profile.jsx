/* eslint-disable react-refresh/only-export-components */
import { Form, redirect, useLoaderData, useNavigation } from 'react-router-dom';
import { FormInputElement } from '../components';
import customFetch from '../util/customFetch';
import { toastService } from '../util/toastUtil';

export const updateProfileAction = async ({ request }) => {
  const formData = await request.formData();
  const newValues = Object.fromEntries(formData);
  const { data } = await customFetch.get('/users/current-user');

  const currentUser = data.user;
  const hasChanges = Object.keys(newValues).some(
    (key) => newValues[key] !== currentUser[key]
  );

  if (!hasChanges) {
    toastService.success('No changes made!');
    return redirect('/dashboard');
  }

  try {
    await customFetch.post('/users/update-user', newValues);
    toastService.success('Profile updated!');
    return redirect('/dashboard');
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Update failed.');
    return { error: error?.response?.data?.msg };
  }
};

export const updateProfileLoader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return { data };
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Update failed.');
    return { error: error?.response?.data?.msg };
  }
};

const Profile = () => {
  const { data } = useLoaderData();
  const { name, lastName, email } = data.user;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className='outlet'>
      <Form method='post'>
        <h4 className='text-xl font-semibold text-gray-900 capitalize'>
          Profile
        </h4>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          <FormInputElement
            name='name'
            label='first name'
            value='Tommy'
            defaultValue={name}
          />
          <FormInputElement
            name='lastName'
            label='Last name'
            value='marshal'
            defaultValue={lastName}
          />
          <FormInputElement
            name='email'
            value='tommy@email.com'
            defaultValue={email}
          />
        </div>
        <button type='submit' className='green-btn' disabled={isSubmitting}>
          {isSubmitting ? 'updating' : 'update'}
        </button>
      </Form>
    </div>
  );
};

export default Profile;
