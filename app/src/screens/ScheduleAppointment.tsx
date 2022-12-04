import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet, View, Text, Pressable, useWindowDimensions, TouchableOpacity
} from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';
import { ExpandableCalendar, Calendar, CalendarList, Agenda, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import Toast from 'react-native-simple-toast';
import { getCalendarTheme, themeColor, lightThemeColor } from '../configs/themes';

// const ITEMS: any[] = agendaItems;a

interface Props {
    weekView?: boolean;
}

interface DoctorSchedule {
    string: any
}

const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    let item = route.params;
    const { src, name, phoneNumber, title } = item;

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const calendarTheme = useRef(getCalendarTheme());
    const [appointmentDate, setAppointmentDate] = React.useState('');

    const [markedDates, setMarkedDates] = React.useState<DoctorSchedule>();


    const [routes] = React.useState([
        { key: 'appointment', title: 'Appointment' },
        { key: 'about', title: 'About' },
    ]);

    const setPatientAppointmentDate = (day: any) => {
        (day && day.dateString) && setAppointmentDate(day.dateString)
    }

    // const renderItem = useCallback(({item}: any) => {
    //     return <AgendaItem item={item}/>;
    //   }, []);

    useEffect(() => {
        const markedDates = {
            '2022-12-05': { selected: true, marked: false, selectedColor: configs.colors.primary },
            '2022-12-06': { selected: true, marked: false, selectedColor: configs.colors.primary },
            '2022-12-08': { selected: true, marked: false, selectedColor: configs.colors.primary, activeOpacity: 0 },
            '2022-12-10': { selected: true, marked: false, selectedColor: configs.colors.primary, disabled: true, disableTouchEvent: true }
        }
        setMarkedDates(markedDates);

    }, [])

    const FirstRoute = () => (
        <SafeAreaView style={styles.fcontainer}>
            <ScrollView style={styles.fscroll} contentContainerStyle={styles.fscrollcontainer}>
                <View>
                    <Text style={styles.pickDate}>Pick a day</Text>
                    <CalendarProvider 
                 date={'2022-12-04'}
                 showTodayButton>
                    <ExpandableCalendar
                        onDayPress={day => {
                            console.log('selected day', day);
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
                    {/* <Calendar
                        initialDate={'2022-12-01'}
                        minDate={'2022-01-10'}
                        maxDate={'2022-12-30'}
                        onDayPress={day => {
                            console.log('selected day', day);
                            setPatientAppointmentDate(day);
                        }}
                        onDayLongPress={day => {
                            console.log('selected day', day);
                        }}
                        monthFormat={'MMMM yyyy'}
                        onMonthChange={month => {
                            console.log('month changed', month);
                        }}
                        hideArrows={false}
                        hideExtraDays={true}
                        disableMonthChange={true}
                        firstDay={1}
                        hideDayNames={false}
                        showWeekNumbers={true}
                        onPressArrowLeft={subtractMonth => subtractMonth()}
                        onPressArrowRight={addMonth => addMonth()}
                        disableArrowLeft={false}
                        disableArrowRight={false}
                        disableAllTouchEventsForDisabledDays={true}
                        enableSwipeMonths={true}
                        leftArrowImageSource={configs.images.previous}
                        rightArrowImageSource={configs.images.next}
                        theme={calendarTheme.current}
                        markedDates={markedDates}
                    /> */}
                </View>

                <View>
                    <Text style={styles.pickDate}>Pick time</Text>

                </View>





            </ScrollView>
        </SafeAreaView>
    );

    const SecondRoute = () => (
        <View style={{ flex: 1, backgroundColor: configs.colors.white }}>
            <Text>Doctor's information will go here...</Text>
        </View>
    );

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: configs.colors.primary }}
            style={{ backgroundColor: configs.colors.white }}
            renderLabel={({ route, focused, color }) => (
                <Text style={styles.tabText}>
                    {route.title}
                </Text>
            )}
        />
    );

    const renderScene = SceneMap({
        appointment: FirstRoute,
        about: SecondRoute,
    });

    const confirmAppointment = () => {
        navigation.navigate(`AppointmentConfirmation`, item);
    }

    const callDoctor = (number: string) => {
        contact.callPhoneNumber(number);
    }

    const smsDoctor = (number: string) => {
        contact.SendSms(number);
    }

    const bookAppointment = () => {
        Toast.show(`Appointment date is ${appointmentDate}`);
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
                    {/* <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    /> */}
                    <FirstRoute/>
                </View>



                <View style={styles.footer}>
                    <Pressable style={[configs.styles.primaryBtn, configs.styles.bottomizedBtn]}
                        onPress={() => bookAppointment()}>
                        <Text style={styles.okayText}>book appointment</Text>
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
    }

})