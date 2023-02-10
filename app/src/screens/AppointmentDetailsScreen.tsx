import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import * as config from '../configs';
import { Avatar } from 'react-native-paper';


const AppointmentDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointmentInfo } = route.params;
    const { appointment_number, appointment_date, appointment_time, appointment_type, symptoms, status } = appointmentInfo;

    const Separator = () => (
        <View style={styles.separator} />
    );

    const ContentItem = ({ title, value }: { title: any, value: any }) => (
        <View style={styles.appointmentInfo}>
            <Text style={styles.subtitle}>{title}</Text>
            <Text style={styles.info}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Avatar.Image size={80} source={{ uri: appointmentInfo.doctor.image }} />
                    </View>
                    <View>
                        <Text style={styles.name}>{appointmentInfo.doctor.title} {appointmentInfo.doctor.first_name} {appointmentInfo.doctor.last_name}</Text>
                        <Text style={styles.titles}>{appointmentInfo.doctor.qualification}</Text>
                        <Text style={styles.userTitle}>{appointmentInfo.doctor.profession}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <ContentItem title={"Appointment Number"} value={appointment_number} />
                    <Separator />
                    <ContentItem title={"Appointment Type"} value={appointment_type} />
                    <Separator />
                    <ContentItem title={"Sypmptoms"} value={symptoms} />
                    <Separator />
                    <ContentItem title={"Appointment Date"} value={appointment_date} />
                    <Separator />
                    <ContentItem title={"Appointment Time"} value={appointment_time} />
                    <Separator />
                    <ContentItem title={"Service Fee"} value={appointmentInfo.doctor.service_fee} />
                    <Separator />
                    <View style={styles.appointmentInfo}>
                        <Text style={styles.subtitle}>Status</Text>
                        <Text style={[status == 'Pending' && { color: config.colors.pendingColor } , status == 'Cancelled' && { color: config.colors.pink }, status == 'Completed' && { color: config.colors.success} ]}>{status}</Text>
                    </View>
                </View>


                <View style={styles.footer}>
                    <Pressable style={[config.styles.primaryBtn, { bottom: 15 }]} onPress={() => navigation.navigate(`Home`)}>
                        <Text style={[styles.buttonText, { color: config.colors.white }]}>Join Meeting</Text>
                    </Pressable>

                    <Pressable style={[config.styles.dangerBtn]} onPress={() => navigation.navigate(`Home`)}>
                        <Text style={[styles.buttonText, { color: config.colors.white }]}>Cancel Appointment</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
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
        opacity: 0.8,
        fontSize: config.fonts.normal,
    },

    userTitle: {
        fontSize: config.fonts.large,
        color: config.colors.primary,
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
        color: config.colors.black,
        fontSize: 18,
        fontWeight: 'bold'
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
        alignSelf: 'center',
        marginVertical: 10
    },

    separator: {
        width: '85%',
        height: 1,
        marginTop: 5,
        backgroundColor: '#e2e2e2',
        marginHorizontal: 15,
        alignSelf: 'center',
    }

});