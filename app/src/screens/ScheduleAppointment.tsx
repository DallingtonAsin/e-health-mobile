import React, { useState, useEffect, useContext, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';
import { Calendar } from 'react-native-calendars';
import { RadioButton } from 'react-native-paper';
import { DoctorsDetail } from '../interfaces';
import { Context as AuthContext } from '../context/authContext';
import { initialDoctorInfo, workingHours } from '../configs/constants';
import { displayMessage, getCurrentDate } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import { AppointmentType } from '../interfaces';
import Toast from 'react-native-simple-toast';

const screen = Dimensions.get('screen');

const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { doctor_id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isAppointmentTypeLoading, setAppointmentTypeLoading] = useState(true);

    const currentDate = getCurrentDate();

    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [appointmentTime, setAppointmentTime] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<string>('');

    const [selected, setSelected] = useState(currentDate);
    const [symptoms, setSymptoms] = useState('');
    const { getDoctorInfo, getAppointmentTypes } = useContext(AuthContext);
    const [isFocused, setIsFocused] = useState(false);

    const [markedDates, setMarkedDates] = useState<any>();
    const [hours, setHours] = useState<string[]>(workingHours);
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
    const [doctorInfo, setDoctorInfo] = useState<DoctorsDetail>(initialDoctorInfo);


    useEffect(() => {
        getDoctorInfo({ doctorId: doctor_id, onSuccess: populateDoctorInfo, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });
        getAppointmentTypes({ onSuccess: populateAppointmentTypes, onFailure: displayMessage, onCompletion: () => { setAppointmentTypeLoading(false) }});
    }, []);

    const populateDoctorInfo = (doctorInfo: DoctorsDetail) => {
        setDoctorInfo(doctorInfo);
    }

    const populateAppointmentTypes = (types: AppointmentType[]) => {
        setAppointmentTypes(types);
    }

    const setPatientAppointmentDate = (day: any) => {
        setAppointmentDate(day.dateString);
    }


    const CustomCalendar = (props: any) => {
        const marked = useMemo(() => ({
            [selected]: {
                selected: true,
                selectedColor: configs.colors.danger,
                selectedTextColor: configs.colors.white,
            }
        }), [selected]);
        return (
            <Calendar
                markedDates={marked}
                initialDate={currentDate}
                minDate={currentDate}
                disableAllTouchEventsForDisabledDays={true}
                onDayPress={(day) => {
                    setSelected(day.dateString);
                    props.onDaySelect && props.onDaySelect(day);
                }}
                {...props}
            />
        );
    }

    const callDoctor = (number: string) => {
        contact.callPhoneNumber(number);
    }

    const smsDoctor = (number: string) => {
        contact.SendSms(number);
    }

    const confirmAppointment = () => {
        if (!appointmentDate) {
            Toast.show(`Please select appointment date`); return;
        }

        if (!appointmentTime) {
            Toast.show(`Please select appointment hour`); return;
        }
        if (!appointmentType) {
            Toast.show(`Please select appointment type`); return;
        }
        if (!symptoms) {
            Toast.show(`Please enter atleast one symptom`); return;
        }
        if (appointmentDate && appointmentTime && appointmentType && symptoms) {
            navigation.navigate('AppointmentConfirmation');
        }
        let appointmentDetails = { date: appointmentDate, time: appointmentTime, type: appointmentType, symptoms: symptoms };
        // console.log(appointmentDetails);

        navigation.navigate('AppointmentConfirmation', {
            src: doctorInfo.image,
            name: `${doctorInfo.title}${doctorInfo.first_name} ${doctorInfo.last_name}`,
            phoneNumber: doctorInfo.phone_number,
            profession: doctorInfo.profession,
            appointmentInfo: appointmentDetails
        });
    }


    if (isLoading || isAppointmentTypeLoading) {
        return (
            <AppLoader bgColor={configs.colors.white} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>

                <View style={styles.header}>
                    <View style={styles.doctorInfo}>
                        <Avatar.Image size={60} source={{ uri: doctorInfo.image }} />
                        <View style={styles.personalInfo}>
                            <Text style={styles.name}>{doctorInfo.first_name}</Text>
                            <Text style={styles.infoTitle}>{doctorInfo.last_name}</Text>
                        </View>
                    </View>

                    <View style={styles.contacts}>
                        <TouchableOpacity onPress={() => smsDoctor(doctorInfo.phone_number)} style={styles.sms}>
                            <Icon5 name="sms" size={22} style={styles.callBtn} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => callDoctor(doctorInfo.phone_number)} style={styles.sms}>
                            <Icon5 name="phone-alt" size={22} style={styles.callBtn} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.fcontainer}>
                    <View>
                        <Text style={styles.pickDate}>Select date</Text>
                        <CustomCalendar onDaySelect={(day: any) => setPatientAppointmentDate(day)} />
                    </View>
                    <View>
                        <Text style={styles.pickDate}>Select time</Text>
                        <View style={{ margin: 0, flexDirection: 'row' }}>
                            {
                                hours.map((hour) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.types, appointmentTime == hour ? { backgroundColor: configs.colors.danger, borderColor: configs.colors.danger } : { backgroundColor: configs.colors.silver, borderColor: configs.colors.silver }]}
                                            onPress={() => setAppointmentTime(hour)}
                                            key={hour}>
                                            <Text style={[styles.hrText, appointmentTime == hour ? { color: configs.colors.white } : { color: configs.colors.dark }]}>{hour}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                    </View>

                    <View>
                        <Text style={styles.pickDate}>Type</Text>
                        {
                            appointmentTypes.map(({ id, name }: { id: number, name: string }) => {
                                return (
                                    <View style={{ flexDirection: 'row', marginHorizontal: 1 }} key={id}>
                                        <RadioButton
                                            value={name}
                                            status={appointmentType === name ? 'checked' : 'unchecked'}
                                            onPress={() => setAppointmentType(name)}
                                            color={configs.colors.danger}
                                        />
                                        <Text style={{ color: configs.colors.gray, fontSize: 18 }}>{name}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>

                    <View style={{ marginHorizontal: 0, marginVertical: 0 }}>
                        <Text style={styles.pickDate}>Symptoms</Text>
                        <TextInput
                            editable
                            value={symptoms}
                            onChangeText={text => setSymptoms(text)}
                            multiline={true}
                            numberOfLines={3}
                            style={{
                                borderColor: isFocused ? configs.colors.primary : configs.colors.gray,
                                height: 80,
                                borderWidth: 1,
                                borderRadius: 4,
                                marginVertical: 3,
                                padding: 8,
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </View>

                </View>


                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => confirmAppointment()}
                        style={[configs.styles.secondaryBtn, { width: screen.width * 0.9 }]}>
                        <Text style={styles.confirmText}>Book now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}

export default ScheduleAppointmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: configs.colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        marginVertical: 5,
        marginHorizontal: 8,
        borderRadius: 10,
        backgroundColor: configs.colors.white,
        padding: 10,
        elevation: 5
    },

    scroll: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: configs.colors.white,
    },

    header: {
        flexDirection: 'row',
        backgroundColor: configs.colors.white,
        borderRadius: 5,
    },

    body: {
        flex: 4
    },

    footer: {
        flex: 1,
        marginVertical: 5
    },

    name: {
        color: configs.colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    doctorInfo: {
        flexDirection: 'row',
    },

    personalInfo: {
        paddingHorizontal: 10,
        top: 3,
        marginLeft: 5,
    },

    infoTitle: {
        color: configs.colors.black,
        fontSize: 16,
        opacity: 0.6
    },


    button: {
        backgroundColor: configs.colors.primary,
        bottom: 50,
        position: 'absolute',
        paddingHorizontal: 80,
        paddingVertical: 18,
        borderRadius: 5,
    },


    confirmText: {
        fontSize: 18,
        color: configs.colors.primary,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },

    callBtn: {
        color: configs.colors.white,
        backgroundColor: configs.colors.primary,
        padding: 8,
        borderRadius: 3,
    },

    contacts: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    sms: {
        paddingLeft: 10,
    },

    pickDate: {
        fontSize: 18,
        paddingVertical: 5,
        marginLeft: 2,
    },

    fcontainer: {
        flex: 1,
        backgroundColor: configs.colors.white
    },

    types: {
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#bbb',
        padding: 10,
        borderRadius: 3,
        backgroundColor: configs.colors.white
    },


    hrText: {
        fontSize: 16,
        fontWeight: '400',
    },

    symptomText: {
        fontSize: 16,
        fontWeight: '400',
    },
});