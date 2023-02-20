import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import * as config from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

const CustomStackHeader = ({ title, onPress }: { title: string, onPress: any }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onPress} style={{ position: 'absolute', left: 18 }}>
                <Icon5 name="arrow-left" size={20} color={config.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
}

export default CustomStackHeader

const styles = StyleSheet.create({
    header: {
        backgroundColor: config.colors.white,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 }
    },

    headerText: {
        fontSize: config.fonts.extraLarge,
        fontWeight: '600',
        color: config.colors.primary,
        marginLeft: 70
    }
});