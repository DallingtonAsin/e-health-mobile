import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as config from '../../configs'
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { Context as AppContext } from '../../context/appContext';
import * as configs from '../../configs';
import { WebView } from 'react-native-webview';
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
            <WebView source={{ uri: 'https://pivosoftltd.com' }} onLoad={() => setIsLoading(false)} />
        </SafeAreaView>
    )
}

const SettingsScreen = () => {
    const { signout } = useContext(AppContext);
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.settingsItem} onPress={() => signout()}>
                <Icon5 name={'power-off'} size={20} color={configs.colors.primary} />
                <Text style={[styles.itemTitle]}>Sign out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const CartIncrementButton = ({ onPress }: { onPress: any }) => (
    <TouchableOpacity style={styles.quantityButton} onPress={onPress}>
        <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
)

const CartDecrementButton = ({ onPress }: { onPress: any }) => (
    <TouchableOpacity style={styles.quantityButton} onPress={onPress}>
        <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
)

export { TermsConditionScreen, AboutUsScreen, SettingsScreen, CartIncrementButton, CartDecrementButton }

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

    quantityButton: {
        width: 40,
        height: 40,
        backgroundColor: configs.colors.orange,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quantityButtonText: {
        fontSize: 24,
        color: configs.colors.white
    },

    quantityText: {
        fontSize: 24,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
});