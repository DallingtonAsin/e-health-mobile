import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as configs from '../configs';

export const CustomDay = ({ date, selected, onPress, scheduleDates = [] }: { date: any, selected: any, onPress: any, scheduleDates: string[] }) => {

    const dateString = date.dateString;
    let backgroundColor = selected ? configs.colors.primary : configs.colors.white;

    if (scheduleDates.includes(dateString)) {
        return (
            <TouchableOpacity onPress={onPress} style={[{ backgroundColor: backgroundColor }, selected && { padding: 6, borderRadius: 20 }]}>
                <Text style={[styles.dayText, selected && styles.selectedDateText]}>{date.day}</Text>
            </TouchableOpacity>
        );
    }

    return (<Text style={[styles.day, styles.disabled]}>{date.day}</Text>);
};

const styles = StyleSheet.create({


    selectedDateText: {
        color: configs.colors.white
    },

    dayText: {
        fontSize: 16,
        color: '#333'
    },

    day: {
        fontSize: 16,
        color: '#2d4150'
    },
    disabled: {
        color: '#d9e1e8'
    },

});