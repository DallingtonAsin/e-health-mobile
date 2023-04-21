import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, StatusBar, KeyboardAvoidingView } from 'react-native';
import * as configs from '../configs';
import Toast from 'react-native-simple-toast';
import Avatar from '../components/Avatar';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AppLoader from '../components/AppLoader';
import { Context as AuthContext } from '../context/authContext';
import { displayMessage } from '../components/common/SharedHelper';

const otpLength = 6;

const OtpScreen = ({ route, navigation }: { route: any, navigation: any }) => {

    const { country_code, phone_number, sent_otp, is_doctor } = route.params;
    const [valid, setValid] = useState(false);
    const [otp, setOTP] = useState(sent_otp);
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { authenticateDoctor, verifyCode } = useContext(AuthContext);



    const onChangeOTP = (code: string) => {
        setOTP(code);
    }

    const verifyOtp = (code: string) => {
        if (code && code.length == otpLength) {
            setIsLoading(true);
            Keyboard.dismiss();
            if (is_doctor) {
                let payload = {
                    country_code: country_code,
                    phone_number: phone_number,
                    otp: code
                }

                authenticateDoctor({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });
            } else {
                verifyCode({ code: code, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });
            }


        } else {
            Toast.show(`Please enter verification code`);
        }
    }

    const navigateMethod = async (data: any) => {
        setOTP("");
        if (data.profile_status == 1) {
            navigation.navigate('Home');
        } else {
            if (is_doctor) {
                navigation.navigate('DoctorRegistration');
            } else {
                navigation.navigate('PatientRegistration');
            }
        }
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    useEffect(() => {

        const isValid = otp.length >= otpLength;
        setValid(isValid);

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [otp]);
    return (

        <>
            <KeyboardAvoidingView style={styles.container}>

                <StatusBar backgroundColor={configs.colors.primary} />

                <View style={styles.header}>
                    <Avatar size={120} borderRadius={75} source={`https://thumbs.dreamstime.com/b/otp-one-time-password-step-authentication-data-protection-internet-security-concept-otp-one-time-password-step-authentication-data-254434939.jpg`} />
                    <Text style={styles.otpTxt}>
                        {is_doctor
                            ? 'Enter the code assigned to you by the administrator, or contact the administrator.'
                            : 'Enter the OTP that has been sent to your phone number'
                        }
                    </Text>
                </View>

                <View style={styles.body}>

                    <OTPInputView
                        style={{ width: '80%', height: 100 }}
                        pinCount={otpLength}
                        code={otp ? otp : sent_otp}
                        onCodeChanged={code => { onChangeOTP(code) }}
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        keyboardAppearance={"dark"}
                        onCodeFilled={(code => {
                            verifyOtp(code);
                        })}
                    />

                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={!valid}
                        style={[configs.styles.secondaryBtn, configs.styles.bottomizedBtn]}
                        onPress={() => verifyOtp(otp)}>
                        <Text style={[configs.styles.btnText, { color: configs.colors.primary }]}>Verify OTP</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            {isLoading && <AppLoader color={configs.colors.white} />}

        </>
    )
}

export default OtpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.primary
    },

    header: {
        flex: 2,
        backgroundColor: configs.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    body: {
        flex: 1,
        backgroundColor: configs.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: configs.colors.primary,
    },

    textSignin: {
        fontSize: 28,
        color: configs.colors.white,
        fontWeight: 'bold',
        left: 20,
    },

    otpTxt: {
        fontSize: configs.fonts.large,
        top: 15,
        color: configs.colors.white,
        textTransform: 'none',
        textAlign: 'center',
        marginHorizontal: 20
    },

    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: configs.colors.white,
    },

    underlineStyleBase: {
        width: 65,
        height: 65,
        borderWidth: 1,
        fontSize: 20,
        color: configs.colors.dark,
        backgroundColor: configs.colors.white,
    },

    underlineStyleHighLighted: {
        borderColor: configs.colors.white,
        backgroundColor: configs.colors.white,
    },

});