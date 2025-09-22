import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '../../features/toast/toastSlice';

const Toast = ({ id, type, message }) => {
  const dispatch = useDispatch();
  const isSuccess = type === 'success';

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const handleClose = () => {
    dispatch(removeToast(id));
  };

  return (
    <div
      className={`flex items-center p-4 mb-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        isSuccess
          ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
          : 'bg-red-50 border-l-4 border-red-500 text-red-800'
      }`}
    >
      {isSuccess ? (
        <svg className='w-5 h-5 mr-3' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      ) : (
        <svg className='w-5 h-5 mr-3' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
            clipRule='evenodd'
          />
        </svg>
      )}

      <p className='text-sm font-medium flex-1'>{message}</p>

      <button
        onClick={handleClose}
        className='ml-4 text-gray-400 hover:text-gray-600 focus:outline-none'
      >
        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
