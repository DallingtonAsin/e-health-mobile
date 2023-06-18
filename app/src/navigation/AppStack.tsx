import React, { useContext } from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SpecialityCategoryScreen from '../screens/MedicalSpecialtyScreen'
import SpecialityListScreen from "../screens/MedicalDoctorsScreen"
import ContactUsScreen from "../screens/ContactUsScreen"
import ProfileScreen from "../screens/ProfileScreen"
import ScheduleAppointmentScreen from "../screens/ScheduleAppointment"
import AppointmentConfirmationScreen from "../screens/AppointmentConfirmationScreen"
import MyAppointmentScreen from "../screens/MyAppointmentScreen"
import AppointmentDetailsScreen from "../screens/AppointmentDetailsScreen"
import MedicalRecordScreen from "../screens/MedicalRecordScreen"
import NotificationScreen from "../screens/NotificationScreen"
import MedicalHistoryScreen from "../screens/MedicalHistoryScreen"
import MyScheduleScreen from "../screens/Doctor/MyScheduleScreen"
import DrugScreen from "../screens/DrugScreen"
import DrugDetailsScreen from "../screens/DrugDetailsScreen"
import { TermsConditionScreen, AboutUsScreen, SettingsScreen } from "../screens/Common/index"
import CartIcon from "../screens/Common/CartIcon"
import CartScreen from "../screens/CartScreen"
import CompleteConsultationScreen from "../screens/Doctor/CompleteConsultationScreen"
import TabNavigator from "./TabNavigator"
import CompleteRegistrationScreen from "../screens/Doctor/CompleteRegistrationScreen"
import HomeScreen from "../screens/HomeScreen"
import SpecialitiesListScreen from '../screens/MedicalDoctorsScreen'
import { Context as AuthContext } from '../context/authContext'
import * as configs from '../configs'
import DoctorProfileScreen from "../screens/Doctor/DoctorProfileScreen"

const Stack = createNativeStackNavigator()


const AppStackScreen = () => {

    const { state } = useContext(AuthContext)
    const user = state.user

    return (

        <Stack.Navigator>

            <Stack.Screen
                name="Home"
                component={user.is_registered ? TabNavigator : HomeScreen}
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
                    headerTitle: `Specialties`,
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
                    headerTitle: `Doctors & Specialties`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={SpecialityListScreen} />

            <Stack.Screen
                name="MedicalSpecialitiesList"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Doctors & Specialties`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={SpecialitiesListScreen} />

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
                        backgroundColor: configs.colors.primary,
                    },
                    headerTintColor: configs.colors.white,
                    headerTitle: `Profile`,
                    headerBackVisible: false,
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="DoctorProfile"
                component={DoctorProfileScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.primary,
                    },
                    headerTintColor: configs.colors.white,
                    headerTitle: `Doctor Profile`,
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
                    headerTitle: `My Appointments`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="AppointmentDetails"
                component={AppointmentDetailsScreen}
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Appointment Details`,
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
                    headerTitle: `Help`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={ContactUsScreen}
            />

            <Stack.Screen
                name="AppointmentConfirmation"
                options={{ headerShown: false }}
                component={AppointmentConfirmationScreen}
            />

            <Stack.Screen
                name="ScheduleAppointment"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Book your Appointment`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={ScheduleAppointmentScreen}
            />

            <Stack.Screen
                name="CompleteAppointment"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Complete Consultation`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={CompleteConsultationScreen}
            />

            <Stack.Screen
                name="Pharmacy"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Pharmacy`,
                    headerBackVisible: true,
                    headerShown: true,
                    headerRight: () => <CartIcon />,
                }}
                component={DrugScreen}
            />

            <Stack.Screen
                name="DrugDetails"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Details`,
                    headerBackVisible: true,
                    headerShown: true,
                    headerRight: () => <CartIcon />,
                }}
                component={DrugDetailsScreen}
            />

            <Stack.Screen
                name="Cart"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Cart`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={CartScreen}
            />


            <Stack.Screen
                name="DoctorsCalendar"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `My Calendar`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={MyScheduleScreen} />

            <Stack.Screen
                name="TermsConditions"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Terms and Condtions`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={TermsConditionScreen} />

            <Stack.Screen
                name="AboutUs"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `About Us`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={AboutUsScreen} />


            <Stack.Screen
                name="Settings"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Settings`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={SettingsScreen} />

            <Stack.Screen
                name="MedicalHistory"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Medical History`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={MedicalHistoryScreen} />

            <Stack.Screen
                name="CompleteRegistration"
                options={{
                    headerStyle: {
                        backgroundColor: configs.colors.white,
                    },
                    headerTintColor: configs.colors.primary,
                    headerTitle: `Complete Profile`,
                    headerBackVisible: true,
                    headerShown: true,
                }}
                component={CompleteRegistrationScreen}
            />

        </Stack.Navigator>
    )
}

export default AppStackScreen