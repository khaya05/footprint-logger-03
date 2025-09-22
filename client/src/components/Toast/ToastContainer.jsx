import Toast from './Toast';
import { useSelector } from 'react-redux';

export const ToastContainer = () => {
  const toasts = useSelector((state) => state.toast?.toasts || []);

  if (toasts.length === 0) return null;

  return (
    <div className='fixed top-4 right-4 z-50 max-w-sm w-full'>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
