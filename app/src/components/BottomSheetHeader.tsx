import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as config from '../configs';

export const BottomSheetHeader = ({ title , onClose }: { title: string, onClose: any }) => {
    return (
        <View style={styles.bottomSheetHeader}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
                <Text style={styles.popupHeaderText}>{title}</Text>
            </View>
            <View>
            <TouchableOpacity onPress={onClose} style={styles.circularButton}>
            <Icon5 name="times" size={15} color={config.colors.white} />
        </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    bottomSheetHeader: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    panelHeader: {
        alignItems: 'center',
        padding: 0
    },

    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#999',
        marginTop: 8,
        marginBottom: 10,
    },

    popupHeaderText: {
        marginTop: 5,
        paddingVertical: 2,
        fontSize: config.fonts.extraLarge,
        textTransform: 'capitalize',
        fontWeight: 'bold'
    },

    circularButton: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: config.colors.danger,
        alignItems: 'center',
        justifyContent: 'center',
    },
});