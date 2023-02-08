import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomStackHeader from "../../components/CustomStackHeader";
import * as configs from '../../configs';
import SplashScreen from "../../screens/SplashScreen";
import SigninScreen from "../../screens/SigninScreen";
import OtpScreen from "../../screens/OtpScreen";
import SignupScreen from "../../screens/SignupScreen";

const AuthStack = createNativeStackNavigator();

const AuthFlow = () => {

    return (
                <AuthStack.Navigator>

                    <AuthStack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <AuthStack.Screen
                        name="Signin"
                        component={SigninScreen}
                        options={{
                            headerShown: false,
                        }}
                    /> 

                     <AuthStack.Screen
                        name="OTP"
                        component={OtpScreen}
                        options={

                            {

                                headerStyle: {
                                    backgroundColor: configs.colors.white,

                                },
                                headerTintColor: configs.colors.primary,
                                headerTitle: `Verify Phone Number`,
                                headerBackVisible: true,
                                headerShown: true,
                                header: (props) => (<CustomStackHeader title="Verify Phone Number" />)

                            }}
                    />

                    <AuthStack.Screen
                        name="Register"
                        component={SignupScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                </AuthStack.Navigator>
    )
}

export default AuthFlow;