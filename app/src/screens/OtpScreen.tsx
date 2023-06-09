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
    const { verifyCode } = useContext(AuthContext);

    const onChangeOTP = (code: string) => {
        setOTP(code);
    }

    const verifyOtp = (code: string) => {
        if (code && code.length == otpLength) {
            setIsLoading(true);
            Keyboard.dismiss();
            if (is_doctor) {
                verifyCode({ code: code, is_patient: false, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: stopLoading });
            } else {
                verifyCode({ code: code, is_patient: true, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: stopLoading });
            }
        } else {
            displayMessage(`Please enter verification code`);
        }
    }

    const onSuccess = async (data: any) => {
        setOTP("");
        if (data.profile_status == 1) {
            navigation.navigate('SignedInStack', { screen: 'Home' });
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
                    <Avatar size={120} borderRadius={75} source={configs.images.otp} isURL={false} />
                    <Text style={styles.otpTxt}>
                        {is_doctor
                            ? 'Enter the OTP sent to your mobile number'
                            : 'Enter the OTP that has been sent to your phone number'
                        }
                    </Text>
                </View>

                <View style={styles.body}>

                    <OTPInputView
                        style={styles.otpContainer}
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
        backgroundColor: configs.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
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

    otpContainer: {
        width: '80%',
        height: 200,
        alignSelf: 'center'
    },

    textSignin: {
        fontSize: 28,
        color: configs.colors.white,
        fontWeight: 'bold',
        left: 20,
    },

    otpTxt: {
        fontSize: configs.fonts.extraLarge,
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