import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import * as configs from '../configs';
import { Avatar } from 'react-native-paper';


const AppointmentDetailsScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { appointmentInfo } = route.params;
    console.log(`Your appointment info`, appointmentInfo);

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
                        <ContentItem title={"Appointment Number"} value={appointmentInfo.appointment_number} />
                        <Separator />
                        <ContentItem title={"Appointment Type"} value={appointmentInfo.appointment_type} />
                        <Separator />
                        <ContentItem title={"Sypmptoms"} value={appointmentInfo.symptoms} />
                        <Separator />
                        <ContentItem title={"Appointment Date"} value={appointmentInfo.appointment_date} />
                        <Separator />
                        <ContentItem title={"Appointment Time"} value={appointmentInfo.appointment_time} />
                        <Separator />
                        <ContentItem title={"Service Fee"} value={appointmentInfo.doctor.service_fee} />
                        <Separator />
                    </View>


                    <View style={styles.footer}>
                        <Pressable style={[configs.styles.primaryBtn, { bottom: 15 }]} onPress={() => navigation.navigate(`Home`)}>
                            <Text style={[styles.buttonText, { color: configs.colors.white }]}>Join Meeting</Text>
                        </Pressable>

                        <Pressable style={[configs.styles.dangerBtn]} onPress={() => navigation.navigate(`Home`)}>
                            <Text style={[styles.buttonText, { color: configs.colors.white }]}>Cancel Appointment</Text>
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
        backgroundColor: configs.colors.white,
        marginVertical: 10,
        marginHorizontal: 7,
        elevation: 8,
        borderRadius: 8,
        shadowColor: configs.colors.primary,
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
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-around'
    },

    body: {
        borderWidth: 0.5,
        borderColor: configs.colors.primary,
        marginHorizontal: 10,
        borderRadius: 8,
    },

    titles: {
        opacity: 0.8,
        fontSize: configs.fonts.normal,
    },

    userTitle: {
        fontSize: configs.fonts.large,
        color: configs.colors.primary,
    },

    appointmentInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },

    subtitle: {
        fontWeight: '400',
        fontSize: configs.fonts.large,
        opacity: 0.8,
    },

    info: {
        color: '#808080',
        fontSize: configs.fonts.large
    },

    bookedTitle: {
        fontSize: configs.fonts.large,
        color: configs.colors.white,
        marginVertical: 5,
    },

    details: {
        flexDirection: 'row',
        backgroundColor: configs.colors.white,
        paddingHorizontal: 25,
        paddingVertical: 10,
        width: '90%',
        borderRadius: 5,
        marginVertical: 35
    },

    name: {
        color: configs.colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    personalInfo: {
        paddingHorizontal: 10,
        top: 5
    },

    infoTitle: {
        color: configs.colors.black,
        fontSize: 16,
        opacity: 0.6
    },

    date: {
        color: configs.colors.white,
        fontSize: 16,
        opacity: 0.7
    },

    button: {
        backgroundColor: configs.colors.white,
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
        fontSize: configs.fonts.large,
        fontWeight: '600',
        textTransform: 'capitalize',
    },

    dateSection: {
        flexDirection: 'row',
    },

    footer: {
        flexDirection: 'column',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 30,
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