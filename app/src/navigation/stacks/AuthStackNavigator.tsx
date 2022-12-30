import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomStackHeader from "../../components/CustomStackHeader";
import * as configs from '../../configs';
import SplashScreen from "../../screens/SplashScreen";
import SigninScreen from "../../screens/SigninScreen";
import OtpScreen from "../../screens/OtpScreen";
import SignupScreen from "../../screens/SignupScreen";

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {

    return (
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
                        name="Register"
                        component={SignupScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                </Stack.Navigator>
    )
}

export default AuthStackNavigator;