import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Linking, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput, Checkbox } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, validatePassword, validateConfirmPassword } from '../../components/common/SharedHelper';
import { DoctorRegistrationPayload } from '../../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';
import { Context as AuthContext } from '../../context/authContext';
import { registrationState } from '../../configs/constants';
import { validateDoctorRegistration } from '../../components/common/validation';
import { togglePasswordVisibility } from '../../components/common/AppUtils';


const RegistrationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
    const [user, setUser] = useState<DoctorRegistrationPayload>(registrationState.doctor);
    const { registerDoctor } = useContext(AuthContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ];

    const submit = () => {

        const validationError = validateDoctorRegistration(user, hasAgreedTerms);
        if (validationError) {
            Toast.show(validationError, Toast.LONG)
            return;
        }

        let payload: DoctorRegistrationPayload = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user?.email,
            gender: user.gender,
            dob: user.dob,
            password: user.password,
            password_confirmation: user.password_confirmation,
        }

        setIsLoading(true);
        registerDoctor({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
    }

    const navigateMethod = async (data: any) => {
        navigation.navigate('SignedInStack', { screen: 'Home' });
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        let dob = formatDate(date);
        setUser({
            ...user,
            dob: dob
        });
    }

    const handleCheckTermsAndConditions = () => {
        setHasAgreedTerms(!hasAgreedTerms);
    }

    const handlePrivacyPolicyPress = () => {
        Linking.openURL('https://example.com/privacy-policy');
    }

    const handleTermsPress = () => {
        Linking.openURL('https://example.com/terms-and-conditions');
    }

    const setState = (field: string, text: any) => {
        setUser((prev) => ({
            ...prev,
            [field]: text,
        }));
    }

    const handleTextInputChange = (field: string, text: any) => {

        if (field == 'password' && user.password_confirmation) {
            if (text !== user.password_confirmation) {
                setPasswordError('Passwords do not match')
            } else {
                setPasswordError('');
                setState(field, text)
            }
        }

        if (field == 'password_confirmation' && user.password) {
            if (text !== user.password) {
                setPasswordError('Passwords do not match')
            } else {
                setPasswordError('');
                setState(field, text)
            }
        }
        setState(field, text)
        // validateForm();
    };


    return (
        <>
            <SafeAreaView style={config.styles.registration.doctor.container}>

                <StatusBar backgroundColor={config.colors.primary} />
                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={config.styles.registration.doctor.title}>Medical Doctor Registration</Text>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>First Name
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="First Name"
                            value={user.first_name}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={5}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => handleTextInputChange('first_name', text)}
                        />
                    </View>


                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Last Name
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Last Name"
                            value={user.last_name}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => handleTextInputChange('last_name', text)}
                        />
                    </View>


                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Email
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Email address"
                            value={user.email}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={text => handleTextInputChange('email', text)}
                        />
                    </View>

                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={config.styles.registration.doctor.inputWrap}>
                            <Text style={config.styles.registration.doctor.labelTxt}>Gender
                                <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                            <SelectList
                                setSelected={(text: string) => handleTextInputChange('gender', text)}
                                data={genderOptions}
                                save="value"
                                search={false}
                                inputStyles={{ color: config.colors.black }}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                            />
                        </View>


                        <View style={config.styles.registration.doctor.inputWrap}>
                            <Text style={config.styles.registration.doctor.labelTxt}>Date of Bith
                                <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                            <TextInput
                                label="Date of Birth"
                                value={user.dob}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={config.styles.registration.doctor.textInput}
                                textColor={config.colors.dark}
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={text => handleTextInputChange('dob', text)}
                            />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                display='inline'
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </View>
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Password<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Password"
                            value={user.password}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('password', text)}
                            onBlur={() => validatePassword(user.password, setPasswordError)}
                            secureTextEntry={!showPassword}
                            right={<TextInput.Icon icon={showPassword ? 'eye' : 'eye-off'} size={24}
                                onPress={() => togglePasswordVisibility(showPassword, setShowPassword)}
                            />
                            }
                        />
                    </View>

                    {passwordError !== '' && <Text style={{ color: config.colors.danger }}>{passwordError}</Text>}

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Confirm Password<Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <TextInput
                            label="Confirm Password"
                            value={user.password_confirmation}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={config.styles.registration.doctor.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('password_confirmation', text)}
                            onBlur={() => validateConfirmPassword(user.password, user.password_confirmation, setPasswordError)}
                            secureTextEntry={!showConfirmPassword}
                            right={
                                <TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={24} onPress={() => togglePasswordVisibility(showConfirmPassword, setShowConfirmPassword)} />
                            }
                        />
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer, { flexDirection: 'row' }]}>
                        <Checkbox
                            status={hasAgreedTerms ? 'checked' : 'unchecked'}
                            color={config.colors.primary}
                            onPress={handleCheckTermsAndConditions}
                        />
                        <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                            <Text style={{ color: config.colors.grey, fontSize: 16 }}>
                                I agree to the{' '}
                                <Text style={{ textDecorationLine: 'underline', color: config.colors.terms }} onPress={handlePrivacyPolicyPress}>
                                    privacy policy
                                </Text>{' '}
                                and{' '}
                                <Text style={{ textDecorationLine: 'underline', color: config.colors.terms }} onPress={handleTermsPress}>
                                    terms and conditions
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => submit()}>
                            <Text style={[config.styles.btnText]}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )
}

export default RegistrationScreen;