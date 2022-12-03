import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Dimensions, KeyboardAvoidingView } from 'react-native';
import * as configs from '../configs';
import Toast from 'react-native-simple-toast';
import { Avatar } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AppLoader from '../components/AppLoader';


const window = Dimensions.get('window');
const otpLength = 4;

const OtpScreen = ({ navigation }: {navigation: any}) => {

    const [valid, setValid] = useState(false);
    const [otp, setOTP] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);


    const onChangeOTP = (code: string) => {
        setOTP(code);
        const isValid = code.length >= otpLength ? true : false;
        setValid(isValid);
    }

    const verifyOtp = (code: string) => {
        if (code && code.length == otpLength) {
            setIsLoading(true);
            Keyboard.dismiss();
            setTimeout(() => {
                setIsLoading(false);
                setOTP('');
                navigation.navigate('Register');
            }, 4000);
        } else {
            Toast.show(`Please fill in a ${otpLength} otp`);
        }
    }

    useEffect(() => {
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
    }, []);
    return (

        <>
            <KeyboardAvoidingView style={styles.container}>

                <View style={styles.header}>
                    <Avatar.Image size={isKeyboardVisible ? 130 : 180} source={require('../assets/images/otp.webp')} />
                    <Text style={styles.otpTxt}>Enter OTP that has been sent to your phone number</Text>
                </View>

                <View style={styles.body}>

                    <OTPInputView
                        style={{ width: '80%', height: 200 }}
                        pinCount={otpLength}
                        code={otp}
                        onCodeChanged={code => { setOTP(code), onChangeOTP(code) }}
                        autoFocusOnLoad={false}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        keyboardAppearance={"light"}
                        onCodeFilled={(code => {
                            verifyOtp(code);
                        })}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={!valid}
                        style={[valid ? configs.styles.primaryBtn : configs.styles.secondaryBtn, , configs.styles.bottomizedBtn]}
                        onPress={() => verifyOtp(otp)}>
                        <Text style={[configs.styles.btnText, valid ? { color: configs.colors.white } : { color: configs.colors.primary }]}>Verify OTP</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            {isLoading && <AppLoader />}

        </>
    )
}

export default OtpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white
    },

    header: {
        flex: 2,
        backgroundColor: configs.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },

    body: {
        flex: 1,
        backgroundColor: configs.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },

    footer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: configs.colors.white,
    },

    textSignin: {
        fontSize: 28,
        color: configs.colors.white,
        fontWeight: 'bold',
        left: 20,
    },

    otpTxt: {
        fontSize: 18,
        top: 15,
        color: configs.colors.dark,
        opacity: 0.7,
        textTransform: 'none',
        textAlign: 'center',
        marginHorizontal: 20
    },

    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 65,
        height: 65,
        borderWidth: 1,
        fontSize: 20,
        color: configs.colors.dark
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },

})