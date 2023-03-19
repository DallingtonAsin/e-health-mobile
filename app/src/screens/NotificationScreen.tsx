import { useContext, useEffect } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Notification } from "../interfaces";
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from "../components/common/SharedHelper";
import AppLoader from "../components/AppLoader";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, setIsLoading } from "../redux/features/notificationSlice";
import { selectNotifications, selectIsLoading } from "../redux/features/notificationSlice";

const NotificationScreen: React.FC = () => {

    const notifications = useSelector(selectNotifications);
    const isLoading = useSelector(selectIsLoading);

    const { state, getNotifications } = useContext(AppContext);
    const user = state.user;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);


    const handleRefresh = () => {
        getNotifications({ is_patient: user.is_patient, onFailure: displayMessage, onCompletion: setIsLoading(false) });
    }

    const markNotificationAsRead = (item: Notification) => {
        if (!item.read_at) {
            let notificationId = item.id;
            dispatch(markAsRead({ notificationId }));
        }
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
                onRefresh={handleRefresh}
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