import { useState, useContext, useEffect } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Notification } from "../interfaces";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from "../components/common/SharedHelper";
import AppLoader from "../components/AppLoader";


const NotificationScreen = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { state, getNotifications, markNotificationRead } = useContext(AppContext);
    const user = state.user;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        getNotifications({ is_patient: user.is_patient, onSuccess: populateNotifications, onFailure: displayMessage, onCompletion: stopLoading });
    }

    const populateNotifications = (data: any) => {
        setNotifications(data.notifications);
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const markNotificationAsRead = (item: Notification) => {
        markNotificationRead({ notification_id: item.id, is_patient: user.is_patient, onSuccess: updateNotificationInRedux, onFailure: displayMessage, onCompletion: () => { } });
    }

    const updateNotificationInRedux = () => {
        fetchNotifications();
    }

    const Item = ({ item }: { item: Notification }) => (
        <TouchableOpacity style={styles.item} onPress={() => markNotificationAsRead(item)}>
            <View style={item.read_at ? styles.dotRead : styles.dotUnread}></View>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: configs.colors.white
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