import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toastService } from '../../util/toastUtil';

export const ToastServiceConnector = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    toastService.init(dispatch);
  }, [dispatch]);

  return null;
};
