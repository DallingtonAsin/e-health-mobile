import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notificationReducer from './features/notificationSlice';

export const store = configureStore({
    reducer: {
        notifications: notificationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;