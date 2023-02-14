import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomStackHeader from "../../components/CustomStackHeader";
import * as configs from '../../configs';
import SplashScreen from "../../screens/SplashScreen";
import SigninScreen from "../../screens/SigninScreen";
import OtpScreen from "../../screens/OtpScreen";
import PatientRegistrationScreen from "../../screens/Patient/RegistrationScreen";
import DoctorRegistrationScreen from '../../screens/Doctor/RegistrationScreen';

const AuthStack = createNativeStackNavigator();

const AuthFlow = () => {

    return (
        <AuthStack.Navigator>

            <AuthStack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="Signin"
                component={SigninScreen}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="OTP"
                component={OtpScreen}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="PatientRegistration"
                component={PatientRegistrationScreen}
                options={{ headerShown: false }}
            />

            <AuthStack.Screen
                name="DoctorRegistration"
                component={DoctorRegistrationScreen}
                options={{ headerShown: false }}
            />

        </AuthStack.Navigator>
    )
}

export default AuthFlow;