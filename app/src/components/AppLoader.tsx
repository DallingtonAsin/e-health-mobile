import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import * as configs from '../configs';

const AppLoader = ({ bgColor = 'rgba(0,0,0,0.3)', color = configs.colors.primary}: {bgColor?: string, color?: string}) => {
    const styles = makeStyles(bgColor);
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <UIActivityIndicator color={color} size={60}/>
        </View>
    );
}

const makeStyles = (bgColor: string) => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        zIndex: 1
    },

    loader: {
        width: 350,
        height: 350,
    }
});

export default AppLoader;