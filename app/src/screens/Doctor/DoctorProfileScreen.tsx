import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native'
import * as Animatable from 'react-native-animatable'
import AppLoader from '../../components/AppLoader'
import * as config from '../../configs'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Context as DoctorContext } from '../../context/doctorContext'
import { DoctorsDetail } from '../../interfaces'
import { initialDoctorInfo } from '../../configs/constants'
import { displayMessage, getUserInitials } from '../../components/common/SharedHelper'
import Avatar from '../../components/Avatar';
import { Avatar as AvatarRP } from 'react-native-paper';
import { Button } from 'react-native-paper';
import * as contact from '../../components/common/communications';

const DoctorProfileScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { doctor_id } = route.params
    const [isLoading, setIsLoading] = useState(true)
    const { getDoctorInfo } = useContext(DoctorContext)
    const [doctorInfo, setDoctorInfo] = useState<DoctorsDetail>(initialDoctorInfo);

    useEffect(() => {
        getDoctorInfo({ doctorId: doctor_id, onSuccess: populateDoctorInfo, onFailure: displayMessage, onCompletion: () => setIsLoading(false) })
    }, []);

    const populateDoctorInfo = (doctorInfo: DoctorsDetail) => {
        setDoctorInfo(doctorInfo)
    }

    const callDoctor = () => {
        if (doctorInfo.is_online) {
            contact.callPhoneNumber(`${doctorInfo.country_code}${doctorInfo.phone_number}`)
        } else {
            displayMessage(`Doctor ${doctorInfo.first_name} is currently offline. Please try again later or schedule an appointment`)
        }
    }

    const textDoctor = () => {
        if (doctorInfo.is_online) {
            contact.sendSms(`${doctorInfo.country_code}${doctorInfo.phone_number}`)
        } else {
            displayMessage(`Doctor ${doctorInfo.first_name} is currently offline. Please try again later or schedule an appointment`)
        }
    }

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={config.colors.primary} />
            <View style={styles.header}>
                <View style={styles.header1}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
                        <Icon5 name="arrow-left" size={20} style={{ marginLeft: 20 }} color={config.colors.white} />
                    </TouchableOpacity>
                </View>
                {doctorInfo.image
                    ? <Avatar size={100} source={doctorInfo.image} anyStyles={styles.image} resizeMode={"cover"} />
                    : <AvatarRP.Text size={100} label={getUserInitials(`${doctorInfo.first_name} ${doctorInfo.last_name}`)} style={styles.image} color={config.colors.white} />
                }
                <View style={styles.header2}></View>
            </View>

            <Animatable.View
                animation="pulse"
                style={[styles.body, {
                    backgroundColor: config.colors.white
                }]}>
                <ScrollView
                    style={styles.scrollView}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.details}>
                        <Text style={{ fontSize: 24, color: config.colors.dark, fontWeight: 'bold' }}>Dr. {doctorInfo.first_name} {doctorInfo.last_name}</Text>
                        <Text style={{ fontSize: 16 }}>{doctorInfo.specialty}</Text>
                        <Text style={{ fontSize: 16 }}>{doctorInfo.address}</Text>

                        <View style={{ marginVertical: 15 }}>
                            <Text style={styles.fee}>Fee: {doctorInfo.service_fee}</Text>
                            <Button mode="contained-tonal" style={styles.consultBtn}
                                onPress={() => navigation.navigate('ScheduleAppointment', { doctor_id: doctorInfo.id })}>
                                Book
                            </Button>
                        </View>

                        <View style={styles.line} />

                        <View style={[config.styles.contacts, { marginVertical: 10 }]}>
                            <View>
                                <TouchableOpacity onPress={() => callDoctor()} style={[config.styles.callBtn, styles.callBtn]}>
                                    <Icon5 name="microphone-alt" size={18} color={config.colors.white} />
                                </TouchableOpacity>
                                <Text>Audio</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => textDoctor()} style={[config.styles.callBtn, styles.callBtn]}>
                                    <Icon5 name="video" size={18} color={config.colors.white} />
                                </TouchableOpacity>
                                <Text>Video</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => textDoctor()} style={[config.styles.callBtn, styles.callBtn]}>
                                    <Icon5 name="whatsapp" size={18} color={config.colors.white} />
                                </TouchableOpacity>
                                <Text>Whatsap</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.introduction}>
                        <Text style={styles.introText}>Introduction:</Text>
                        <Text style={{ fontSize: 16, color: config.colors.dark, fontWeight: 'bold' }}>Dr. {doctorInfo.first_name} {doctorInfo.last_name}</Text>
                        <Text style={{ fontSize: 13 }}>{doctorInfo.address}</Text>
                        <View style={styles.introLine} />
                        <Text style={{ fontSize: 13 }}>{doctorInfo.bio_summary}</Text>
                    </View>

                    <View style={styles.introduction}>
                        <Text style={styles.introText}>Work Information:</Text>
                        <View style={styles.introLine} />
                        <View style={styles.card}>
                            <View style={styles.cardHeading}>
                                <Icon name="book" size={18} color={config.colors.primary} />
                                <Text style={styles.cardTitle}>Education: </Text>
                            </View>
                            <Text style={styles.infoText}>{doctorInfo.training_institute}</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardHeading}>
                                <Icon name="dollar" size={18} color={config.colors.primary} />
                                <Text style={styles.cardTitle}>Consultation Fee: </Text>
                            </View>
                            <Text style={styles.infoText}>{doctorInfo.service_fee}</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardHeading}>
                                <Icon name="envelope" size={18} color={config.colors.primary} />
                                <Text style={styles.cardTitle}>Email: </Text>
                            </View>
                            <Text style={styles.infoText}>{doctorInfo.email}</Text>
                        </View>
                    </View>

                </ScrollView>

            </Animatable.View>
        </View>
    )
}

