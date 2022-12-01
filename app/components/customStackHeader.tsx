import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { navigateBack } from '../navigation/RootNavigation';

const CustomStackHeader = ({title}: {title: string}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={navigateBack()}>
            <Icon5 name="arrow-left" size={25} color={configs.colors.primary} style={styles.arrowIcon}/>
            </TouchableOpacity>
            <Text style={styles.verifyTxt}>{title}</Text>
        </View>
    );
}

export default CustomStackHeader

const styles = StyleSheet.create({
    container: {
        height: 65,
        alignItems: 'center',
        borderTopColor: 'none',
        backgroundColor: configs.colors.white,
        borderBottomWidth: 0.5,
        borderBottomColor: configs.colors.primary,
        flexDirection: 'row',
    
    },

    verifyTxt: {
        color: configs.colors.primary,
        fontSize: 20,
        paddingHorizontal: 80,
        fontWeight: '400',
    },

    arrowIcon: {
        left:45,
    }
});