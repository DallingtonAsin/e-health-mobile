import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { Avatar } from 'react-native-paper';


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
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <View style={styles.header}>
            <Avatar.Image size={200} source={{ uri: configs.urls.logo }} />
            <Text style={styles.ephoneTxt}>Use your phone number to login or register</Text>
            </View>

            <View style={styles.body}>
             
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
                    withDarkTheme={false}
                    withShadow
                    autoFocus
                />
               
            </View>

            <View style={styles.footer}>
            <TouchableOpacity style={configs.styles.secondaryBtn}
                    onPress={() => Signin()}
                >
                    <Text style={configs.styles.btnText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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