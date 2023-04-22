import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { getAppVersion, removeLeadingZeros } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { LoginData } from '../interfaces';
import { displayMessage } from '../components/common/SharedHelper';
import { Switch } from 'react-native-paper';
import Avatar from '../components/Avatar';


const SigninScreen = ({ navigation }: { navigation: any }) => {

    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const phoneInputRef = useRef<PhoneInput>(null);
    const { signin } = useContext(AuthContext);

    const [isDoctor, setIsDoctor] = useState(false);
    const onToggleSwitch = () => setIsDoctor(!isDoctor);
    const userType = isDoctor ? 'patient' : 'healthcare provider';
    const currentUserType = isDoctor ? 'healthcare provider' : 'patient';
    const actionType = isDoctor ? 'Disable' : 'Enable';


    const Signin = () => {

        Keyboard.dismiss();

        const checkValid = phoneInputRef.current?.isValidNumber(value);
        setValid(checkValid ? checkValid : false);

        if (checkValid) {

            const phoneObj: any = phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero();
            let number = phoneObj.number;
            const startsWithZero = number.startsWith("0");
            if (startsWithZero) {
                number = removeLeadingZeros(number);
            }

            const formattedNumber = `+${phoneInputRef.current?.getCallingCode()}${number}`
            Alert.alert(
                `${isDoctor ? 'Healthcare Provider' : 'Patient'} Signup`,
                `We will be verifying the phone number ${formattedNumber} as a ${isDoctor ? 'doctor' : 'patient'}'s number. is this ok or would like to edit the number?`,
                [
                    { text: 'Edit', onPress: () => { } },
                    {
                        text: 'OK', onPress: async () => {
                            let obj = {
                                country_code: `+${phoneInputRef.current?.getCallingCode()}`,
                                phone_number: number
                            }
                            if (isDoctor) {
                                navigation.navigate('OTP', {
                                    ...obj,
                                    sent_otp: '',
                                    is_doctor: isDoctor
                                });
                            } else {
                                sendVerificationCode(obj);
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        } else {
            Toast.show(`Please enter a valid phone number`, Toast.LONG);
        }
    }

    const sendVerificationCode = (phoneObj: any) => {

        setIsLoading(true);

        let current_version = getAppVersion();
        let payload: LoginData = {
            country_code: phoneObj.country_code,
            phone_number: phoneObj.phone_number,
            current_version: current_version,
        }

        signin({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });
    }

    const navigateMethod = (data: any) => {
        setValue("");
        if (phoneInputRef.current) {
            phoneInputRef.current?.setState({ number: '' })
        }

        navigation.navigate('OTP', {
            country_code: data.country_code,
            phone_number: data.phone_number,
            sent_otp: data.otp,
            is_doctor: isDoctor
        });
    }

    const stopLoading = () => {
        setIsLoading(false);
    }


    const onChangePhoneNumber = (text: string) => {
        setValue(text);
        const isValid = text && text.length >= 9 ? true : false;
        setValid(isValid);
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
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.header}>
                    <Avatar size={135} borderRadius={75} source={configs.images.splash} resizeMode={'cover'} isURL={false}/>
                    <Text style={styles.ephoneTxt}>Enter your phone number to login or register as {currentUserType}</Text>
                </View>

                <View style={styles.body}>

                    <PhoneInput
                        ref={phoneInputRef}
                        defaultValue={value}
                        defaultCode="UG"
                        layout="first"
                        onChangeText={(text) => {
                            onChangePhoneNumber(text);
                        }}
                        withDarkTheme={false}
                        withShadow={true}
                        autoFocus={true}
                        // disableArrowIcon={true}
                        placeholder={"phone number"}
                    />
                </View>

                <View style={styles.switchView}>
                    <Switch value={isDoctor} onValueChange={onToggleSwitch} color={configs.colors.primary} style={styles.switch} />
                    <Text style={styles.switchText}>{actionType} switch to login as {userType}</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={false}
                        style={[valid ? configs.styles.primaryBtn : configs.styles.secondaryBtn, configs.styles.bottomizedBtn]}
                        onPress={() => Signin()}>
                        <Text style={[configs.styles.btnText, valid ? { color: configs.colors.white } : { color: configs.colors.primary }]}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {isLoading && <AppLoader />}

        </>
    )
}

export default SigninScreen;

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
        marginVertical: 15,
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

    ephoneTxt: {
        fontSize: configs.fonts.medium,
        top: 15,
        textAlign: 'center',
        marginHorizontal: 20,
    },

    switchView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 35
    },

    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        marginHorizontal: 10,
    },

    switchText: {
        fontSize: configs.fonts.medium
    }

});