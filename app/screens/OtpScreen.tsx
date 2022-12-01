import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { Avatar } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const window = Dimensions.get('window');

const OtpScreen = ({ navigation }) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const Signin = () => {

        console.log(`Is keyboard open`, isKeyboardVisible);

        const checkValid = phoneInput.current?.isValidNumber(value);
        setShowMessage(true);
        setValid(checkValid ? checkValid : false);
        if (checkValid) {
            const countryIsoCode = phoneInput.current?.getCountryCode();
            const countryCode = phoneInput.current?.getCallingCode();

            console.log(`Selected phone number ${value} and formatted value ${formattedValue}`);
            console.log(`countryIsoCode: ${countryIsoCode} and countryCode: ${countryCode}`);
            navigation.navigate('Home');
        } else {
            Toast.showWithGravity(`Please enter a valid phone number`, Toast.LONG, Toast.TOP);
        }
    }

    const onChangePhoneNumber = (text: string) => {
        setValue(text);
        // const isValid = phoneInput.current?.isValidNumber(value);
        const isValid = text.length >= 9 ? true : false;
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
        <View style={styles.container}
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <View style={styles.header}>
               <Avatar.Image size={isKeyboardVisible ? 130 : 180} source={require('../assets/images/otp.webp')} />
               <Text style={styles.ephoneTxt}>Enter OTP that has been sent to your phone number</Text>
            </View>

            <View style={styles.body}>

                <OTPInputView
                    style={{ width: '80%', height:200 }}
                    pinCount={4}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    // autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={(code => {
                        console.log(`Code is ${code}, you are good to go!`)
                    })}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={!valid}
                    style={valid ? configs.styles.primaryBtn : configs.styles.secondaryBtn}
                    onPress={() => Signin()}
                >
                    <Text style={[configs.styles.btnText, valid ? { color: configs.colors.white } : { color: configs.colors.primary }]}>Verify OTP</Text>
                </TouchableOpacity>
            </View>
        </View>
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

    ephoneTxt: {
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
        // borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },

})