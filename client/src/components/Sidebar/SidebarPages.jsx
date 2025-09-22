import { Link } from 'react-router-dom';
import { useDashboardContext } from '../../pages/DashboardLayout';
import { CgProfile } from 'react-icons/cg';
import { FaChartBar, FaList, FaRegCalendarPlus } from 'react-icons/fa';

const sidebarPages = [
  {
    page: 'Dashboard',
    icon: <FaChartBar />,
    path: '/dashboard',
  },
  {
    page: 'Activities',
    icon: <FaList />,
    path: 'activities',
  },
  {
    page: 'Add Activity',
    icon: <FaRegCalendarPlus />,
    path: 'add-activity',
  },
  {
    page: 'Profile',
    icon: <CgProfile />,
    path: 'profile',
  },
];

const SmallSidebar = () => {
  const { setCurrentTab, setShowModal, currentTab } = useDashboardContext();

  const handlePageClick = (e) => {
    const page = e.currentTarget.getAttribute('data-page');
    setCurrentTab(page);
    setShowModal(false);
  };

  return (
    <div className='rounded-sm py-4'>
      {sidebarPages.map(({ path, icon, page }) => {
        return (
          <Link to={path} key={page} onClick={handlePageClick} data-page={page}>
            <div
              className={`flex justify-start items-center gap-4 h-10 px-4 w-[80%] rounded-l-sm rounded-r-full  hover:bg-gray-300 hover:text-green-60 ${
                currentTab === page && 'bg-green-500 text-white'
              }`}
            >
              {icon}
              <p>{page}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SmallSidebar;
