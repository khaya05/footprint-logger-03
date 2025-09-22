import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: []
  },
  reducers: {
    addToast: (state, action) => {
      const { message, type } = action.payload;
      const id = Date.now() + Math.random();
      state.toasts.push({ id, message, type });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    }
  }
});

export const showSuccessToast = (message) => (dispatch) => {
  dispatch(addToast({ message, type: 'success' }));
};

export const showErrorToast = (message) => (dispatch) => {
  dispatch(addToast({ message, type: 'error' }));
};

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;