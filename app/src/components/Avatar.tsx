import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as config from '../configs';

const Avatar = ({ source, size = 50, borderRadius = 50, resizeMode = FastImage.resizeMode.contain }: { source: string, size: number, borderRadius?: number, resizeMode?: any }) => {
    const styles = makeStyles(borderRadius);
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <FastImage
                source={{ uri: source }}
                resizeMode={resizeMode}
                style={[styles.image, { width: size, height: size }]}
            />
        </View>
    );
};

const makeStyles = (borderRadius: number) => StyleSheet.create({
    container: {
        borderRadius: borderRadius,
        overflow: 'hidden',
        backgroundColor: config.colors.silver,
    },
    image: {
        borderRadius: borderRadius,
    },
});

export default Avatar;
