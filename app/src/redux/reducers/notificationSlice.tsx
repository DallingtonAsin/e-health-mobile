import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { RootState } from '../store'
import { Notification } from "../../interfaces"
import { routes } from "../../network/routes"
import Service from "../../network/services/httpService"
import { displayErrorMessage, displayMessage } from '../../components/common/SharedHelper'

const services = new Service()

interface NotificationState {
    notifications: Notification[]
    loading: boolean
    error: string | null
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
}

export const fetchNotifications = createAsyncThunk<
    Notification[],
    boolean,
    { state: RootState }
>('notifications/fetchNotifications', async (isPatient, thunkAPI) => {
    const endpoint = isPatient ? routes.patient.notifications.all : routes.doctor.notifications.all
    return services.get(
        endpoint
    ).then(async (res) => {
        if (res && res.data) {
            const data = res.data
            return data.notifications
        }
    }).catch((error) => {
        displayErrorMessage(error, displayMessage)
    })
})

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload)
        },
        markAsRead: (state, action) => {
            state.notifications = state.notifications.map((notification) => {
                if (notification.id === action.payload) {
                    return {
                        ...notification,
                        read: true,
                    }
                }
                return notification
            })
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload
                state.loading = false
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Failed to fetch notifications'
            })
    },
})

export const { addNotification, markAsRead } = notificationsSlice.actions
export const selectAllNotifications = (state: RootState) => state.notifications.notifications
export const selectUnreadNotifications = (state: RootState) => {
    const notifications = state.notifications.notifications
    if (notifications && notifications.length > 0) {
        return notifications.filter(notification => !notification.read)
    }
    return []
}

export default notificationsSlice.reducer