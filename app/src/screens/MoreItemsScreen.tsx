import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import * as config from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { Context as AppContext } from '../context/appContext';
import * as configs from '../configs';
import { displayMessage } from '../components/common/SharedHelper';
import { WebView } from 'react-native-webview';
import CustomStackHeader from '../components/CustomStackHeader';


const MoreItemsScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const { state, signout } = useContext(AppContext);
    const [screen, setScreen] = useState(0);
    const user = state.user;

    const listItems = [
        { id: 1, name: 'Profile Information', icon: 'user-circle', isIcon5: true, action: () => navigation.navigate('Profile') },
        { id: 2, name: 'Settings', icon: 'cog', isIcon5: true, action: () => setScreen(2) },
        { id: 3, name: 'Notification Inbox', icon: 'envelope', isIcon5: true, action: () => navigation.navigate('Notifications') },
        { id: 4, name: 'Help & Support', icon: 'question-circle', isIcon5: true, action: () => navigation.navigate('ContactUs') },
        { id: 5, name: 'Terms & Conditions', icon: 'files-o', isIcon5: false, action: () => setScreen(5) },
        { id: 6, name: 'About Us', icon: 'info-circle', isIcon5: false, action: () => setScreen(6) },
        { id: 7, name: 'Rate Us', icon: 'star', isIcon5: true, action: () => comingSoon() },
    ];

    const comingSoon = () => {
        Toast.show('Coming soon...', Toast.LONG);
    }

    const Item = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.item} onPress={item.action}>
            {
                item.isIcon5
                    ? <Icon5 name={item.icon} size={20} color={configs.colors.primary} />
                    : <Icon name={item.icon} size={20} color={configs.colors.primary} />
            }
            <Text style={styles.itemTitle}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: any }) => (
        <Item item={item} />
    );

    const TermsConditionScreen = () => (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={'Terms and Conditions'} onPress={() => { setScreen(0) }} />
            <WebView source={{ uri: 'https://pivosoftltd.com' }} />
        </SafeAreaView>
    );

    const AboutUsScreen = () => (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={'About Us'} onPress={() => { setScreen(0) }} />
            <WebView source={{ uri: 'https://www.tesla.com/' }} />
        </SafeAreaView>
    );

    const SeetingsScreen = () => (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={'About Us'} onPress={() => { setScreen(0) }} />
            <TouchableOpacity style={styles.settingsItem} onPress={() => signout()}> 
            <Icon5 name={'power-off'} size={20} color={configs.colors.primary} />
            <Text style={[styles.itemTitle, { fontSize: config.fonts.large}]}>Sign out</Text>
        </TouchableOpacity>
        </SafeAreaView>
    );

    if (screen === 2) { return <SeetingsScreen /> }
    if (screen === 5) { return <TermsConditionScreen /> }
    if (screen === 6) { return <AboutUsScreen /> }



    if (screen === 0) {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <CustomStackHeader title={'Preferences'} onPress={() => { navigation.goBack() }} />
                    <View style={styles.body}>
                        <FlatList
                            data={listItems}
                            renderItem={renderItem}
                            keyExtractor={(item: any, index: number) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            ListFooterComponent={<View style={{ height: 40 }} />}
                        />
                    </View>
                </SafeAreaView>
                {isLoading && <AppLoader />}
            </>
        )
    }

}

export default MoreItemsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        backgroundColor: '#fff',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        color:  config.colors.black,
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

    settingsItem: {
        backgroundColor: configs.colors.white,
        flexDirection: 'row',
        padding: 20,
        margin: 10,
        borderColor: configs.colors.silver,
        borderWidth: 0.5,
        shadowColor: config.colors.gray,
        elevation: 4,
        borderRadius: 5,
    },
});