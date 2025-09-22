import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  AddActivity,
  AllActivities,
  DashboardLayout,
  EditActivity,
  HomeLayout,
  Landing,
  Login,
  Profile,
  Register,
  Stats,
} from './pages';
import { registerAction } from './pages/Register';
import { store } from './store';
import { Provider } from 'react-redux';
import { ToastServiceConnector } from './components/Toast/ToastServiceConnector';
import ToastContainer from './components/Toast/ToastContainer';
import { LoginAction } from './pages/Login';
import { dashboardLoader } from './pages/DashboardLayout';
import { updateProfileAction, updateProfileLoader } from './pages/Profile';
import { activitiesLoader } from './pages/AllActivities';
import { editActivityLoader } from './pages/EditActivity';
import { dashboardLoaderStats } from './pages/Stats';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '/register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: '/Login',
        element: <Login />,
        action: LoginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <Stats />,
            loader: dashboardLoaderStats,
          },
          {
            path: 'activities',
            element: <AllActivities />,
            loader: activitiesLoader,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: updateProfileAction,
            loader: updateProfileLoader
          },
          {
            path: 'add-activity',
            element: <AddActivity />,
          },
          {
            path: 'edit-activity/:id',
            element: <EditActivity />,
            loader: editActivityLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <ToastServiceConnector />
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
};

export default App;
