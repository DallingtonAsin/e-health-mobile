import { useContext } from 'react';
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Notification } from "../../interfaces";
import { Context as AppContext } from '../../context/appContext';
import { AppThunk, RootState } from '../NotificationsStore';
import { displayMessage } from '../../components/common/SharedHelper';

interface NotificationState {
    notifications: Notification[];
    isLoading: boolean,
    error: string | null
}

const initialState: NotificationState = {
    notifications: [],
    isLoading: false,
    error: null
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        markAsRead: (state, action: PayloadAction<{ notificationId: string }>) => {
            const { notificationId } = action.payload;
            state.notifications = state.notifications.map(notification => {
                if (notification.id === notificationId) {
                    return {
                        ...notification,
                        status: 'read',
                    };
                }
                return notification;
            });
        },

        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

    }
});

export const { markAsRead, setNotifications, setIsLoading, setError } = notificationsSlice.actions;

// export const fetchNotifications = (): AppThunk => async dispatch => {
//     const { state, getNotifications } = useContext(AppContext);
//     dispatch(setIsLoading(true));
//     try {
//         getNotifications({ is_patient: state.user.is_patient, onFailure: displayMessage, onCompletion: dispatch(setIsLoading(false)) });
//     } catch (error: any) {
//         dispatch(setError(error.message));
//     } finally {
//         dispatch(setIsLoading(false));
//     }
// };

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { dispatch }) => {
            const { state, getNotifications } = useContext(AppContext);
            const user = state.user;
            getNotifications({ is_patient: user.is_patient, onFailure: displayMessage, onCompletion: dispatch(setIsLoading(false)) });
    }
);

// export const markNotificationAsRead = (notificationId: string): AppThunk => async dispatch => {
//     const { state, markNotificationRead } = useContext(AppContext);
//     try {
//         markNotificationRead({ notification_id: notificationId, is_patient: state.user.is_patient, onSuccess: {}, onFailure: displayMessage, onCompletion: () => { } });
//         dispatch(markAsRead({ notificationId }));
//     } catch (error: any) {
//         dispatch(setError(error.message));
//     }
// };

export const selectIsLoading = (state: RootState) => state.notifications.isLoading;
export const selectNotifications = (state: RootState) => state.notifications.notifications;

export default notificationsSlice.reducer;
