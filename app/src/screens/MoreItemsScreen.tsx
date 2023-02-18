import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as config from '../configs'
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { Context as AppContext } from '../context/appContext';
import * as configs from '../configs';
import { getUserInitials } from '../components/common/SharedHelper';


const MoreItemsScreen = ({navigation}: {navigation: any}) => {

    const [isLoading, setIsLoading] = useState(false);
    const { state, signout } = useContext(AppContext);
    const user = state.user;

    const listItems = [
        {id: 1, name: 'Profile Information', icon: 'user-circle', isIcon5: true, action: () => navigation.navigate('Profile')},
        {id: 2, name: 'Settings', icon: 'cog', isIcon5: true, action: () => comingSoon()},
        {id: 3, name: 'Notification Inbox', icon: 'envelope', isIcon5: true, action: () => navigation.navigate('Notifications')},
        {id: 4, name: 'Help & Support', icon: 'question-circle', isIcon5: true, action: () => comingSoon()},
        {id: 5, name: 'Terms & Conditions', icon: 'files-o', isIcon5: false, action: () => comingSoon()},
        {id: 6, name: 'About Us', icon: 'info-circle', isIcon5: false, action: () => comingSoon()},
        {id: 7, name: 'Rate Us', icon: 'star', isIcon5: true, action: () => comingSoon()},
        {id: 8, name: 'Sign out', icon: 'power-off', isIcon5: true, action: () => signout()},
    ]

    const comingSoon = () => {
        Toast.show('Coming soon...', Toast.LONG);
    }

    const Item = ({ item }: {item: any}) => (
        <TouchableOpacity style={styles.item} onPress={item.action}>
           {
            item.isIcon5
            ?  <Icon5 name={item.icon} size={20} color={configs.colors.primary} />
            :  <Icon name={item.icon} size={20} color={configs.colors.primary} />
           }
            <Text style={styles.itemTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: any }) => (
        <Item item={item} />
    );

    return (
        <>
            <SafeAreaView style={styles.container}>

                {/* <View style={styles.header}>
                   {
                        user.image
                            ? <Avatar.Image size={80} source={{ uri: user.image }}></Avatar.Image>
                            : <Avatar.Text size={80} label={getUserInitials(`${user.first_name} ${user.last_name}`)} style={config.styles.userAvatar} />
                    }
                    <Text style={[styles.usernameText]}>{!user.is_patient && user.title} {user.first_name} {user.last_name}</Text>
                    <Text style={[styles.headerText]}>
                        <Text> {`0`}{user.phone_number} </Text>
                    </Text>
                </View> */}


                <View style={styles.body}>
                <FlatList
                    data={listItems}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index:number) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    ListFooterComponent={<View style={{height: 40}}/>}
                />
                </View>

                
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )

}

export default MoreItemsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flex: 1.5,
        backgroundColor: config.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    body: {
        flex: 4.5,
        backgroundColor: config.colors.white,
    },
    
    headerText: {
        fontSize: 16,
        color: config.colors.white,
        paddingVertical: 5
    },

    usernameText: {
        fontSize: 20,
        fontWeight: '900',
        color: config.colors.white,
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 20,
    },

    itemTitle: {
        color: '#000',
        fontSize: configs.fonts.medium,
        left: 12,
    },

    item: {
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        padding: 20,
        borderTopColor: configs.colors.silver,
        borderBottomColor: configs.colors.silver,
        borderWidth: 0.5,
    },
})