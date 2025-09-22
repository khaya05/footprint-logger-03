import { useNavigation } from 'react-router-dom';

const SubmitBtn = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button
      type='submit'
      className='green-btn'
      disabled={isSubmitting}
    >
      {isSubmitting ? 'submitting' : 'submit'}
    </button>
  );
};

export default SubmitBtn;
