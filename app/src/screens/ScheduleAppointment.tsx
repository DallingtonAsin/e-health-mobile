import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import Toast from 'react-native-simple-toast';
import { getCalendarTheme } from '../configs/themes';
import { TextInput } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import MultiSelect from 'react-native-multiple-select';

let defaultDateState = { selected: true, marked: false, disabled: false, selectedColor: configs.colors.gray }
const screen = Dimensions.get('screen');

const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    let item = route.params;
    const { src, name, phoneNumber, title } = item;

    const workingHours = ['08:00', '10:00', '12:00', '14:00', '15:00', '18:00', '10:30', '12:30', '14:30', '15:30', '19:30'];
    const commonSymptoms = ['cold', 'cough', 'flue', 'Nasal congestion', 'Sore throat', 'Allergies', 'Rash', 'Other'];
    const contactTypes = ['In person', 'Audio Call', 'Video Session'];

    let doctorSchedule = {
        '2022-12-05': defaultDateState,
        '2022-12-07': defaultDateState,
        '2022-12-08': defaultDateState,
        '2022-12-10': defaultDateState
    }

    const calendarTheme = useRef(getCalendarTheme());

    const [hours, setHours] = useState<string[]>(workingHours);
    const [symptoms, setSymptoms] = useState<string[]>(commonSymptoms);
    const [types, setTypes] = useState<string[]>(contactTypes)

    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [appointmentHour, setAppointmentHour] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<string>('');
    const [patientSymptoms, setPatientSymptoms] = useState<string[]>([]);
    const [otherSymptoms, setOtherSymptoms] = useState('');
    const [hasOtherSymptoms, setHasOtherSymptoms] = useState(false);

    const [markedDates, setMarkedDates] = useState<any>();

    const setPatientAppointmentDate = (day: any) => {
        if (day && day.dateString) {
            setAppointmentDate(day.dateString)
        }else{
            console.log(`No day captured`);
        }
    }

    const addOrRemoveSymptom = (symptom: string) => {

        if (!patientSymptoms.includes(symptom)) {
            setPatientSymptoms(prevSymptoms => [
                ...prevSymptoms,
                symptom,
            ]);
        } else {
            removeSymptom(symptom)
        }
    }

    const removeSymptom = (symptom: string) => {
        var array = patientSymptoms;
        var index = array.indexOf(symptom)
        if (index !== -1) {
            array.splice(index, 1);
            setPatientSymptoms(array);
        }
    }

    const callDoctor = (number: string) => {
        contact.callPhoneNumber(number);
    }

    const smsDoctor = (number: string) => {
        contact.SendSms(number);
    }

    const confirmAppointment = () => {
        // if(!appointmentDate){
        //     Toast.show(`Please select appointment date`); return;
        // }

        // if(!appointmentHour){
        //     Toast.show(`Please select appointment hour`); return;
        // } 
        // if(!appointmentType){
        //     Toast.show(`Please select appointment type`); return;
        // }
        // if(patientSymptoms.length < 0){
        //     Toast.show(`Please select atleast one symptom`); return;
        // }
        // if (appointmentDate && appointmentHour && appointmentType && patientSymptoms.length > 0) {
        //     navigation.navigate('AppointmentConfirmation');
        // }
        navigation.navigate('AppointmentConfirmation', {
            src: src, name: name, phoneNumber: phoneNumber, title:title
        });
    }

    const AppointmentScreen = () => (
        <SafeAreaView style={styles.fcontainer}>
                <View>
                    <Text style={styles.pickDate}>Pick a day</Text>
                    <CalendarProvider
                        date={new Date().toDateString()}
                        showTodayButton={false}>
                        <ExpandableCalendar
                            onDayPress={day => {
                                setPatientAppointmentDate(day);
                            }}
                            // firstDay={1}
                            leftArrowImageSource={configs.images.previous}
                            rightArrowImageSource={configs.images.next}
                            theme={calendarTheme.current}
                            hideDayNames={false}
                            disablePan={false}
                            hideKnob={true}
                            markedDates={markedDates}
                            // initialPosition={"open"}
                            allowShadow={true}
                            disabledByDefault={true}
                            disableAllTouchEventsForDisabledDays={true}
                        />
                    </CalendarProvider>
                </View>
                <View>
                    <Text style={styles.pickDate}>Pick time</Text>
                    <View style={{ margin: 0, flexDirection: 'row' }}>
                            {
                                hours.map((hour) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.types, appointmentHour == hour ? { backgroundColor: configs.colors.danger, borderColor: configs.colors.danger } : { backgroundColor: configs.colors.silver, borderColor: configs.colors.silver }]}
                                            onPress={() => setAppointmentHour(hour)}
                                            key={hour}>
                                            <Text style={[styles.hrText, appointmentHour == hour ? { color: configs.colors.white } : { color: configs.colors.dark }]}>{hour}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                    </View>
                </View>

                <View>
                    <Text style={styles.pickDate}>Type</Text>
                    {
                        types.map((type: any) => {
                            return (
                                <View style={{ flexDirection: 'row', marginHorizontal: 1 }}>
                                    <RadioButton
                                        value={type}
                                        status={appointmentType === type ? 'checked' : 'unchecked'}
                                        onPress={() => setAppointmentType(type)}
                                        color={configs.colors.danger}
                                        key={type}
                                    />
                                    <Text style={{ color: configs.colors.gray, fontSize: 18 }}>{type}</Text>
                                </View>
                            )
                        })
                    }
                </View>

                <ScrollView horizontal={true}> 
                    <View>
                    <Text style={styles.pickDate}>Symptoms</Text>
                            {/* {
                                symptoms.map((symptom) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.symptoms, patientSymptoms.includes(symptom) ? { backgroundColor: configs.colors.silver, borderColor: configs.colors.silver } : { backgroundColor: configs.colors.white, borderColor: configs.colors.silver }]}
                                            onPress={() => addOrRemoveSymptom(symptom)}
                                            key={symptom}>
                                            <Text style={[styles.symptomText, patientSymptoms.includes(symptom) ? { color: configs.colors.white } : { color: configs.colors.gray }]}>{symptom}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            } */}
                    </View>
                    </ScrollView>

                {hasOtherSymptoms && <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                    <Text style={{ fontSize: 16 }}>Describe your other symptoms</Text>
                    <TextInput
                        value={otherSymptoms}
                        onChangeText={text => setOtherSymptoms(text)}
                        multiline={true}
                        mode="outlined"
                        numberOfLines={7}
                    />
                </View>
                }
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                >
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
                    <TouchableOpacity onPress={() => confirmAppointment()}
                    style={[configs.styles.secondaryBtn, {width: screen.width*0.9}]}>
                        <Text style={styles.okayText}>Book now</Text>
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


    okayText: {
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
        paddingLeft: 10,
    },

    pickDate: {
        fontSize: 18,
        paddingVertical: 15,
        marginLeft: 15,
    },

    fcontainer: {
        flex: 1,
        backgroundColor: configs.colors.white
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
        padding: 8,
        borderRadius: 5,
        backgroundColor: configs.colors.white,
        width: '40%',
        alignItems: 'center',
        marginVertical: 5,
    },

    hrText: {
        fontSize: 16,
        fontWeight: '400',
    },

    symptomText: {
        fontSize: 16,
        fontWeight: '400',
    },

    symptomsContainer: {
        margin: 0,
        flexDirection: 'row',
        paddingRight: 10,
        flex: 1,
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: configs.colors.primary,
        alignItems: 'flex-start'
    }
});