import React from 'react'
import { View, Text } from 'react-native'
import * as config from '../../configs'

const TimerScreen = ({ seconds }: { seconds: number }) => {

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
    
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

  
    return (
        <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 24, color: config.colors.primary, fontWeight: 'bold' }}>{formatTime(seconds)}</Text>
        </View>
    )
}

export default TimerScreen