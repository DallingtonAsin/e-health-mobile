import { useState } from "react";
import { SafeAreaView, Text, FlatList, View, StyleSheet, Image } from "react-native";
import { Notification } from "../interfaces";
import * as configs from '../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-paper';


const NotificationScreen = () => {

    const initialMessages: any = []
    const [notifications, setNotifications] = useState<Notification[]>(initialMessages);

    const Item = ({ item }: { item: Notification }) => (
        <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.message}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: Notification }) => (
        <Item item={item} />
    );

    const EmptyListMessage = () =>  (
            <View style={styles.emptyViewContainer}>
                <Image style={styles.image} source={configs.images.no_notifications} />
                <Text style={{fontSize: configs.fonts.large, paddingVertical: 5}}>No notifications found</Text>
            </View>
     )
      

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(item: Notification, index: number) => item.id.toString()}
                ListEmptyComponent={EmptyListMessage}
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

    itemTitle: {
        color: '#000',
        fontSize: configs.fonts.medium,
    },

    emptyViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: 80,
        height: 80,
        tintColor: configs.colors.gray
    }
})