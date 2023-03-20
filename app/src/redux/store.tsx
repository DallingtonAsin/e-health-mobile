import { configureStore } from '@reduxjs/toolkit';
import drugsReducer from './reducers/drugsSlice';
import notificationReducer from './reducers/notificationSlice';

export default configureStore({
    reducer: {
      drugs: drugsReducer,
      notifications: notificationReducer
    }
});