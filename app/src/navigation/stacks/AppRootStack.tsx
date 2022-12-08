import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabStack from "./BottomTabStack";
import CustomStackHeader from "../../components/CustomStackHeader";
import { Provider as PaperProvider } from 'react-native-paper';
import * as configs from '../../configs';
import SpecialityCategoryScreen from '../../screens/SpecialityCategoryScreen';
import SpecialityListScreen from "../../screens/SpecialityListScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import SplashScreen from "../../screens/SplashScreen";
import SigninScreen from "../../screens/SigninScreen";
import OtpScreen from "../../screens/OtpScreen";
import SignupScreen from "../../screens/SignupScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import AppointmentConfirmationScreen from "../../screens/AppointmentConfirmationScreen";
import MeetingRoomScreen from "../../screens/MeetingRoomScreen";
import ScheduleAppointmentScreen from "../../screens/ScheduleAppointment";
import MedicalRecordScreen from "../../screens/MedicalRecordScreen";
import MyAppointmentScreen from "../../screens/MyAppointmentScreen";


const Stack = createNativeStackNavigator();


const AppRootStack = () => {

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator>

                    <Stack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Signin"
                        component={SigninScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Register"
                        component={SignupScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="OTP"
                        component={OtpScreen}
                        options={

                            {

                                headerStyle: {
                                    backgroundColor: configs.colors.white,

                                },
                                headerTintColor: configs.colors.primary,
                                headerTitle: `Enter verification code`,
                                headerBackVisible: true,
                                headerShown: true,
                                header: (props) => (<CustomStackHeader title="Enter verification code" />)

                            }}
                    />

                    <Stack.Screen
                        name="Home"
                        component={BottomTabStack}
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
                            headerTitle: `Specialist Categories`,
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
                            headerTitle: `My Appointments`,
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

            </NavigationContainer>

        </PaperProvider>
    )
}

export default AppRootStack;