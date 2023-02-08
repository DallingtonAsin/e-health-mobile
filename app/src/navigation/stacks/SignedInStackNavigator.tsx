import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from "./HomeStack";
import * as configs from '../../configs';
import SpecialityCategoryScreen from '../../screens/MedicalSpecialtyScreen';
import SpecialityListScreen from "../../screens/MedicalDoctorsScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import SignupScreen from "../../screens/SignupScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import AppointmentConfirmationScreen from "../../screens/AppointmentConfirmationScreen";
import MeetingRoomScreen from "../../screens/MeetingRoomScreen";
import ScheduleAppointmentScreen from "../../screens/ScheduleAppointment";
import MedicalRecordScreen from "../../screens/MedicalRecordScreen";
import MyAppointmentScreen from "../../screens/MyAppointmentScreen";
import NotificationScreen from "../../screens/NotificationScreen";


const Stack = createNativeStackNavigator();


const SignedInStackNavigator = () => {

    return (

        <Stack.Navigator>

            <Stack.Screen
                name="Home"
                component={HomeStack}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="SpecialityCategories"
                component={SpecialityCategoryScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Speciality`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="SpecialitiesList"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `List of specialists`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={SpecialityListScreen} />

            <Stack.Screen
                name="Notifications"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Notifications`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={NotificationScreen} />

            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Profile`,
                    headerBackVisible: false,
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="MedicalRecords"
                component={MedicalRecordScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Medical Record History`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="MyAppointments"
                component={MyAppointmentScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Appointments`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="ContactUs"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Contact Us`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={ContactUsScreen} />

            <Stack.Screen
                name="AppointmentConfirmation"
                options={{ headerShown: false }}
                component={AppointmentConfirmationScreen}
            />

            <Stack.Screen
                name="MeetingRoom"
                options={{ headerShown: false }}
                component={MeetingRoomScreen}
            />

            <Stack.Screen
                name="ScheduleAppointment"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Schedule Appointment`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={ScheduleAppointmentScreen} />

        </Stack.Navigator>
    )
}

export default SignedInStackNavigator;