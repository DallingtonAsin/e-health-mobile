
import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "../../interfaces";

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        markAsRead: (state, action) => {
            state.notifications = state.notifications.map((notification) => {
                if (notification.id === action.payload) {
                    return {
                        ...notification,
                        read: true,
                    };
                }
                return notification;
            });
        },
    }
});


export const { addNotification, markAsRead } = notificationsSlice.actions;
export const selectNotifications = (state: any) => state.notifications.notifications;

export default notificationsSlice.reducer;
