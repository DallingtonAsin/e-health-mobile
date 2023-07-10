import React, { useEffect, useContext, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { Context as AppContext } from '../../context/appContext'
import { Context as AuthContext } from '../../context/authContext'
import * as configs from '../../configs'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome'
import AppLoader from '../../components/AppLoader'
import { displayMessage } from '../../components/common/SharedHelper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const CallsTabScreen = () => {

    const { state } = useContext(AuthContext)
    const user = state.user
    const [isLoading, setIsLoading] = useState(true)
    const [heldCalls, setHeldCalls] = useState<any>([])
    const { getHeldAppointments } = useContext(AppContext)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    useEffect(() => {
        fetchHistoryCalls()
    }, [])

    const fetchHistoryCalls = () => {
        getHeldAppointments({ is_patient: user.is_patient, onSuccess: populateHeldCalls, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const populateHeldCalls = (data: any) => {
        setHeldCalls(data)
    }

    const handlePress = (appointment_id: number) => {
        navigation.navigate('AppointmentDetails', { appointment_id: appointment_id })
    }

    const Item = ({ appointment }: { appointment: any }) => (
        <TouchableOpacity activeOpacity={0.8} style={styles.appointmentContainer} onPress={() => handlePress(appointment.id)}>
            <Text style={styles.appointmentType}>{appointment.appointment_type.name}</Text>
            <View key={appointment.id} style={styles.detailsItem}>
            <Text style={styles.appointmentDetails}>
                   Appointment No: {appointment.appointment_number}
                </Text>
                <Text style={styles.appointmentDetails}>
                    Start Date: {appointment.held_call.start_time}
                </Text>
                <Text style={styles.appointmentDetails}>End Date: {appointment.held_call.end_time}</Text>
                <Text style={styles.appointmentDetails}>
                    Duration: {appointment.held_call.duration} minutes
                </Text>
                <Text style={styles.appointmentDetails}>Reason: {appointment.reason}</Text>
            </View>
        </TouchableOpacity>
    )

    const RenderItem = ({ item }: { item: any }) => (
        <Item appointment={item} />
    )

    const EmptyListComponent = () => (
        <View style={configs.styles.emptyViewContainer}>
            <View style={configs.styles.emptyIconContainer}>
                <Icon name="exclamation" size={45} color={configs.colors.disabled} />
            </View>
            <Text style={configs.styles.noInfoText}>No history calls found</Text>
        </View>
    )

    if (isLoading) {
        return <AppLoader bgColor={configs.colors.white} />
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={heldCalls}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <RenderItem item={item} />}
                ListEmptyComponent={EmptyListComponent}
            />
        </View>
    )
}

export default CallsTabScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    appointmentContainer: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
        marginVertical: 8,
        marginHorizontal: 5,
    },
    detailsItem: {
        backgroundColor: '#F4F4F4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    appointmentType: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    appointmentDetails: {
        fontSize: 16,
        marginBottom: 4,
    },
})