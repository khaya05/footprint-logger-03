import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from '../../pages/DashboardLayout';
import customFetch from '../../util/customFetch';
import { toastService } from '../../util/toastUtil';

const DeleteConfirmation = () => {
  const { setShowConfirmDelete, deleteId, setDeleteId, setCurrentTab } =
    useDashboardContext();
  const navigate = useNavigate();

  const onConfirm = async () => {
    try {
      await customFetch.delete(`/activities/${deleteId}`);
      toastService.success('Activity deleted');
      onCancel();
      navigate('/dashboard');
    } catch (error) {
      toastService.error(
        error?.response?.data?.msg || 'Failed to delete activity'
      );
    }
  };

  function onCancel() {
    setShowConfirmDelete(false);
    setDeleteId('');
    setCurrentTab('Dashboard');
  }

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      <div
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        onClick={onCancel}
      ></div>

      <div className='flex items-center justify-center min-h-full p-4'>
        <div className='relative bg-white rounded-xl p-6 w-full max-w-md mx-auto shadow-2xl transform transition-all'>
          <h4 className='text-red-600 text-xl font-bold mb-3'>
            Delete this activity?
          </h4>
          <p className='text-gray-700 mb-6 leading-relaxed'>
            Are you sure you want to delete this activity? This action cannot be
            reversed.
          </p>

          <div className='flex gap-3 justify-end'>
            <button
              type='button'
              onClick={onCancel}
              className='px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={onConfirm}
              className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
