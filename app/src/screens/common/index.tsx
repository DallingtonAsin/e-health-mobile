import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as config from '../../configs'
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Context as AppContext } from '../../context/appContext';
import * as configs from '../../configs';
import { WebView } from 'react-native-webview';
import CustomStackHeader from '../../components/CustomStackHeader';
import AppLoader from '../../components/AppLoader';


const TermsConditionScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <AppLoader />}
            <WebView source={{ uri: 'https://pivosoftltd.com' }} onLoad={() => setIsLoading(false)} />
        </SafeAreaView>
    )
}

const AboutUsScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
 
    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <AppLoader />}
            <WebView source={{ uri: 'https://www.tesla.com/' }} onLoad={() => setIsLoading(false)} />
        </SafeAreaView>
    )
}

const SettingsScreen = () => {
    const { signout } = useContext(AppContext);
    return(
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.settingsItem} onPress={() => signout()}>
            <Icon5 name={'power-off'} size={20} color={configs.colors.primary} />
            <Text style={[styles.itemTitle]}>Sign out</Text>
        </TouchableOpacity>
    </SafeAreaView>
    );
}

export { TermsConditionScreen, AboutUsScreen, SettingsScreen}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

    itemTitle: {
        color: config.colors.black,
        fontSize: configs.fonts.medium,
        left: 12,
    },


});