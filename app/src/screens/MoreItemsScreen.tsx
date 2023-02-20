import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import * as config from '../configs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import { Context as AppContext } from '../context/appContext';
import * as configs from '../configs';
import { WebView } from 'react-native-webview';
import CustomStackHeader from '../components/CustomStackHeader';
import AppLoader from '../components/AppLoader';
import { getAppVersion } from '../components/common/SharedHelper';


const MoreItemsScreen = ({ navigation }: { navigation: any }) => {

    const { signout } = useContext(AppContext);
    const [screen, setScreen] = useState(0);

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

    useEffect(() => {

        const deviceBackAction = () => {
            if (screen === 2 || screen === 5 || screen === 6) {
                setScreen(0);
            } else if (screen === 0) {
                setScreen(0);
                navigation.navigate("MoreTabScreen");
            } else {
                navigation.goBack();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            deviceBackAction
        );

        return () => backHandler.remove();
    }, []);


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

    const TermsConditionScreen = () => {
        const [isLoading, setIsLoading] = useState(true);

        return (
            <SafeAreaView style={styles.container}>
                <CustomStackHeader title={'Terms and Conditions'} onPress={() => { setScreen(0) }} />
                {isLoading && <AppLoader />}
                <WebView source={{ uri: 'https://pivosoftltd.com' }} onLoad={() => setIsLoading(false)} />
            </SafeAreaView>
        )
    }

    const AboutUsScreen = () => {
        const [isLoading, setIsLoading] = useState(true);

        return (
            <SafeAreaView style={styles.container}>
                <CustomStackHeader title={'About Us'} onPress={() => { setScreen(0) }} />
                {isLoading && <AppLoader />}
                <WebView source={{ uri: 'https://www.tesla.com/' }} onLoad={() => setIsLoading(false)} />
            </SafeAreaView>
        )
    }

    const SettingsScreen = () => (
        <SafeAreaView style={styles.container}>
            <CustomStackHeader title={'About Us'} onPress={() => { setScreen(0) }} />
            <TouchableOpacity style={styles.settingsItem} onPress={() => signout()}>
                <Icon5 name={'power-off'} size={20} color={configs.colors.primary} />
                <Text style={[styles.itemTitle]}>Sign out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

    if (screen === 2) { return <SettingsScreen /> }
    if (screen === 5) { return <TermsConditionScreen /> }
    if (screen === 6) { return <AboutUsScreen /> }

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
                <View style={styles.footer}>
                    <Text style={styles.versionText}>Current Version: {getAppVersion()}</Text>
                </View>
            </SafeAreaView>
        </>
    )


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
        flex: 4,
        backgroundColor: config.colors.white,
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: config.colors.white,
        marginBottom: 20,
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



    itemTitle: {
        color: config.colors.black,
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

    versionText: {
        fontSize: config.fonts.medium,
        color: config.colors.primary
    }
});