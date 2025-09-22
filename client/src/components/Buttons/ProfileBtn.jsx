import { CgProfile } from 'react-icons/cg';
import { useDashboardContext } from '../../pages/DashboardLayout';
import { Link } from 'react-router-dom';
const ProfileBtn = () => {
  const { user } = useDashboardContext();
  const { name, lastName } = user;
  return (
    <div className='flex items-center justify-between gap-1 bg-green-500 p-2 rounded-sm text-white'>
      <Link
        to='profile'
        className='capitalize hover:underline hover:cursor-pointer'
      >{`${name} ${lastName}`}</Link>
      <CgProfile className='text-[1.5rem]' />
    </div>
  );
};

export default ProfileBtn;
