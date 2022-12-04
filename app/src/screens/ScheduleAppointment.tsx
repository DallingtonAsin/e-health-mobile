import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet, View, Text, Pressable, TouchableOpacity, FlatList
} from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import Toast from 'react-native-simple-toast';
import { getCalendarTheme } from '../configs/themes';
import RadioButtonRN from 'radio-buttons-react-native';


const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    let item = route.params;
    const { src, name, phoneNumber, title } = item;


    const calendarTheme = useRef(getCalendarTheme());
    const [appointmentDate, setAppointmentDate] = React.useState('');
    const [appointmentHour, setAppointmentHour] = React.useState('');
    const [appointmentType, setAppointmentType] = useState('');

    const [markedDates, setMarkedDates] = React.useState();
    const hours = ['08:00', '10:00', '12:00', '14:00', '15:00', '18:00', '10:30', '12:30', '14:30', '15:30', '19:30'];
    const symptoms = ['cold', 'cough', 'Influenza (flue)', 'Nasal congestion', 'Sore throat', 'Allergies', 'Rash', 'Other'];


    const data = [{ label: 'In person' }, { label: 'Audio Call' }, { label: 'Video Session' }];
    const doctorDates = {
        '2022-12-05': { selected: true, marked: false, selectedColor: configs.colors.primary },
        '2022-12-06': { selected: true, marked: false, selectedColor: configs.colors.primary },
        '2022-12-08': { selected: true, marked: false, selectedColor: configs.colors.primary, activeOpacity: 0 },
        '2022-12-10': { selected: true, marked: false, selectedColor: configs.colors.primary, disabled: true, disableTouchEvent: true }
    }

    useEffect(() => {
        setMarkedDates(doctorDates);
    }, []);


    const setPatientAppointmentDate = (day: any) => {
        (day && day.dateString) && setAppointmentDate(day.dateString)
    }

    const AppointmentScreen = () => (
        <SafeAreaView style={styles.fcontainer}>
            <ScrollView style={styles.fscroll} contentContainerStyle={styles.fscrollcontainer}>

            <View>
                    <Text style={styles.pickDate}>Symptoms</Text>
                    <View style={{ margin: 0, flexDirection: 'row' }}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            contentContainerStyle={{ margin: 5, flexDirection: 'row', paddingRight: 10 }}>
                            {
                                symptoms.map((symptom) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.symptoms, appointmentHour == symptom ? { backgroundColor: configs.colors.primary, borderColor: configs.colors.primary } : { backgroundColor: configs.colors.white, borderColor: configs.colors.silver }]}
                                            onPress={() => setAppointmentHour(symptom)}
                                            key={symptom}>
                                            <Text style={[styles.hrText, appointmentHour == symptom ? { color: configs.colors.white } : { color: configs.colors.dark }]}>{symptom}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>

                <View>
                    <Text style={styles.pickDate}>Pick a day</Text>
                    <CalendarProvider
                        date={'2022-12-04'}
                        showTodayButton>
                        <ExpandableCalendar
                            onDayPress={day => {
                                setPatientAppointmentDate(day);
                            }}
                            firstDay={1}
                            leftArrowImageSource={configs.images.previous}
                            rightArrowImageSource={configs.images.next}
                            theme={calendarTheme.current}
                            hideDayNames={false}
                            disablePan={true}
                            hideKnob={true}
                            markedDates={markedDates}
                        />
                    </CalendarProvider>
                </View>

                <View>
                    <Text style={styles.pickDate}>Pick time</Text>
                    <View style={{ margin: 0, flexDirection: 'row' }}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            contentContainerStyle={{ margin: 10, flexDirection: 'row', paddingRight: 10 }}>
                            {
                                hours.map((hour) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.types, appointmentHour == hour ? { backgroundColor: configs.colors.primary, borderColor: configs.colors.primary } : { backgroundColor: configs.colors.silver, borderColor: configs.colors.silver }]}
                                            onPress={() => setAppointmentHour(hour)}
                                            key={hour}>
                                            <Text style={[styles.hrText, appointmentHour == hour ? { color: configs.colors.white } : { color: configs.colors.dark }]}>{hour}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>

                <View>
                    <Text style={styles.pickDate}>Type</Text>
                    <RadioButtonRN
                        data={data}
                        selectedBtn={(e: any) => {
                            setAppointmentType(e?.label)
                        }}
                        box={false}
                        textStyle={{ fontSize: 18 }}
                        activeColor={configs.colors.primary}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );

    const callDoctor = (number: string) => {
        contact.callPhoneNumber(number);
    }

    const smsDoctor = (number: string) => {
        contact.SendSms(number);
    }

    const bookAppointment = () => {
        !appointmentDate && Toast.show(`Please select appointment date`);
        !appointmentHour && Toast.show(`Please select appointment hour`);
        !appointmentType && Toast.show(`Please select appointment type`);
        if (appointmentDate && appointmentHour && appointmentType) {
            Toast.show(`Your appointment details are ${appointmentDate}, ${appointmentHour} and type ${appointmentType}`)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <View style={styles.doctorInfo}>
                        <Avatar.Image size={60} source={{ uri: src }} />
                        <View style={styles.personalInfo}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.infoTitle}>{title}</Text>
                        </View>
                    </View>

                    <View style={styles.contacts}>
                        <TouchableOpacity onPress={() => smsDoctor(phoneNumber)} style={styles.sms}>
                            <Icon5 name="sms" size={22} style={styles.callBtn} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => callDoctor(phoneNumber)} style={styles.sms}>
                            <Icon5 name="phone-alt" size={22} style={styles.callBtn} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.body}>
                    <AppointmentScreen />
                </View>

                <View style={styles.footer}>
                    <Pressable style={[configs.styles.primaryBtn]}
                        onPress={() => bookAppointment()}>
                        <Text style={styles.okayText}>confirm</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    )

}

export default ScheduleAppointmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
    },

    body: {
        flex: 4,
        marginHorizontal: 5
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical:20,
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


    okayText: {
        fontSize: 18,
        color: configs.colors.white,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },

    callBtn: {
        color: configs.colors.white,
        backgroundColor: configs.colors.primary,
        padding: 8,
        borderRadius: 3,
    },

    tabText: {
        color: '#000',
        margin: 8,
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 0.6
    },

    contacts: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    sms: {
        left: 10,
        marginLeft: 10,
    },

    pickDate: {
        fontSize: 18,
        paddingVertical: 15,
        marginLeft: 15,
    },

    fcontainer: {
        flex: 1,
        backgroundColor: configs.colors.white,
        justifyContent: 'space-between'
    },

    fscroll: {
        flex: 1,
    },

    fscrollcontainer: {
        flexGrow: 1,
    },

    types: {
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#bbb',
        padding: 10,
        borderRadius: 3,
        backgroundColor: configs.colors.white
    },

    symptoms: {
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#bbb',
        padding: 15,
        borderRadius: 5,
        backgroundColor: configs.colors.white
    },

    hrText: {
        fontSize: 16,
        fontWeight: '400',
    }

})