import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { Avatar } from 'react-native-paper';
import AppLoader from '../components/AppLoader';
import { getAppVersion, removeLeadingZeros } from '../components/common/SharedHelper';
import { Context as AppContext } from '../context/appContext';
import { LoginData } from '../interfaces';
import { displayMessage } from '../components/common/SharedHelper';
import { Switch } from 'react-native-paper';


const SigninScreen = ({ navigation }: { navigation: any }) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    const { signin } = useContext(AppContext);

    const [isDoctor, setIsDoctor] = useState(false);
    const onToggleSwitch = () => setIsDoctor(!isDoctor);
    const userType = isDoctor ? 'patient' : 'doctor';
    const currentUserType = isDoctor ? 'Doctor' : 'Patient';
    const actionType = isDoctor ? 'Disable' : 'Enable';


    const Signin = () => {

        Keyboard.dismiss();

        const checkValid = phoneInput.current?.isValidNumber(value);
        setValid(checkValid ? checkValid : false);

        if (checkValid) {

            const phoneObj: any = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
            let number = phoneObj.number;
            const startsWithZero = number.startsWith("0");
            if (startsWithZero) {
                number = removeLeadingZeros(number);
            }

            const formattedNumber = `+${phoneInput.current?.getCallingCode()}${number}`
            Alert.alert(
                `${isDoctor ? 'Doctor' : 'Patient'} Signup`,
                `We will be verifying the phone number ${formattedNumber} as a ${isDoctor ? 'doctor' : 'patient'}'s number. is this ok or would like to edit the number?`,
                [
                    { text: 'Edit', onPress: () => { } },
                    {
                        text: 'OK', onPress: async () => {
                            let obj = {
                                country_code: `+${phoneInput.current?.getCallingCode()}`,
                                phone_number: number
                            }
                            if(isDoctor){
                                navigation.navigate('OTP', {
                                    ...obj,
                                    sent_otp: '',
                                    is_doctor: isDoctor
                                });
                            }else{
                                sendVerificationCode(obj);
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        } else {
            Toast.showWithGravity(`Please enter a valid phone number`, Toast.LONG, Toast.TOP);
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
        setFormattedValue("");
     
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
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.header}>
                    <Avatar.Image size={isKeyboardVisible ? 120 : 130} source={configs.images.logo}
                        style={configs.styles.logo} />
                    <Text style={styles.ephoneTxt}>Enter your phone number to login or register as {currentUserType}</Text>
                </View>

                <View style={styles.body}>

                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="UG"
                        layout="first"
                        onChangeText={(text) => {
                            onChangePhoneNumber(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                        }}
                        withDarkTheme={false}
                        withShadow={true}
                        autoFocus={true}
                        disabled={false}
                        placeholder={"phone number"}
                    />
                </View>

                <View style={styles.switchView}>
                        <Switch value={isDoctor} onValueChange={onToggleSwitch} color={configs.colors.primary} style={styles.switch} />
                        <Text style={styles.switchText}>{actionType} switch to proceed with {userType} login</Text>
                    </View>

                <View style={styles.footer}>
                   

                    <TouchableOpacity
                        disabled={false}
                        style={[valid ? configs.styles.primaryBtn : configs.styles.secondaryBtn, configs.styles.bottomizedBtn]}
                        onPress={() => Signin()}
                    >
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
        marginHorizontal:35
    },

    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        marginHorizontal: 10,
    },

    switchText: {
        fontSize: configs.fonts.medium
    }

});