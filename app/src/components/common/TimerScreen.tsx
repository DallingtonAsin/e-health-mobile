import React from 'react';
import { View, Text } from 'react-native';

const TimerScreen = ({ timer }: { timer: number }) => {

    const formatTime = (time: number): string => {
        const hours: string = padWithLeadingZeros(Math.floor(time / 3600), 2);
        const minutes: string = padWithLeadingZeros(Math.floor((time % 3600) / 60), 2);
        const seconds: string = padWithLeadingZeros(time % 60, 2);

        return `${hours}:${minutes}:${seconds}`;
    };

    const padWithLeadingZeros = (number: number, length: number): string => {
        let str = String(number);
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>{formatTime(timer)}</Text>
        </View>
    );
};

export default TimerScreen;