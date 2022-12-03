import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import * as configs from '../configs';


const AppLoader = () => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <UIActivityIndicator color={configs.colors.primary} size={60} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1
    },

    loader: {
        width: 350,
        height: 350,
    }
});

export default AppLoader;