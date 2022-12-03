import React from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet, View, Text, Pressable, useWindowDimensions, TouchableOpacity
} from 'react-native'
import { Avatar } from 'react-native-paper';
import * as configs from '../configs';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import * as contact from '../components/common/communications';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: configs.colors.white }}>
        <Text>Appointment info will go here...</Text>
    </View>
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: configs.colors.white }}>
        <Text>Doctor's information will go here...</Text>
    </View>
);

const ScheduleAppointmentScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    let item = route.params;
    const { src, name, phoneNumber, title } = item;

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'appointment', title: 'Appointment' },
        { key: 'about', title: 'About' },
    ]);

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
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>



                <View style={styles.footer}>
                    <Pressable style={[configs.styles.primaryBtn, configs.styles.bottomizedBtn]} onPress={() => confirmAppointment()}>
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
        marginLeft:5,
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
    }

})