export default DoctorProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },

    header: {
        flex: 1,
        position: 'relative',
        backgroundColor: config.colors.primary,
    },

    header1: {
        flex: 1,
        position: 'relative',
        backgroundColor: config.colors.primary,
    },

    header2: {
        flex: 0.5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: config.colors.white
    },

    body: {
        flex: 3,
        backgroundColor: config.colors.white
    },

    scrollView: {
        flexGrow: 1,
    },

    details: {
        alignItems: 'center',
    },

    navBtn: {
        top: 30
    },

    imageView: {
        position: 'relative',
    },

    image: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 1,
        top: 50,
        backgroundColor: config.colors.paleBlue,
    },

    fee: {
        fontSize: 16,
        fontWeight: 'bold',
        color: config.colors.warning
    },
    consultBtn: {
        marginVertical: 8,
        borderWidth: 0.3,
        borderColor: config.colors.paleBlue,
    },

    introduction: {
        padding: 25
    },

    introText: {
        fontSize: 16,
        paddingBottom: 8,
        fontWeight: '700',
        color: config.colors.primaryBlue
    },

    line: {
        borderBottomColor: config.colors.primary,
        borderBottomWidth: 0.5,
        width: 180,
        alignSelf: 'center'
    },

    introLine: {
        borderBottomColor: config.colors.primary,
        borderBottomWidth: 1.2,
        width: 250,
        marginVertical: 5
    },

    card: {
        shadowColor: config.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        borderRadius: 5,
        backgroundColor: config.colors.paleSilver,
        height: 70,
        elevation: 2,
        marginVertical: 15,
    },

    cardHeading: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 10
    },

    cardTitle: {
        marginLeft: 15,
        fontSize: 14,
        fontWeight: '600',
        color: config.colors.dark
    },

    infoText: {
        marginLeft: 40,
        fontSize: 14
    },

    callBtn: {
        backgroundColor: config.colors.primary
    }
})