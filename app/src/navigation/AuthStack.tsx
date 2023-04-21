import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "../screens/SplashScreen";
import SigninScreen from "../screens/SigninScreen";
import OtpScreen from "../screens/OtpScreen";
import PatientRegistrationScreen from "../screens/Patient/RegistrationScreen";
import DoctorRegistrationScreen from '../screens/Doctor/RegistrationScreen';

const Stack = createNativeStackNavigator();

const AuthStack= () => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Signin"
                component={SigninScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="OTP"
                component={OtpScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="PatientRegistration"
                component={PatientRegistrationScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="DoctorRegistration"
                component={DoctorRegistrationScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    )
}

export default AuthStack;