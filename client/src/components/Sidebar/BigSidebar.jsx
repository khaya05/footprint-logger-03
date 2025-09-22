import { Logo, LogoutBtn, SidebarPages } from '..';
import { useDashboardContext } from '../../pages/DashboardLayout';
import { FaEyeSlash } from 'react-icons/fa';

const BigSidebar = () => {
  const { setShowSidebar } = useDashboardContext();
  return (
    <aside className='hidden bg-white w-[300px] absolute top-0 h-[100vh] border-r border-gray-200 p-6 md:fixed md:flex md:flex-col items-start justify-between'>
      <div className='w-full'>
        <Logo />
        <br />
        <br />
        <SidebarPages />
      </div>
      <div className='w-full md:flex md:flex-col items-center'>
        <LogoutBtn />
        <button
          type='button'
          className='flex items-center gap-2 text-center hover:cursor-pointer mt-4 bg-green-100 p-2 px-4 rounded-sm hover:shadow'
          onClick={() => setShowSidebar(false)}
        >
          <FaEyeSlash /> <span className='capitalize'>hide sidebar</span>
        </button>
      </div>
    </aside>
  );
};

export default BigSidebar;
