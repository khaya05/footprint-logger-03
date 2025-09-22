/* eslint-disable react-refresh/only-export-components */
import { Logo, FormInputElement } from '../components';
import customFetch from '../util/customFetch';
import { redirect, useNavigation, Form, Link } from 'react-router-dom';
import { toastService } from '../util/toastUtil';

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { password, passwordConfirm } = data;

  if (password !== passwordConfirm) {
    return toastService.error("Passwords don't match");
  }

  try {
    await customFetch.post('/auth/register', data);
    toastService.success('Registration successful! Please login');
    return redirect('/login');
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Registration failed.');
    return { error: error?.response?.data?.msg };
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className='grid place-items-center h-[100vh]'>
      <div className='form-wrapper'>
        <Logo />
        <h2>Register</h2>
        <Form method='post' className='w-full'>
          <FormInputElement name='name' placeholder='e.g Tommy' required />
          <FormInputElement
            name='lastName'
            label='last name'
            placeholder='e.g smith'
            required
          />
          <FormInputElement
            name='email'
            placeholder='e.g tommy@email.com'
            required
          />
          <FormInputElement
            name='password'
            type='password'
            placeholder='password'
            required
          />
          <FormInputElement
            name='passwordConfirm'
            label='confirm password'
            type='password'
            placeholder='confirm password'
            required
          />
          <button type='submit' className='green-btn' disabled={isSubmitting}>
            {isSubmitting ? 'submitting' : 'submit'}
          </button>
        </Form>

        <p className='text-sm'>
          Already a member?{' '}
          <Link to='/login' className='text-green-500 hover:text-green-600'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
