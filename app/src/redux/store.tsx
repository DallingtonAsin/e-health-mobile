import { combineReducers, configureStore } from '@reduxjs/toolkit';
import drugsReducer from './reducers/drugsSlice';
import notificationReducer from './reducers/notificationSlice';
import userReducer from './reducers/userSlice'
import { useDispatch } from 'react-redux';

const rootReducer = combineReducers({
  drugs: drugsReducer,
  notifications: notificationReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;