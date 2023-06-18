import React from "react"
import { View, Text } from 'react-native'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import * as config from '../../configs'

const EmptyListComponent = ({ message }: { message: string }) => (
    <View style={config.styles.emptyViewContainer}>
        <Icon5 name="calendar-alt" size={60} />
        <Text style={config.styles.noInfoText}>{message}</Text>
    </View>
)

export default EmptyListComponent