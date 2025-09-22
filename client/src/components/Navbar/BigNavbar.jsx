import { useDashboardContext } from '../../pages/DashboardLayout';
import { ProfileBtn, Logo } from '..';

const BigNavbar = () => {
  const { currentTab, showSidebar } = useDashboardContext();
  return (
    <nav
      className={`hidden h-20 border-b border-gray-200 md:flex bg-white transition-all duration-300 ${
        showSidebar ? 'translate-x-[300px] w-[calc(100%-300px)]' : 'w-full'
      }`}
    >
      {!showSidebar && (
        <div className='p-4'>
          <Logo />
        </div>
      )}
      <div
        className={`flex items-center justify-between ${
          !showSidebar && 'border-l border-gray-200'
        } w-full p-4`}
      >
        <h3 className='md:text-[2rem]'>{currentTab || 'Stats'}</h3>
        <ProfileBtn />
      </div>
    </nav>
  );
};

export default BigNavbar;
