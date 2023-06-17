import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, useWindowDimensions } from 'react-native'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import * as config from '../configs'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import { MyAppointmentInfo } from '../interfaces'
import { Context as AppContext } from '../context/appContext'
import { Context as AuthContext } from '../context/authContext'
import { displayMessage, getDayMonth, strContains } from '../components/common/SharedHelper'
import AppLoader from '../components/AppLoader'
import { renderTabBar } from '../components/common/tabView'

const MyAppointmentScreen = ({ navigation }: { navigation: any }) => {

    const [pendingAppointments, setPendingAppointments] = useState<MyAppointmentInfo[]>()
    const [confirmedAppiontments, setConfirmedAppointments] = useState<MyAppointmentInfo[]>()
    const [completedAppiontments, setCompletedAppointments] = useState<MyAppointmentInfo[]>()
    const [cancelledAppointments, setCancelledAppointments] = useState<MyAppointmentInfo[]>()
    const [isPendingLoading, setIsPendingLoading] = useState(true)
    const [isConfirmedLoading, setIsConfirmedLoading] = useState(true)
    const [isCompletedLoading, setIsCompletedLoading] = useState(true)
    const [isCancelledLoading, setIsCancelledLoading] = useState(true)

    const { state } = useContext(AuthContext)
    const { getMyAppointments } = useContext(AppContext)
    const user = state.user

    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'pending', title: 'Pending' },
        { key: 'confirmed', title: 'Confirmed' },
        { key: 'completed', title: 'Completed' },
        { key: 'cancelled', title: 'Cancelled' }
    ])

    let payload = { user_id: user.id, is_patient: user.is_patient }

    const fetchPendingAppointments = () => {
        getMyAppointments({ payload: { ...payload, path: 'pending' }, onSuccess: setPendingAppointmentData, onFailure: displayMessage, onCompletion: () => setIsPendingLoading(false) })
    }

    const fetchConfirmedAppointments = () => {
        getMyAppointments({ payload: { ...payload, path: 'confirmed' }, onSuccess: setConfirmedAppointmentData, onFailure: displayMessage, onCompletion: () => setIsConfirmedLoading(false) })
    }

    const fetchCompletedAppointments = () => {
        getMyAppointments({ payload: { ...payload, path: 'completed' }, onSuccess: setCompletedAppointmentData, onFailure: displayMessage, onCompletion: () => setIsCompletedLoading(false) })
    }

    const fetchCancelledAppointments = () => {
        getMyAppointments({ payload: { ...payload, path: 'cancelled' }, onSuccess: setCancelledAppointmentData, onFailure: displayMessage, onCompletion: () => setIsCancelledLoading(false) })
    }

    const setPendingAppointmentData = (data: MyAppointmentInfo[]) => { setPendingAppointments(data) }
    const setConfirmedAppointmentData = (data: MyAppointmentInfo[]) => { setConfirmedAppointments(data) }
    const setCompletedAppointmentData = (data: MyAppointmentInfo[]) => { setCompletedAppointments(data) }
    const setCancelledAppointmentData = (data: MyAppointmentInfo[]) => { setCancelledAppointments(data) }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = () => {
        fetchPendingAppointments()
        fetchConfirmedAppointments()
        fetchCompletedAppointments()
        fetchCancelledAppointments()
    }

    const EmptyListComponent = ({ message }: { message: string }) => (
        <View style={config.styles.emptyViewContainer}>
            <Icon5 name="calendar-alt" size={60} />
            <Text style={config.styles.noInfoText}>{message}</Text>
        </View>
    )

    const PendingAppointmentsScreen = () => {
        const [refreshing, setRefreshing] = useState(false)

        const onRefresh = () => {
            setRefreshing(true)
            fetchPendingAppointments()
            setRefreshing(false)
        }

        return (
            <React.Fragment>
                <SafeAreaView style={styles.container}>
                    <View style={styles.subcontainer}>
                        <FlatList
                            data={pendingAppointments}
                            renderItem={renderItem}
                            keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListEmptyComponent={!isPendingLoading ? <EmptyListComponent message="No Pending Appointments" /> : null}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    </View>
                </SafeAreaView>
                {isPendingLoading && !refreshing && <AppLoader bgColor={config.colors.white} />}
            </React.Fragment>
        )
    }

    const ConfirmedAppointmentsScreen = () => {

        const [refreshing, setRefreshing] = useState(false)
        const onRefresh = () => {
            setRefreshing(true)
            fetchConfirmedAppointments()
            setRefreshing(false)
        }

        return (
            <React.Fragment>
                <SafeAreaView style={styles.container}>
                    <View style={styles.subcontainer}>
                        <FlatList
                            data={confirmedAppiontments}
                            renderItem={renderItem}
                            keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListEmptyComponent={!isConfirmedLoading ? <EmptyListComponent message="No Confirmed Appointments" /> : null}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    </View>
                </SafeAreaView>
                {isConfirmedLoading && !refreshing && <AppLoader bgColor={config.colors.white} />}
            </React.Fragment>
        )
    }

    const CompletedAppointmentsScreen = () => {

        const [refreshing, setRefreshing] = useState(false)
        const onRefresh = () => {
            setRefreshing(true)
            fetchCompletedAppointments()
            setRefreshing(false)
        }

        return (
            <React.Fragment>
                <SafeAreaView style={styles.container}>
                    <View style={styles.subcontainer}>
                        <FlatList
                            data={completedAppiontments}
                            renderItem={renderItem}
                            keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListEmptyComponent={!isCompletedLoading ? <EmptyListComponent message="No Completed Appointments" /> : null}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    </View>
                </SafeAreaView>
                {isCompletedLoading && !refreshing && <AppLoader bgColor={config.colors.white} />}
            </React.Fragment>
        )
    }

    const CancelledAppointmentsScreen = () => {
        const [refreshing, setRefreshing] = useState(false)

        const onRefresh = () => {
            setRefreshing(true)
            fetchCancelledAppointments()
            setRefreshing(false)
        }

        return (
            <React.Fragment>
                <SafeAreaView style={styles.container}>
                    <View style={styles.subcontainer}>
                        <FlatList
                            data={cancelledAppointments}
                            renderItem={renderItem}
                            keyExtractor={(item: MyAppointmentInfo, index: number) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListEmptyComponent={!isCancelledLoading ? <EmptyListComponent message="No Cancelled Appointments" /> : null}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    </View>
                </SafeAreaView>
                {isCancelledLoading && !refreshing && <AppLoader bgColor={config.colors.white} />}
            </React.Fragment>
        )
    }

    const renderScene = SceneMap({
        pending: PendingAppointmentsScreen,
        confirmed: ConfirmedAppointmentsScreen,
        cancelled: CancelledAppointmentsScreen,
        completed: CompletedAppointmentsScreen
    })


    const renderItem = ({ item }: { item: MyAppointmentInfo }) => (
        <TouchableOpacity style={styles.item}
            onPress={() => navigation.navigate('AppointmentDetails', { appointment_id: item.id })}>
            <View style={styles.circle}>
                <Text style={styles.day}>{getDayMonth(item.appointment_date)[0]}</Text>
                <Text style={styles.month}>{getDayMonth(item.appointment_date)[1]}</Text>
            </View>
            <View style={styles.main}>

                {user.is_patient && <Text style={styles.doctorTxt}>{item.doctor.first_name} {item.doctor.last_name}</Text>}
                {!user.is_patient && <Text style={styles.doctorTxt}>{item.patient.first_name} {item.patient.last_name}</Text>}

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
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    )
}

export default MyAppointmentScreen


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
        // fontWeight: 'bold',
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
        color: 'white',
        // fontWeight: 'bold',
    },

    month: {
        fontSize: 14,
        color: 'white',
        // fontWeight: 'bold',
    },

})