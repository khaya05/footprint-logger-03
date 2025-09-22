import { useDispatch } from "react-redux";
import { clearAllToasts, showErrorToast, showSuccessToast } from "../features/toast/toastSlice";

export const useToast = () => {
  const dispatch = useDispatch();

  return {
    success: (message) => dispatch(showSuccessToast(message)),
    error: (message) => dispatch(showErrorToast(message)),
    clear: () => dispatch(clearAllToasts())
  };
};


class ToastService {
  constructor() {
    this.dispatch = null;
  }

  init(dispatch) {
    this.dispatch = dispatch;
  }

  success(message) {
    if (this.dispatch) {
      this.dispatch(showSuccessToast(message));
    }
  }

  error(message) {
    if (this.dispatch) {
      this.dispatch(showErrorToast(message));
    }
  }

  clear() {
    if (this.dispatch) {
      this.dispatch(clearAllToasts());
    }
  }
}

export const toastService = new ToastService();