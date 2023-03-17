import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, useWindowDimensions } from 'react-native';
import * as config from '../configs';
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../components/Avatar';
import { Context as AppContext } from '../context/appContext';
import { displayMessage, getUserInitials } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import MeetingRoomScreen from './MeetingRoomScreen';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { callPhoneNumber, sendSms } from '../components/common/communications';


const AppointmentDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointmentInfo } = route.params;
    const { id, doctor, patient, appointment_number, appointment_date, appointment_time, appointment_type,
        reason, completed_at, cancelled_at, is_online, meeting_access, medical_history, status } = appointmentInfo;

    const { state, cancelAppointment } = useContext(AppContext);
    const user = state.user;
    const [isLoading, setIsLoading] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [index, setIndex] = React.useState(0);
    const layout = useWindowDimensions();


    const [routes] = React.useState([
        { key: 'appointment', title: 'Details' },
        { key: 'profile', title: user.is_patient ? 'Doctor Profile' : 'Patient Profile' },
    ]);

    const Separator = () => (
        <View style={styles.separator} />
    );

    const ContentItem = ({ title, value, row = false }: { title: any, value: any, row?: boolean }) => (
        <View style={[styles.appointmentInfo, row ? { flexDirection: 'row' } : { flexDirection: 'column' }]}>
            <Text style={styles.subtitle}>{title}</Text>
            <Text style={styles.info}>{value}</Text>
        </View>
    );

    const cancelMedicalAppointment = () => {
        Alert.alert(
            '',
            `Are you sure you want to cancel appointment ${appointment_number}?`,
            [
                {
                    text: 'Yes', onPress: async () => {
                        let payload = {
                            patient_id: patient.id,
                            appointment_number: appointment_number
                        }
                        setIsLoading(true);
                        cancelAppointment({ payload: payload, onSuccess: displayMessage, onFailure: displayMessage, onCompletion: afterCancelling });
                    }
                },
                { text: 'No', onPress: () => console.log('Cancel Pressed') },
            ],
            { cancelable: false }
        );
    }

    const afterCancelling = () => {
        setIsLoading(false);
        navigation.navigate('MyAppointments');
    }

    if (videoCall) {
        if (meeting_access && meeting_access.appId) {
            return <MeetingRoomScreen appointment_id={id} videoCall={videoCall} setVideoCall={setVideoCall} />
        } else {
            displayMessage(`This meeting does not have meeting links, please contact admin`);
        }
    }

    const DoctorProfile = () => (
        <React.Fragment>
            <View style={styles.header}>
                {doctor.thumbnail && <Avatar size={90} source={doctor.thumbnail} />}
                {!doctor.thumbnail && <AvatarRP.Text size={90} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                <View style={config.styles.contacts}>
                    <TouchableOpacity onPress={() => callPhoneNumber(`${doctor.country_code}${doctor.phone_number}`)} style={config.styles.sms}>
                        <Icon5 name="phone-alt" size={22} style={config.styles.callBtn} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendSms(`${doctor.country_code}${doctor.phone_number}`)} style={config.styles.sms}>
                        <Icon5 name="sms" size={22} style={config.styles.callBtn} />
                    </TouchableOpacity>
                </View>
            </View>
            <ContentItem title={"Name"} value={`${doctor.first_name} ${doctor.last_name}`} />
            <ContentItem title={"Phone Number"} value={`${doctor.country_code} ${doctor.phone_number}`} />
            <ContentItem title={"Specialty"} value={doctor.specialty_id} />
            <ContentItem title={"Profession"} value={doctor.profession} />
            <ContentItem title={"Email"} value={doctor.email} />
            <ContentItem title={"Experience"} value={doctor.experience} />
            <ContentItem title={"Service fee"} value={doctor.service_fee} />
        </React.Fragment>
    );

    const PatientProfile = () => (
        <React.Fragment>
            <View style={styles.header}>
                {patient.thumbnail && <Avatar size={100} source={patient.thumbnail} />}
                {!patient.thumbnail && <AvatarRP.Text size={80} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                <View style={config.styles.contacts}>
                    <TouchableOpacity onPress={() => callPhoneNumber(`${patient.country_code}${patient.phone_number}`)} style={config.styles.sms}>
                        <Icon5 name="phone-alt" size={22} style={config.styles.callBtn} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendSms(`${patient.country_code}${patient.phone_number}`)} style={config.styles.sms}>
                        <Icon5 name="sms" size={22} style={config.styles.callBtn} />
                    </TouchableOpacity>
                </View>
            </View>
            <ContentItem title={"Name"} value={`${patient.first_name} ${patient.last_name}`} />
            <ContentItem title={"Phone Number"} value={`${patient.country_code} ${patient.phone_number}`} />
            <ContentItem title={"Address"} value={patient.address} />
            <ContentItem title={"Email"} value={patient.email} />
            <ContentItem title={"Date of Birth"} value={patient.dob} />
        </React.Fragment>
    );

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
    );

    const AppointmentDetails = () => (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>

            <View style={styles.body}>
                <ContentItem title={"Appointment number"} value={appointment_number} />
                <ContentItem title={"Appointment type"} value={appointment_type.name} />
                <ContentItem title={"Reason"} value={reason} />
                <ContentItem title={"Medical history"} value={medical_history.past_medical_history} />
                <ContentItem title={"Current treatment"} value={medical_history.current_treatment} />
                <ContentItem title={"Appointment schedule"} value={`${appointment_date} ${appointment_time}`} />
                <ContentItem title={"Service fee"} value={doctor.service_fee} />
                <View style={styles.appointmentInfo}>
                    <Text style={styles.subtitle}>Status</Text>
                    <Text style={[status == 'Pending' && { color: config.colors.pendingColor }, status == 'Cancelled' && { color: config.colors.pink }, status == 'Completed' && { color: config.colors.success }]}>{status}</Text>
                </View>

                {completed_at && <><ContentItem title={"Completed At"} value={completed_at} /><Separator /></>}
                {cancelled_at && <><ContentItem title={"Cancelled At"} value={cancelled_at} /><Separator /></>}

                {
                    status == 'Pending' &&
                    <View style={styles.footer}>

                        {is_online &&
                            <TouchableOpacity style={[config.styles.primaryBtn, { width: '98%' }]} onPress={() => setVideoCall(true)}>
                                <Text style={[styles.buttonText, { color: config.colors.white }]}>Join Meeting</Text>
                            </TouchableOpacity>
                        }


                        {user.is_patient &&
                            <TouchableOpacity style={[config.styles.dangerBtn, { marginVertical: 10, width: '98%' }]} onPress={() => cancelMedicalAppointment()}>
                                <Text style={[styles.buttonText, { color: config.colors.white }]}>Cancel Appointment</Text>
                            </TouchableOpacity>
                        }

                        {!user.is_patient &&
                            <TouchableOpacity style={[config.styles.secondaryBtn, { marginVertical: 10, width: '98%' }]} onPress={() => cancelMedicalAppointment()}>
                                <Text style={[styles.buttonText, { color: config.colors.primary }]}>Complete Appointment</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }

            </View>
        </ScrollView>
    );

    const renderScene = SceneMap({
        appointment: AppointmentDetails,
        profile: ProfileDetails
    });


    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color: focused ? config.colors.primary : config.colors.black, fontSize: config.fonts.large, fontWeight: '400' }}>
                    {route.title}
                </Text>
            )}
            indicatorStyle={{ backgroundColor: config.colors.primary }}
            style={{ backgroundColor: config.colors.white }}
        />
    );

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <TabView
                    navigationState={{ index, routes }}
                    renderTabBar={renderTabBar}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                />
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    );
}

export default AppointmentDetailsScreen;

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
        fontSize: config.fonts.large,
        textAlign: 'center',
    },

    userTitle: {
        fontSize: config.fonts.large,
        color: config.colors.primary,
        textAlign: 'center',
    },

    appointmentInfo: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 5,
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
        fontSize: config.fonts.large,
        opacity: 0.9,
    },

    info: {
        color: config.colors.primary,
        fontSize: config.fonts.large,
        fontWeight: '400',
        marginVertical: 0,
    },

    bookedTitle: {
        fontSize: config.fonts.large,
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
        fontSize: config.fonts.large,
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
        fontSize: 16,
        opacity: 0.6
    },

    date: {
        color: config.colors.white,
        fontSize: 16,
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
        fontSize: config.fonts.large,
        fontWeight: '600',
        textTransform: 'capitalize',
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
    },



});