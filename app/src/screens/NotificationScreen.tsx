import { useState, useContext, useEffect } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Notification } from "../interfaces";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from "../components/common/SharedHelper";
import AppLoader from "../components/AppLoader";
import { addNotification, markAsRead, selectNotifications } from "../redux/reducers/notificationSlice";
import { useDispatch, useSelector } from 'react-redux';

const NotificationScreen = () => {

    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);

    const { state, getNotifications, markNotificationRead } = useContext(AppContext);
    const user = state.user;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        getNotifications({ is_patient: user.is_patient, onSuccess: populateNotifications, onFailure: displayMessage, onCompletion: stopLoading });
    }

    const populateNotifications = (data: any) => {
        let messages = data.notifications;
        if (messages.length > 0) {
            messages.forEach((notification: Notification) => {
                const existingNotification = notifications.find((n: Notification) => n.id === notification.id);
                if (!existingNotification) {
                    dispatch(addNotification(notification));
                }
            });
        }
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const markNotificationAsRead = (item: Notification) => {
        if (!item.read) {
            dispatch(markAsRead(item.id));
            markNotificationRead({ notification_id: item.id, is_patient: user.is_patient, onSuccess: fetchNotifications, onFailure: displayMessage, onCompletion: () => stopLoading });
        }
    }

    const Item = ({ item }: { item: Notification }) => (
        <TouchableOpacity style={styles.item} onPress={() => markNotificationAsRead(item)}>
            <View style={item.read ? styles.dotRead : styles.dotUnread}></View>
            <View style={styles.messageContainer}>
                <Text style={styles.message}>{item.data.message}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: Notification }) => (
        <Item item={item} />
    );

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <Icon5 name="bell-slash" size={60} color={configs.colors.silver} />
            <Text style={configs.styles.noInfoText}>No notifications found</Text>
        </View>
    );

    if (isLoading) {
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
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },

    item: {
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 16,
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        elevation: 5,
    },

    messageContainer: {
        flexGrow: 1,
        maxWidth: '96.5%',
    },

    message: {
        color: '#000',
        fontSize: configs.fonts.medium,
    },

    dotRead: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.gray,
        marginRight: 10,
    },

    dotUnread: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: configs.colors.orange,
        marginRight: 10,
    },

})