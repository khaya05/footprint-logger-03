import { useDashboardContext } from '../../pages/DashboardLayout';

const Modal = () => {
  const { setShowModal } = useDashboardContext();
  return (
    <div
      className='absolute inset-0 bg-black/70 backdrop-blur-sm z-10'
      onClick={() => setShowModal(false)}
    />
  );
};


export default Modal;
