import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Avatar as AvatarRP, TextInput } from 'react-native-paper';
import Avatar from '../components/Avatar';
import * as configs from '../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';
import { RadioButton } from 'react-native-paper';
import { AppointmentInfo, DoctorsDetail } from '../interfaces';
import { Context as AppContext } from '../context/appContext';
import { Context as AuthContext } from '../context/authContext';
import { Context as PatientContext } from '../context/patientContext';
import { Context as DoctorContext } from '../context/doctorContext';
import { initialDoctorInfo } from '../configs/constants';
import { displayMessage, getCurrentDate, getUserInitials } from '../components/common/SharedHelper';
import AppLoader from '../components/AppLoader';
import { AppointmentType } from '../interfaces';
import Toast from 'react-native-simple-toast';
import { Calendar } from 'react-native-calendars';
import { CustomDay } from '../components/CustomDay';

const screen = Dimensions.get('screen');

const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { doctor_id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAppointmentTypeLoading, setAppointmentTypeLoading] = useState(true);

    const currentDate = getCurrentDate()
    const [appointmentDate, setAppointmentDate] = useState<string>(currentDate);
    const [appointmentTime, setAppointmentTime] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<string>('');

    const [reason, setReason] = useState('');
    const [pastMedicalHistory, setPastMedicalHistory] = useState('');
    const [currentTreatment, setCurrentTreatment] = useState('');

    const { state } = useContext(AuthContext);
    const { getAppointmentTypes } = useContext(AppContext);
    const { submitAppointment } = useContext(PatientContext);
    const { getDoctorInfo } = useContext(DoctorContext);

    const user = state.user;
    const [isFocused, setIsFocused] = useState(false);

    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
    const [doctorInfo, setDoctorInfo] = useState<DoctorsDetail>(initialDoctorInfo);
    const [schedule, setSchedule] = useState<any>();
    const [scheduleDates, setScheduleDates] = useState<any>();
    const [scheduleHours, setScheduleHours] = useState<string[]>([]);

    useEffect(() => {
        getDoctorInfo({ doctorId: doctor_id, onSuccess: populateDoctorInfo, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });
        getAppointmentTypes({ onSuccess: populateAppointmentTypes, onFailure: displayMessage, onCompletion: () => { setAppointmentTypeLoading(false) } });
    }, []);

    const populateDoctorInfo = (doctorInfo: DoctorsDetail) => {
        setDoctorInfo(doctorInfo);
        if (doctorInfo.schedule_dates && doctorInfo.schedule_dates.length > 0) {
            const initialDate = doctorInfo.schedule_dates[0]
            setScheduleDates(doctorInfo.schedule_dates);
            setAppointmentDate(initialDate)
            if (doctorInfo.schedule) {
                const doc_schedule: any = doctorInfo.schedule
                setSchedule(doc_schedule);
                setScheduleHours(doc_schedule[`${initialDate}`]);
            }
        }
    }

    const populateAppointmentTypes = (types: AppointmentType[]) => {
        setAppointmentTypes(types);
    }

    const setPatientAppointmentDate = (day: any) => {
        let date = day.dateString;
        setScheduleHours(schedule[date]);
        setAppointmentTime('');
        setAppointmentDate(date);
    }


    const AppointmentsCalendar = (props: any) => {
        return (
            <Calendar
                initialDate={currentDate}
                minDate={currentDate}
                onPress={setPatientAppointmentDate}
                dayComponent={({ date }: { date: any }) => {
                    return <CustomDay date={date} selected={appointmentDate === date.dateString}
                        onPress={() => setPatientAppointmentDate(date)} scheduleDates={scheduleDates} />;
                }}
                disableAllTouchEventsForDisabledDays={true}
                {...props}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e',
                }}
                style={{
                    borderWidth: 1,
                    borderColor: configs.colors.silver,
                    borderRadius: 5,
                }}
            />
        );
    }

    const confirmAppointment = () => {
        if (!appointmentDate) {
            displayMessage(`Please select appointment date`); return;
        }

        if (!appointmentTime) {
            displayMessage(`Please select appointment hour`); return;
        }
        if (!appointmentType) {
            displayMessage(`Please select appointment type`); return;
        }
        if (!reason) {
            displayMessage(`Please enter reason for appointment`); return;
        }
        if (appointmentDate && appointmentTime && appointmentType && reason) {
            let appointmentDetails: AppointmentInfo = {
                patient_id: user.id,
                doctor_id: doctor_id,
                appointment_type: appointmentType,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                reason: reason,
                past_medical_history: pastMedicalHistory,
                current_treatment: currentTreatment
            };
            setIsSubmitting(true);
            submitAppointment({ payload: appointmentDetails, onSuccess: displaySuccessScreen, onFailure: displayMessage, onCompletion: () => { setIsSubmitting(false) } });
        }

    }

    const resetAppointmentInfo = () => {
        setAppointmentDate('');
        setAppointmentTime('');
        setAppointmentType('');
        setReason('');
    }

    const displaySuccessScreen = (appointmentDetails: any) => {
        resetAppointmentInfo();
        navigation.navigate('AppointmentConfirmation', {
            doctor: doctorInfo,
            appointmentInfo: appointmentDetails
        });
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

    if (isLoading || isAppointmentTypeLoading) {
        return (
            <AppLoader bgColor={configs.colors.white} />
        )
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>

                    <View style={styles.header}>
                        <View style={styles.doctorInfo}>
                            {doctorInfo.image
                                ? <Avatar size={60} source={doctorInfo.image} />
                                : <AvatarRP.Text size={60} label={getUserInitials(`${doctorInfo.first_name} ${doctorInfo.last_name}`)}
                                    style={[configs.styles.userAvatar, { borderWidth: 0.5, borderColor: configs.colors.gray }]} />
                            }
                            <View style={styles.personalInfo}>
                                <Text style={styles.infoTitle}>{doctorInfo.first_name}</Text>
                                <Text style={styles.infoTitle}>{doctorInfo.last_name}</Text>
                            </View>
                        </View>

                        <View style={configs.styles.contacts}>
                            <TouchableOpacity onPress={() => callDoctor()} style={configs.styles.callBtn}>
                                <Icon5 name="phone-alt" size={18} color={configs.colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => textDoctor()} style={configs.styles.callBtn}>
                                <Icon name="envelope" size={18} color={configs.colors.white} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.fcontainer}>
                        <View>
                            <Text style={styles.titleText}>Select date <Text style={{ color: configs.colors.danger }}>*</Text></Text>
                            <AppointmentsCalendar onDaySelect={(day: any) => setPatientAppointmentDate(day)} />
                        </View>
                        <View>
                            <Text style={styles.titleText}>Select time <Text style={{ color: configs.colors.danger }}>*</Text></Text>
                            <ScrollView contentContainerStyle={{ flexDirection: 'row' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {
                                    scheduleHours.map((hour) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={[styles.types, appointmentTime == hour ? { backgroundColor: configs.colors.primary, borderColor: configs.colors.primary } : { backgroundColor: configs.colors.silver, borderColor: configs.colors.silver }]}
                                                onPress={() => setAppointmentTime(hour)}
                                                key={hour}>
                                                <Text style={[styles.hrText, appointmentTime == hour ? { color: configs.colors.white } : { color: configs.colors.dark }]}>{hour}</Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                            </ScrollView>
                        </View>

                        <View>
                            <Text style={styles.titleText}>Choose appointment type <Text style={{ color: configs.colors.danger }}>*</Text></Text>
                            <RadioButton.Group onValueChange={newValue => setAppointmentType(newValue)} value={appointmentType}>
                                {appointmentTypes.map(({ id, name }: { id: number, name: string }) => {
                                    return (
                                        <View style={{ flexDirection: 'row' }} key={id}>
                                            <RadioButton value={name} color={configs.colors.primary} />
                                            <Text style={{ color: configs.colors.gray, fontSize: configs.fonts.large, marginTop: 5 }}>{name}</Text>
                                        </View>
                                    );
                                })
                                }
                            </RadioButton.Group>
                        </View>

                        <View>
                            <Text style={styles.titleText}>Reason for appointment <Text style={{ color: configs.colors.danger }}>*</Text></Text>

                            <TextInput
                                editable
                                label={"Reason for appointment"}
                                mode="outlined"
                                value={reason}
                                onChangeText={text => setReason(text)}
                                multiline={true}
                                numberOfLines={3}
                                activeOutlineColor={configs.colors.primary}
                                style={configs.styles.registration.doctor.textInput}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={""}
                            />
                        </View>

                        <View>
                            <Text style={styles.titleText}>Past medical history</Text>
                            <TextInput
                                editable
                                mode="outlined"
                                label={"Medical History"}
                                value={pastMedicalHistory}
                                onChangeText={text => setPastMedicalHistory(text)}
                                multiline={true}
                                numberOfLines={3}
                                activeOutlineColor={configs.colors.primary}
                                style={configs.styles.registration.doctor.textInput}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={""}
                            />
                        </View>

                        <View>
                            <Text style={styles.titleText}>Current treatment</Text>
                            <TextInput
                                editable
                                label={"Current treatment"}
                                mode="outlined"
                                value={currentTreatment}
                                onChangeText={text => setCurrentTreatment(text)}
                                multiline={true}
                                numberOfLines={3}
                                activeOutlineColor={configs.colors.primary}
                                style={configs.styles.registration.doctor.textInput}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={""}
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

            {isSubmitting && <AppLoader />}

        </>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: configs.colors.white,
        borderRadius: 5,
    },

    body: {
        flex: 4
    },

    footer: {
        flex: 1,
        marginTop: 15
    },

    name: {
        color: configs.colors.black,
        fontSize: 18,
        // fontWeight: 'bold'
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
        fontSize: configs.fonts.extraLarge,
        color: configs.colors.primary,
        // fontWeight: '500'
    },

    titleText: {
        fontSize: configs.fonts.large,
        paddingVertical: 4,
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
        // fontSize: 16,
        // fontWeight: '400',
    },

    symptomText: {
        // fontSize: 16,
        // fontWeight: '400',
    },

    textarea: {
        height: 80,
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 3,
        padding: 8,
        textAlignVertical: 'top',
        borderColor: configs.colors.silver
    }

});