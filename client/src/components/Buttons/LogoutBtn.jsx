import { useNavigate } from 'react-router-dom';
import customFetch from '../../util/customFetch';
import { toastService } from '../../util/toastUtil';

const LogoutBtn = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    navigate('/login');
    await customFetch('/auth/logout');
    toastService.success('Logged out!');
  };

  return (
    <button
      to='/login'
      className='green-btn w-full px-4 bg-gray-400 hover:bg-green-500 text-center'
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
