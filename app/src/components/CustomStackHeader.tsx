import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import * as config from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const CustomStackHeader = ({title, onPress}: {title: string, onPress: any}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={onPress} style={{ position: 'absolute', left: 10 }}>
            <Icon5 name="arrow-left" size={20} color={config.colors.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: config.colors.primary }}>{title}</Text>
       </View>
    );
}

export default CustomStackHeader

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});