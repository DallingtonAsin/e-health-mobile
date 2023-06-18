import React, { useState, useContext, useEffect } from "react"
import { SafeAreaView, FlatList, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import AppLoader from "../../components/AppLoader"
import { MyAppointmentInfo } from "../../interfaces"
import EmptyListComponent from "../Common/EmptyListComponent"
import * as config from '../../configs'
import { Context as AppContext } from '../../context/appContext'
import { Context as AuthContext } from '../../context/authContext'
import { displayMessage, getDayMonth, strContains } from "../../components/common/SharedHelper"

const AppointmentsScreen = ({
    appointment_type,
    onPress,
}: {
    appointment_type: string,
    onPress: Function

}) => {
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { getMyAppointments } = useContext(AppContext)
    const [appointments, setAppointments] = useState<MyAppointmentInfo[]>()

    const { state } = useContext(AuthContext)
    const user = state.user

    const onRefresh = () => {
        setRefreshing(true)
        fetchAppointments()
        setRefreshing(false)
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const is_patient = user.is_patient
    const payload = { user_id: user.id, is_patient: is_patient }
    const fetchAppointments = () => {
        getMyAppointments({ payload: { ...payload, path: appointment_type }, onSuccess: setAppointmentData, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }

    const setAppointmentData = (data: MyAppointmentInfo[]) => { setAppointments(data) }

    const renderItem = ({ item }: { item: MyAppointmentInfo }) => (
        <TouchableOpacity style={styles.item}
            onPress={() => onPress(item.id)}>
            <View style={styles.circle}>
                <Text style={styles.day}>{getDayMonth(item.appointment_date)[0]}</Text>
                <Text style={styles.month}>{getDayMonth(item.appointment_date)[1]}</Text>
            </View>
            <View style={styles.main}>

                {is_patient && <Text style={styles.doctorTxt}>{item.doctor.first_name} {item.doctor.last_name}</Text>}
                {!is_patient && <Text style={styles.doctorTxt}>{item.patient.first_name} {item.patient.last_name}</Text>}

                <Text style={styles.info}>Reason: <Text style={[styles.info]}>{item.reason}</Text></Text>
                <View style={styles.dateView}>
                    <Text style={[styles.info]}>Date: {item.appointment_date}</Text>
                    <Text style={[styles.info]}>Time: {item.appointment_time}</Text>
                </View>

                <View style={styles.typeView}>
                    <View style={[styles.type, strContains(item.appointment_type.name, 'audio') && { backgroundColor: config.colors.silver },
                    strContains(item.appointment_type.name, 'video') && { backgroundColor: config.colors.warning },
                    strContains(item.appointment_type.name, 'person') && { backgroundColor: config.colors.confirmedColor },
                    ]}>
                        <Text style={styles.typeTxt}>{item.appointment_type.name}</Text>
                    </View>
                    <View style={styles.statusView}>
                        <Text style={styles.info}>Status:</Text>
                        <Text style={[styles.status, item.status === 'Completed' && config.styles.completedTxt,
                        (item.status === 'Cancelled' || item.is_expired) && config.styles.cancelledTxt, item.status === 'Pending' && config.styles.pendingTxt, item.status === 'Confirmed' && config.styles.confirmedTxt]}>{item.status}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <View style={styles.subcontainer}>
                    <FlatList
                        data={appointments}
                        renderItem={renderItem}
                        keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={!isLoading ? <EmptyListComponent message={`No ${appointment_type} appointments`} /> : null}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </View>
            </SafeAreaView>
            {isLoading && !refreshing && <AppLoader bgColor={config.colors.white} />}
        </React.Fragment>
    )
}

export default AppointmentsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
    },

    subcontainer: {
        flex: 1,
        marginHorizontal: 10,
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
    },

    main: {
        flex: 3,
        paddingHorizontal: 20,
        paddingBottom: 6,
        borderBottomColor: config.colors.silver,
        borderBottomWidth: 1,

    },

    typeView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },

    type: {
        padding: 5,
        borderRadius: 4,
    },

    typeTxt: {
        color: config.colors.white,
        fontSize: config.fonts.normal
    },

    info: {
        fontSize: config.fonts.medium,
    },

    doctorTxt: {
        fontSize: config.fonts.large,
        fontWeight: '500',
        color: config.colors.dark,
        opacity: 0.7,
    },

    statusView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dateView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    status: {
        fontSize: config.fonts.normal,
        opacity: 0.90,
        fontWeight: '300',
        marginLeft: 5,
        borderRadius: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 5
    },

    circle: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#00bfff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    day: {
        fontSize: 24,
        color: 'white'
    },

    month: {
        fontSize: 14,
        color: 'white'
    }
})