import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { Avatar } from 'react-native-paper';
import AppLoader from '../components/AppLoader';
import { removeLeadingZeros } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { LoginData } from '../interfaces';
import { displayMessage } from '../components/common/SharedHelper';


const SigninScreen = ({ navigation }: { navigation: any }) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);
    const { state, signin } = useContext(AuthContext);

    const Signin = () => {

        Keyboard.dismiss();

        const checkValid = phoneInput.current?.isValidNumber(value);
        setShowMessage(true);
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
                '',
                `We will be verifying the phone number ${formattedNumber}. is this OK, or would like to edit the number?`,
                [
                    { text: 'Edit', onPress: () => console.log('Edit Pressed') },
                    {
                        text: 'OK', onPress: async () => {
                            let obj = {
                                country_code: `+${phoneInput.current?.getCallingCode()}`,
                                phone_number: number
                            }
                            sendVerificationCode(obj)
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

        let payload: LoginData = {
            country_code: phoneObj.country_code,
            phone_number: phoneObj.phone_number,
            current_version: '1.2',
        }

        signin({payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading});
    }

    const navigateMethod = (code: string) => {
        setValue("");
        setFormattedValue("")
        navigation.navigate('OTP', {
            sentOtp: code
        })
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
                    <Text style={styles.ephoneTxt}>Use your phone number to login or register</Text>
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
                        withShadow
                        autoFocus={false}
                    />

                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={false} // {!valid}
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
        alignItems: 'center',
        marginVertical: 15,
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
        fontSize: 18,
        top: 15,
        color: configs.colors.dark,
        opacity: 0.7,
        textTransform: 'none',
        textAlign: 'center',
        marginHorizontal: 20
    },

})