import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as config from '../configs';
import { Avatar } from 'react-native-paper';
import { Context as AppContext } from '../context/appContext';
import { displayMessage, getUserInitials } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import MeetingRoomScreen from './MeetingRoomScreen';


const AppointmentDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointmentInfo } = route.params;
    const { doctor, patient, appointment_number, appointment_date, appointment_time, appointment_type,
        symptoms, completed_at, cancelled_at, is_online, meeting_access, is_video, status } = appointmentInfo;

    const { state, cancelAppointment } = useContext(AppContext);
    const user = state.user;
    const [isLoading, setIsLoading] = useState(false);
    const [videoCall, setVideoCall] = useState(false);


    const Separator = () => (
        <View style={styles.separator} />
    );

    const ContentItem = ({ title, value }: { title: any, value: any }) => (
        <View style={styles.appointmentInfo}>
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
            return <MeetingRoomScreen videoCall={videoCall} is_video={is_video} connectionData={meeting_access} setVideoCall={setVideoCall} />
        } else {
            displayMessage(`This meeting does not have meeting links, please contact admin`);
        }
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <View>
                            {user.is_patient && doctor.image && <Avatar.Image size={80} source={{ uri: doctor.thumbnail }} />}
                            {user.is_patient && !doctor.image && <Avatar.Text size={80} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}

                            {!user.is_patient && patient.image && <Avatar.Image size={80} source={{ uri: patient.thumbnail }} />}
                            {!user.is_patient && !patient.image && <Avatar.Text size={80} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                        </View>

                        {
                            user.is_patient &&
                            <View style={styles.userInfo}>
                                <Text style={styles.name}>{doctor.title} {doctor.first_name} {doctor.last_name}</Text>
                                <Text style={styles.titles}>{doctor.qualification}</Text>
                                <Text style={styles.userTitle}>{doctor.profession}</Text>
                            </View>
                        }

                        {
                            !user.is_patient &&
                            <View>
                                <Text style={styles.name}>{patient.first_name} {patient.last_name}</Text>
                                <Text style={styles.titles}>{patient.country_code}{patient.phone_number}</Text>
                                <Text style={styles.userTitle}>{patient.address}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.body}>
                        <ContentItem title={"Appointment Number"} value={appointment_number} />
                        <Separator />
                        <ContentItem title={"Appointment Type"} value={appointment_type.name} />
                        <Separator />
                        <ContentItem title={"Sypmptoms"} value={symptoms} />
                        <Separator />
                        <ContentItem title={"Appointment Date"} value={appointment_date} />
                        <Separator />
                        <ContentItem title={"Appointment Time"} value={appointment_time} />
                        <Separator />
                        <ContentItem title={"Service Fee"} value={doctor.service_fee} />
                        <Separator />
                        <View style={styles.appointmentInfo}>
                            <Text style={styles.subtitle}>Status</Text>
                            <Text style={[status == 'Pending' && { color: config.colors.pendingColor }, status == 'Cancelled' && { color: config.colors.pink }, status == 'Completed' && { color: config.colors.success }]}>{status}</Text>
                        </View>
                        <Separator />

                        {completed_at && <><ContentItem title={"Completed At"} value={completed_at} /><Separator /></>}
                        {cancelled_at && <><ContentItem title={"Cancelled At"} value={cancelled_at} /><Separator /></>}

                        {
                            status == 'Pending' &&
                            <View style={styles.footer}>

                                {is_online &&
                                    <TouchableOpacity style={[config.styles.primaryBtn, { width: '100%' }]} onPress={() => setVideoCall(true)}>
                                        <Text style={[styles.buttonText, { color: config.colors.white }]}>Join Meeting</Text>
                                    </TouchableOpacity>
                                }


                                {user.is_patient &&
                                    <TouchableOpacity style={[config.styles.dangerBtn, { width: '100%', marginBottom: 5 }, !is_online && { position: 'absolute', bottom: 20 }]} onPress={() => cancelMedicalAppointment()}>
                                        <Text style={[styles.buttonText, { color: config.colors.white }]}>Cancel Appointment</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        }

                    </View>

                </ScrollView>
            </SafeAreaView>

            {isLoading && <AppLoader />}
        </>
    );
}

export default AppointmentDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
        marginVertical: 10,
        marginHorizontal: 7,
        elevation: 8,
        borderRadius: 8,
        shadowColor: config.colors.primary,
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
    },

    scroll: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around'
    },

    body: {
        flex: 4,
        borderWidth: 0.5,
        borderColor: config.colors.primary,
        marginHorizontal: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 12,
        marginBottom: 15,
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 6,
    },

    subtitle: {
        fontWeight: '400',
        fontSize: config.fonts.medium,
        opacity: 0.9,
        textTransform: 'uppercase',
    },

    info: {
        color: config.colors.primary,
        fontSize: config.fonts.large,
        fontWeight: '400',
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
    },

    separator: {
        width: '90%',
        height: 1,
        marginTop: 5,
        backgroundColor: '#e2e2e2',
        marginHorizontal: 15,
        alignSelf: 'center',
    }

});