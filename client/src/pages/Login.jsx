import { Logo, FormInputElement } from '../components';
import customFetch from '../util/customFetch';
import { redirect, useNavigation, Form, Link } from 'react-router-dom';
import { toastService } from '../util/toastUtil';

export const LoginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/login', data);
    toastService.success('Logged in successfully');
    return redirect('/dashboard');
  } catch (error) {
    toastService.error(error?.response?.data?.msg || 'Login failed.');
    return { error: error?.response?.data?.msg };
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className='center-form'>
      <div className='form-wrapper'>
        <Logo />
        <h2>Login</h2>
        <Form method='post' className='w-full'>
          <FormInputElement
            name='email'
            placeholder='e.g tommy@email.com'
            defaultValue='tommy@email.com'
          />
          <FormInputElement
            name='password'
            type='password'
            placeholder='password here'
            defaultValue='pass1234'
          />
          <button type='submit' className='green-btn' disabled={isSubmitting}>
            {isSubmitting ? 'submitting' : 'submit'}
          </button>
        </Form>

        <p className='text-sm'>
          Not a member yet?{' '}
          <Link to='/register' className='text-green-500 hover:text-green-600'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
