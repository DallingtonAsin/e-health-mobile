import React, { useState, useRef, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import * as configs from '../../configs'
import PhoneNumberInput from "react-native-phone-number-input"
import Toast from 'react-native-simple-toast'
import { TextInput } from 'react-native-paper'
import AppLoader from '../../components/AppLoader'
import { getAppVersion, isValidEmail, removeLeadingZeros } from '../../components/common/SharedHelper'
import { Context as AuthContext } from '../../context/authContext'
import { LoginPayload } from '../../interfaces'
import { displayMessage } from '../../components/common/SharedHelper'
import { getDeviceId, getIPAddress, getToken } from '../../components/common/AppUtils'
import TouchableImage from '../../components/TouchableImage'

const SigninScreen = ({ navigation }: { navigation: any }) => {

    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPhoneLogin, setIsPhoneLogin] = useState(true);
    const phoneInputRef = useRef<PhoneNumberInput>(null);
    const [selectedImage, setSelectedImage] = useState<string>('image1');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signin } = useContext(AuthContext);

    const [isDoctor, setIsDoctor] = useState(false);
    const currentUserType = isDoctor ? 'doctor' : 'patient';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = async () => {

        let payload: LoginPayload = { country_code: '', phone_number: '', email: '', password: '', is_phone_number_login: isPhoneLogin }

        if (isPhoneLogin) {
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

                payload.country_code = `+${country_code}`
                payload.phone_number = number

            } else {
                displayMessage(`Please enter a valid phone number`)
                return
            }
        }

        if (!isPhoneLogin) {
            if (!email) {
                displayMessage(`Please enter your email`)
                return
            }
            if (!isValidEmail(email)) {
                displayMessage(`Please enter valid email`)
                return
            }
            payload.email = email
        }

        if (!password) {
            displayMessage(`Please enter your password`)
            return
        }

        payload.password = password
        const current_version = getAppVersion()
        const device_id = await getDeviceId()
        const ip_address = await getIPAddress()
        const token = await getToken()

        payload.current_version = current_version
        payload.unique_device_id = device_id
        payload.device_token = token
        payload.ip_address = ip_address

        if (isDoctor) {
            login(payload, false);
        } else {
            login(payload, true);
        }

    }

    const login = (payload: LoginPayload, is_patient: boolean) => {
        setIsLoading(true);
        signin({ payload: payload, is_patient: is_patient, onSuccess: onSuccess, onFailure: displayMessage, onCompletion: stopLoading });
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                        <View style={{ marginVertical: 10, alignItems: 'center' }}>
                            <Text style={[styles.loginTxt, { textTransform: 'capitalize' }]}>{currentUserType} Login</Text>
                            <Text style={styles.ephoneTxt}>Login if you have an existing account</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.body}>
                    {isPhoneLogin && <PhoneNumberInput
                        ref={phoneInputRef}
                        defaultValue={value}
                        defaultCode="UG"
                        containerStyle={{ alignSelf: 'center' }}
                        onChangeText={(text) => {
                            onChangePhoneNumber(text);
                        }}
                        onChangeCountry={(country) => {
                            onChangeCountry(country);
                        }}
                        withShadow
                        layout='first'
                        autoFocus={false}
                        withDarkTheme={false}
                        placeholder={"774 014727"}
                    />}

                    {!isPhoneLogin &&
                        <View style={styles.textInputContainer}>
                            <TextInput
                                mode='outlined'
                                label="Email"
                                style={styles.textInput}
                                value={email}
                                placeholder='Enter your email'
                                onChangeText={(text) => setEmail(text)}
                                activeOutlineColor={configs.colors.primary}
                            />
                        </View>}

                    <View style={styles.textInputContainer}>
                        <TextInput
                            mode='outlined'
                            label="Password"
                            style={styles.textInput}
                            secureTextEntry={!showPassword}
                            value={password}
                            placeholder='Enter your password'
                            onChangeText={(text) => setPassword(text)}
                            right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} size={24} onPress={togglePasswordVisibility} />}
                            activeOutlineColor={configs.colors.primary}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => setIsPhoneLogin(!isPhoneLogin)}>
                            {isPhoneLogin && <Text style={styles.loginOption}>Use email instead to login</Text>}
                            {!isPhoneLogin && <Text style={styles.loginOption}>Use phone number instead to login</Text>}
                        </TouchableOpacity>
                    </View>
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


            </KeyboardAvoidingView>

            {isLoading && <AppLoader />}

        </React.Fragment>
    )
}

export default SigninScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 25,
    },

    body: {
        flex: 1,
        paddingHorizontal: 5,
        // alignItems: 'center',
    },

    footer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 50.,
    },

    row: {
        flexDirection: 'row',
        marginTop: 10
    },

    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
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
        // fontSize: configs.fonts.normal,
        // textAlign: 'center',
        // color: configs.colors.black,
        // opacity: 0.5
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

    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        marginHorizontal: 30,
        marginTop: 15,

    },

    textInput: {
        flex: 1,
        fontSize: configs.fonts.large,
        paddingLeft: 10,
        animationDuration: '1s',
        animationName: 'blink',
        animationIterationCount: 'infinite',

    },

    loginOption: {
        fontSize: configs.fonts.medium,
        color: configs.colors.terms,
        marginLeft: 30,
        // textDecorationLine: 'underline',
    }

});