import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SpecialityCategoryScreen from '../../screens/SpecialityCategoryScreen';
import SpecialityListScreen from "../../screens/SpecialityListScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";
import SplashScreen from "../../screens/SplashScreen";
import * as colors from '../../configs/colors';
import AppointmentConfirmationScreen from "../../screens/AppointmentConfirmationScreen";
import MeetingRoomScreen from "../../screens/MeetingRoomScreen";
import ScheduleAppointmentScreen from "../../screens/ScheduleAppointment";
import Toast from 'react-native-simple-toast';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabStack from "./BottomTabStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const AppRootStack = () => {

    return (
        <>

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
                                backgroundColor: colors.default.white,
                            },
                            headerTintColor: colors.default.primary,
                            headerTitle: `Specialist Categories`,
                            headerBackVisible: true,
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="SpecialitiesList"
                        options={{
                            headerStyle: {
                                backgroundColor: colors.default.white,
                            },
                            headerTintColor: colors.default.primary,
                            headerTitle: `List of specialists`,
                            headerBackVisible: true,
                            headerShown: true,
                        }}
                        component={SpecialityListScreen} />


                    <Stack.Screen
                        name="ContactUs"
                        options={{
                            headerStyle: {
                                backgroundColor: colors.default.white,
                            },
                            headerTintColor: colors.default.primary,
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
                                backgroundColor: colors.default.white,
                            },
                            headerTintColor: colors.default.primary,
                            headerTitle: `Schedule Appointment`,
                            headerBackVisible: true,
                            headerShown: true,
                        }}
                        component={ScheduleAppointmentScreen} />

                </Stack.Navigator>

            </NavigationContainer>

        </>
    )
}

export default AppRootStack;