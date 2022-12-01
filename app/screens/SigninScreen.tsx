import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as colors from '../configs/colors';
import * as configs from '../configs/styles';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';


const SigninScreen = ({ navigation }) => {

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const Signin = () => {

        const checkValid = phoneInput.current?.isValidNumber(value);
        setShowMessage(true);
        setValid(checkValid ? checkValid : false);
        if(checkValid){
            const countryIsoCode = phoneInput.current?.getCountryCode();
            const countryCode = phoneInput.current?.getCallingCode();
    
            console.log(`Selected phone number ${value} and formatted value ${formattedValue}`);
            console.log(`countryIsoCode: ${countryIsoCode} and countryCode: ${countryCode}`);
                // navigation.navigate('Home');
        }else{
             Toast.showWithGravity(`Please enter a valid phone number`, Toast.LONG, Toast.TOP);
        }    
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textSignin}>Welcome!</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.ephoneTxt}>Enter your phone number</Text>
                <View style={styles.enterPhoneView}>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="UG"
                    layout="first"
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                />
                </View>
               
            </View>

            <View style={styles.footer}>
            <TouchableOpacity style={configs.styles.secondaryBtn}
                    onPress={() => Signin()}
                >
                    <Text style={configs.styles.btnText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SigninScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.default.primary,
    },

    header: {
        flex: 1,
        backgroundColor: colors.default.primary,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    body: {
        flex: 2,
        backgroundColor: colors.default.white,
        alignItems: 'center',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        justifyContent: 'center',
    },

    footer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.default.white,
     
    },

    textSignin: {
        fontSize: 28,
        color: colors.default.white,
        fontWeight: 'bold',
        left: 20,
    },

    ephoneTxt: {
        fontSize: 18,
        top: 20,
        color: colors.default.dark,
        opacity: 0.7,
        textTransform: 'capitalize',
    },

    enterPhoneView: {
        paddingVertical: 80,
    }
})