import React, { useState, useContext, useEffect } from "react"
import { SafeAreaView, Text, FlatList, View, StyleSheet, TouchableOpacity } from "react-native"
import { Notification } from "../interfaces"
import * as configs from '../configs'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { Context as AppContext } from '../context/appContext'
import { Context as AuthContext } from '../context/authContext'
import { displayMessage } from "../components/common/SharedHelper"
import AppLoader from "../components/AppLoader"
import { fetchNotifications, markAsRead } from "../redux/reducers/notificationSlice"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from "../redux/store"
import NotificationCard from "../components/NotificationCard"

const NotificationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false)
    const dispatch: AppDispatch = useDispatch()
    const notifications = useSelector((state: RootState) => state.notifications.notifications)
    const loading = useSelector((state: RootState) => state.notifications.loading)
    const error = useSelector((state: RootState) => state.notifications.error)

    const { state } = useContext(AuthContext)
    const { markNotificationRead } = useContext(AppContext)
    const user = state.user
    const { is_patient } = user

    useEffect(() => {
        LoadNotifications()
    }, [dispatch, is_patient])

    const markNotificationAsRead = (item: Notification) => {
        if (!item.read) {
            dispatch(markAsRead(item.id))
            markNotificationRead({ notification_id: item.id, is_patient: user.is_patient, onSuccess: () => { }, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
        }
        if (item.is_appointment) {
            navigation.navigate('AppointmentDetails', { appointment_id: item.data.appointment_id })
        }
    }

    const LoadNotifications = () => {
        dispatch(fetchNotifications(is_patient))
    }

    const Item = ({ item }: { item: Notification }) => (
        <NotificationCard onPress={() => markNotificationAsRead(item)} title={item.data.title} message={item.data.message} isRead={item.read} />
    )

    const renderItem = ({ item }: { item: Notification }) => (
        <Item item={item} />
    )

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <Icon5 name="bell-slash" size={60} color={configs.colors.silver} />
            <Text style={configs.styles.noInfoText}>No notifications found</Text>
        </View>
    )

    if (isLoading || loading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(item: Notification, index: number) => item.id.toString()}
                ListEmptyComponent={EmptyListComponent}
            />
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.notificationbg,
        justifyContent: 'center',
        alignItems: 'center',
    }
})