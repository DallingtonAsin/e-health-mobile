import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Keyboard, Alert } from 'react-native';
import * as configs from '../configs';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import AppLoader from '../components/AppLoader';
import { getAppVersion, removeLeadingZeros } from '../components/common/SharedHelper';
import { Context as AuthContext } from '../context/authContext';
import { LoginData } from '../interfaces';
import { displayMessage } from '../components/common/SharedHelper';
import { getDeviceId, getIPAddress, getToken } from '../components/common/AppUtils';
import TouchableImage from '../components/TouchableImage';


const PhoneNumberEntryScreen = ({ navigation }: { navigation: any }) => {

    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const phoneInputRef = useRef<PhoneInput>(null);
    const [selectedImage, setSelectedImage] = useState<string>('image1');
    const { sendVerificationCode } = useContext(AuthContext);

    const [isDoctor, setIsDoctor] = useState(false);
    const currentUserType = isDoctor ? 'doctor' : 'patient';


    const submit = () => {

        const checkValid = phoneInputRef.current?.isValidNumber(value);
        setValid(checkValid ? checkValid : false);

        if (checkValid) {

            const phoneObj: any = phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero();
            let number = phoneObj.number;
            const startsWithZero = number.startsWith("0");
            if (startsWithZero) {
                number = removeLeadingZeros(number);
            }

            const country_code = phoneInputRef.current?.getCallingCode()
            if (country_code != '256') {
                displayMessage(`Sorry, only phone numbers with a country code from Uganda are accepted.`)
                return
            }

            const formattedNumber = `+${phoneInputRef.current?.getCallingCode()}${number}`
            Alert.alert(
                `${isDoctor ? 'Doctor' : 'Patient'} Signup`,
                `We will be verifying the phone number ${formattedNumber} as a ${isDoctor ? 'doctor' : 'patient'}'s number. is this ok or would like to edit the number?`,
                [
                    { text: 'Edit', onPress: () => { } },
                    {
                        text: 'OK', onPress: async () => {
                            let obj = {
                                country_code: `+${country_code}`,
                                phone_number: number
                            }
                            if (isDoctor) {
                                sendOTP(obj, false);
                            } else {
                                sendOTP(obj, true);
                            }
                        }
                    },
                ],
                { cancelable: false }
            );
        } else {
            displayMessage(`Please enter a valid phone number`)
        }
    }

    const sendOTP = async (phoneObj: any, is_patient: boolean) => {

        setIsLoading(true);

        const current_version = getAppVersion()
        const device_id = await getDeviceId()
        const ip_address = await getIPAddress()
        const token = await getToken()

        let payload: LoginData = {
            country_code: phoneObj.country_code,
            phone_number: phoneObj.phone_number,
            current_version: current_version,
            unique_device_id: device_id,
            device_token: token,
            ip_address: ip_address,
        }

        sendVerificationCode({ payload: payload, is_patient: is_patient, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: stopLoading });
    }

    const onSuccess = (data: any) => {
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

    const onChangeCountry = (country: any) => {
        const name = country.name;
        const isValid = name.toString().toLowerCase() === 'uganda';
        setValid(isValid);
    }

    const handleImagePress = (image: string) => {
        setSelectedImage(image);
        if (image == 'image2') {
            setIsDoctor(true);
        } else {
            setIsDoctor(false);
        }
    };


    return (
        <React.Fragment>
            <SafeAreaView style={styles.container} >
                <View style={styles.header}>
                    <View style={styles.imageContainer}>
                        <Text style={{ color: configs.colors.gray, fontSize: configs.fonts.large }}>Choose Account Type</Text>
                        <View style={styles.row}>
                            <TouchableImage
                                onPress={() => handleImagePress('image1')}
                                imageSource={configs.images.patient}
                                containerStyle={[
                                    styles.touchableContainer,
                                    selectedImage === 'image1' && styles.activeContainer,
                                ]}
                                imageStyle={[
                                    styles.image,
                                    selectedImage === 'image1' && styles.activeImage,
                                ]}
                                text="Patient"
                                textStyle={[styles.roleText, selectedImage === 'image1' && { color: configs.colors.primary }]}
                            />
                            <TouchableImage
                                onPress={() => handleImagePress('image2')}
                                imageSource={configs.images.doctor}
                                containerStyle={[
                                    styles.touchableContainer,
                                    selectedImage === 'image2' && styles.activeContainer,
                                ]}
                                imageStyle={[
                                    styles.image,
                                    selectedImage === 'image2' && styles.activeImage,
                                ]}
                                text="Doctor"
                                textStyle={[styles.roleText, selectedImage === 'image2' && { color: configs.colors.primary }]}
                            />
                        </View>
                    </View>
                    <Text style={[styles.loginTxt, { textTransform: 'capitalize' }]}>{currentUserType} Registration</Text>
                    <Text style={styles.ephoneTxt}>Enter your phone number to register with Vastel</Text>
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
                        onChangeCountry={(country) => {
                            onChangeCountry(country);
                        }}
                        withDarkTheme={false}
                        withShadow={true}
                        autoFocus={true}
                        placeholder={"phone number"}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        disabled={false}
                        style={configs.styles.primaryBtn}
                        onPress={() => submit()}>
                        <Text style={configs.styles.continueText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={false}
                        style={[valid ? configs.styles.secondaryBtn : configs.styles.secondaryBtn, { marginVertical: 10 }]}
                        onPress={() => navigation.goBack()}>
                        <Text style={configs.styles.btnText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {isLoading && <AppLoader />}

        </React.Fragment>
    )
}

export default PhoneNumberEntryScreen;

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
        justifyContent: 'center',
        backgroundColor: configs.colors.white,
    },

    row: {
        flexDirection: 'row',
        marginTop: 10
    },

    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    touchableContainer: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 12,
        margin: 8,
    },

    image: {
        width: 50,
        height: 50,
    },

    activeContainer: {
        borderColor: configs.colors.primary
    },

    activeImage: {

    },

    ephoneTxt: {
        fontSize: configs.fonts.normal,
        textAlign: 'center',
        color: configs.colors.black,
        opacity: 0.5
    },

    loginTxt: {
        fontSize: configs.fonts.extraLarge,
        color: configs.colors.secondary,
        // fontWeight: 'bold',
        opacity: 0.8,
        textTransform: 'uppercase'
    },

    roleText: {
        color: configs.colors.gray,
        // fontWeight: 'bold',
        marginTop: 15,
    },

});