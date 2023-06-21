import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, useWindowDimensions } from 'react-native'
import * as config from '../configs'
import { Avatar as AvatarRP } from 'react-native-paper'
import Avatar from '../components/Avatar'
import { Context as AuthContext } from '../context/authContext'
import { Context as AppContext } from '../context/appContext'
import { Context as PatientContext } from '../context/patientContext'
import { Context as DoctorContext } from '../context/doctorContext'
import { displayMessage, getUserInitials } from '../components/common/SharedHelper'
import AppLoader from '../components/AppLoader'
import MeetingRoomScreen from './MeetingRoomScreen'
import { TabView, SceneMap } from 'react-native-tab-view'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { callPhoneNumber, sendSms } from '../components/common/communications'
import { AppointmentDetail } from '../interfaces'
import { InitialAppointmentDetailState } from '../configs/constants'
import { renderTabBar } from '../components/common/tabView'

const AppointmentDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointment_id } = route.params
    const { state } = useContext(AuthContext)
    const { getAppointmentDetails, checkAppointmentStatus } = useContext(AppContext)
    const { confirmAppointment } = useContext(DoctorContext)
    const { cancelAppointment } = useContext(PatientContext)

    const user = state.user
    const [isLoading, setIsLoading] = useState(true)
    const [videoCall, setVideoCall] = useState(false)
    const [appointmentInfo, setAppointmentInfo] = useState<AppointmentDetail>(InitialAppointmentDetailState)
    const [index, setIndex] = React.useState(0)
    const layout = useWindowDimensions()

    const [routes] = React.useState([
        { key: 'appointment', title: 'Details' },
        { key: 'profile', title: user.is_patient ? 'Doctor details' : 'Patient details' },
    ])

    useEffect(() => {
        if (appointment_id) {
            getAppointmentDetails({ appointment_id: appointment_id, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
        }
    }, [])

    const onSuccess = (data: any) => {
        setAppointmentInfo(data)
    }

    const Separator = () => (
        <View style={styles.separator} />
    )

    const ContentItem = ({ title, value, row = false }: { title: any, value: any, row?: boolean }) => (
        <View style={[styles.appointmentInfo, row ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
            <Text style={styles.subtitle}>{title}</Text>
            <Text style={styles.info}>{value}</Text>
        </View>
    )

    const confirmMedicalAppointment = () => {
        Alert.alert(
            '',
            `Are you sure you want to confirm appointment ${appointmentInfo.appointment_number}?`,
            [

                { text: 'No', onPress: () => console.log('Cancelled') },
                {
                    text: 'Yes', onPress: async () => {
                        let payload = {
                            patient_id: appointmentInfo.patient.id,
                            appointment_number: appointmentInfo.appointment_number
                        }
                        setIsLoading(true)
                        confirmAppointment({ payload: payload, onSuccess: onConfirmAppointmentSuccess, onFailure: displayMessage, onCompletion: afterCancelling })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    const cancelMedicalAppointment = () => {
        Alert.alert(
            '',
            `Are you sure you want to cancel appointment ${appointmentInfo.appointment_number}?`,
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed') },
                {
                    text: 'Yes', onPress: async () => {
                        let payload = {
                            patient_id: appointmentInfo.patient.id,
                            appointment_number: appointmentInfo.appointment_number
                        }
                        setIsLoading(true)
                        cancelAppointment({ payload: payload, onSuccess: onCancelAppointmentSuccess, onFailure: displayMessage, onCompletion: afterCancelling })
                    }
                },
            ],
            { cancelable: false }
        )
    }

    const onConfirmAppointmentSuccess = (message: string) => {
        displayMessage(message)
        navigation.navigate(`MyAppointments`)
    }

    const onCancelAppointmentSuccess = (message: string) => {
        displayMessage(message)
        navigation.navigate(`MyAppointments`)
    }

    const completeConsultation = () => {
        navigation.navigate('CompleteAppointment', {
            appointment_id: appointment_id,
            patient_id: appointmentInfo.patient.id
        })
    }

    const afterCancelling = () => {
        setIsLoading(false)
        navigation.navigate('MyAppointments')
    }

    if (videoCall) {
        if (appointmentInfo && appointmentInfo.meeting_access && appointmentInfo.meeting_access.appId) {
            return <MeetingRoomScreen appointment_id={appointment_id} is_video={appointmentInfo.is_video} />
        } else {
            displayMessage(`This meeting does not have meeting links, please contact admin`)
        }
    }

    const joinMeeting = () => {
        setIsLoading(true)
        checkAppointmentStatus({
            appointment_id: appointmentInfo.id, onSuccess: () => {
                if (!appointmentInfo.doctor.is_online) {
                    setVideoCall(true)
                } else {
                    displayMessage(`Doctor ${appointmentInfo.doctor.first_name} ${appointmentInfo.doctor.last_name} is currently offline, please try again later.`)
                }
            }, onFailure: displayMessage, onCompletion: () => setIsLoading(false)
        })
    }

    const DoctorProfile = () => (
        <React.Fragment>
            {!isLoading && <><View style={styles.header}>
                {appointmentInfo.doctor.thumbnail && <Avatar size={90} source={appointmentInfo.doctor.thumbnail} resizeMode={"cover"} />}
                {!appointmentInfo.doctor.thumbnail && <AvatarRP.Text size={90} label={getUserInitials(`${appointmentInfo.doctor.first_name} ${appointmentInfo.doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                <View style={config.styles.contacts}>
                    <TouchableOpacity onPress={() => callPhoneNumber(`${appointmentInfo.doctor.country_code}${appointmentInfo.doctor.phone_number}`)} style={config.styles.callBtn}>
                        <Icon5 name="phone-alt" size={20} color={config.colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendSms(`${appointmentInfo.doctor.country_code}${appointmentInfo.doctor.phone_number}`)} style={config.styles.callBtn}>
                        <Icon5 name="sms" size={20} color={config.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
                <ContentItem title={"Name"} value={`${appointmentInfo.doctor.first_name} ${appointmentInfo.doctor.last_name}`} />
                <ContentItem title={"Phone Number"} value={`${appointmentInfo.doctor.country_code} ${appointmentInfo.doctor.phone_number}`} />
                <ContentItem title={"Specialty"} value={appointmentInfo.doctor.specialty} />
                <ContentItem title={"Primary facility"} value={appointmentInfo.doctor.primary_facility} />
                <ContentItem title={"Email"} value={appointmentInfo.doctor.email} />
                <ContentItem title={"Address"} value={appointmentInfo.doctor.address} />
                <ContentItem title={"Consultation fee"} value={appointmentInfo.doctor.service_fee} />
            </>
            }
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

    const PatientProfile = () => (
        <React.Fragment>
            {!isLoading && <><View style={styles.header}>
                {appointmentInfo.patient.thumbnail && <Avatar size={100} source={appointmentInfo.patient.thumbnail} />}
                {!appointmentInfo.patient.thumbnail && <AvatarRP.Text size={80} label={getUserInitials(`${appointmentInfo.patient.first_name} ${appointmentInfo.patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                <View style={config.styles.contacts}>
                    <TouchableOpacity onPress={() => callPhoneNumber(`${appointmentInfo.patient.country_code}${appointmentInfo.patient.phone_number}`)} style={config.styles.callBtn}>
                        <Icon5 name="phone-alt" size={20} color={config.colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendSms(`${appointmentInfo.patient.country_code}${appointmentInfo.patient.phone_number}`)} style={config.styles.callBtn}>
                        <Icon5 name="sms" size={20} color={config.colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
                <ContentItem title={"Name"} value={`${appointmentInfo.patient.first_name} ${appointmentInfo.patient.last_name}`} />
                <ContentItem title={"Phone Number"} value={`${appointmentInfo.patient.country_code} ${appointmentInfo.patient.phone_number}`} />
                <ContentItem title={"Address"} value={appointmentInfo.patient.address} />
                <ContentItem title={"Email"} value={appointmentInfo.patient.email} />
                <ContentItem title={"Age"} value={appointmentInfo.patient.age} />
            </>
            }
            {isLoading && <AppLoader />}
        </React.Fragment>
    )

    const ProfileDetails = () => (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.body, { marginTop: 0 }]}>
                {user.is_patient && <DoctorProfile />}
                {!user.is_patient && <PatientProfile />}
            </View>
        </ScrollView>
    )

    const AppointmentDetails = () => (
        <React.Fragment>
            {!isLoading && <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>

                <View style={styles.body}>
                    <ContentItem title={"Appointment number"} value={appointmentInfo.appointment_number} />
                    <ContentItem title={"Appointment type"} value={appointmentInfo.appointment_type.name} />
                    <ContentItem title={"Appointment Time"} value={`${appointmentInfo.appointment_date} ${appointmentInfo.appointment_time}`} />
                    <ContentItem title={"Reason"} value={appointmentInfo.reason} />
                    <ContentItem title={"Medical history"} value={appointmentInfo.patient_medical_history.past_medical_history} />
                    <ContentItem title={"Current treatment"} value={appointmentInfo.patient_medical_history.current_treatment} />
                    <ContentItem title={"Consultation fee per 15 min"} value={appointmentInfo.doctor.service_fee} />
                    <View style={styles.appointmentInfo}>
                        <Text style={styles.subtitle}>Status</Text>
                        <Text style={[appointmentInfo.status == 'Pending' && { color: config.colors.pendingColor }, appointmentInfo.status == 'Cancelled' && { color: config.colors.pink }, appointmentInfo.status == 'Completed' && { color: config.colors.success }]}>{appointmentInfo.status}</Text>
                    </View>

                    {appointmentInfo.completed_at && <><ContentItem title={"Completed At"} value={appointmentInfo.completed_at} /><Separator /></>}
                    {appointmentInfo.cancelled_at && <><ContentItem title={"Cancelled At"} value={appointmentInfo.cancelled_at} /><Separator /></>}


                    <View style={styles.footer}>

                        {appointmentInfo.is_online && appointmentInfo.status == 'Confirmed' &&
                            <TouchableOpacity style={[config.styles.secondaryBtn, { width: '98%' }]} onPress={() => joinMeeting()}>
                                <Text style={[styles.buttonText, { color: config.colors.primary }]}>Join Meeting</Text>
                            </TouchableOpacity>
                        }

                        {!user.is_patient && appointmentInfo.status == 'Pending' &&
                            <TouchableOpacity style={[config.styles.primaryBtn, { marginVertical: 10, width: '98%' }]}
                                onPress={() => confirmMedicalAppointment()}>
                                <Text style={[styles.buttonText, { color: config.colors.white }]}>Confirm Appointment</Text>
                            </TouchableOpacity>
                        }

                        {!user.is_patient && (appointmentInfo.status == 'Confirmed' || appointmentInfo.status == 'Expired') &&
                            <TouchableOpacity style={[config.styles.secondaryBtn, { marginVertical: 10, width: '98%' }]}
                                onPress={() => completeConsultation()}>
                                <Text style={[styles.buttonText, { color: config.colors.primary }]}>Complete consultation</Text>
                            </TouchableOpacity>
                        }

                        {/* {!user.is_patient && (appointmentInfo.status == 'Completed' || appointmentInfo.status == 'Expired') &&
                            <TouchableOpacity style={[config.styles.secondaryBtn, { marginVertical: 10, width: '98%', borderColor: config.colors.green_1 }]}
                                onPress={() => completeConsultation()}>
                                <Text style={[styles.buttonText, { color: config.colors.green_1 }]}>View consultation data</Text>
                            </TouchableOpacity>
                        } */}

                        {(appointmentInfo.status == 'Pending' || appointmentInfo.status == 'Confirmed') &&
                            <TouchableOpacity style={[config.styles.secondaryBtn, { marginVertical: 10, width: '98%' }]} onPress={() => cancelMedicalAppointment()}>
                                <Text style={[styles.buttonText, { color: config.colors.primary }]}>Cancel Appointment</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
            }
            {isLoading && <AppLoader />}
        </React.Fragment>

    )

    const renderScene = SceneMap({
        appointment: AppointmentDetails,
        profile: ProfileDetails
    })

    return (
        <React.Fragment>
            {!isLoading && <SafeAreaView style={styles.container}>
                <TabView
                    navigationState={{ index, routes }}
                    renderTabBar={renderTabBar}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </SafeAreaView>}
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default AppointmentDetailsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
        elevation: 8,
        borderRadius: 8,
        shadowColor: config.colors.primary,
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        margin: 8,
    },

    scroll: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
    },

    header: {
        flexDirection: 'row',
        marginVertical: 15,
        marginHorizontal: 10,
        justifyContent: 'space-between'
    },

    body: {
        flex: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        marginTop: 10,
    },

    titles: {
        opacity: 0.9,
        textAlign: 'center',
    },

    userTitle: {
        color: config.colors.primary,
        textAlign: 'center',
    },

    appointmentInfo: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderBottomWidth: 0.8,
        borderBottomColor: config.colors.silver,
        paddingBottom: 7,
    },

    separator: {
        width: '90%',
        height: 1,
        marginTop: 5,
        backgroundColor: '#e2e2e2',
        marginHorizontal: 15,
        alignSelf: 'center',
    },

    subtitle: {
        fontWeight: 'normal',
        opacity: 0.9,
    },

    info: {
        color: config.colors.gray,
        fontWeight: '400',
        marginVertical: 0,
    },

    bookedTitle: {
        color: config.colors.white,
        marginVertical: 5,
    },

    details: {
        flexDirection: 'row',
        backgroundColor: config.colors.white,
        paddingHorizontal: 25,
        paddingVertical: 10,
        width: '90%',
        borderRadius: 5,
        marginVertical: 35
    },

    name: {
        fontWeight: '700',
        textAlign: 'center'
    },

    userInfo: {
        alignItems: 'center',
    },

    personalInfo: {
        paddingHorizontal: 10,
        top: 5
    },

    infoTitle: {
        color: config.colors.black,
        opacity: 0.6
    },

    date: {
        color: config.colors.white,
        opacity: 0.7
    },

    button: {
        backgroundColor: config.colors.white,
        paddingHorizontal: 148,
        paddingVertical: 18,
        borderRadius: 5,
        bottom: 50,
        position: 'absolute',
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: config.fonts.large
    },

    dateSection: {
        flexDirection: 'row',
    },

    footer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    }
})