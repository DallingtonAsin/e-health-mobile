import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, isValidEmail } from '../../components/common/SharedHelper';
import { Context as PatientContext } from '../../context/patientContext';
import { IUser } from '../../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';
import { HOSPITAL_NAME } from '@env';
import { Checkbox } from 'react-native-paper';

const numberOfLines = 5;

const PatientRegistrationScreen = ({ navigation }: { navigation: any }) => {

    const InitialUser = {
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        gender: '',
        address: '',
        phone_number: '',
        profile_status: false,
    }

    const [user, setUser] = useState<IUser>(InitialUser);
    const [isValidForm, setIsValidForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { signup } = useContext(PatientContext);

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ];

    const validateForm = () => {

        let validEmail: boolean = true;
        if (user.email != '') {
            validEmail = isValidEmail(user.email);
        }

        if (user.first_name !== '' && user.last_name !== '' && user.address !== '' && user.gender !== '' && user.dob !== '' && validEmail) {
            setIsValidForm(true);
        } else {
            setIsValidForm(false);
        }
    };

    const handleTextInputChange = (field: string, text: any) => {
        setUser((prev) => ({
            ...prev,
            [field]: text,
        }));
        validateForm();
    };

    
    const submitDetails = () => {

        if (!user.first_name) {
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if (!user.last_name) {
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if (user.email) {
            if (!isValidEmail(user.email)) {
                Toast.show('Please enter a valid email', Toast.LONG);
                return;
            }
        }

        if (!user.address) {
            Toast.show('Enter your address', Toast.LONG);
            return;
        }

        if (!user.gender) {
            Toast.show('Select your gender', Toast.LONG);
            return;
        }

        if (!user.dob) {
            Toast.show('Enter your date of birth', Toast.LONG);
            return;
        }

        if (!hasAgreedTerms) {
            Toast.show('Please agree to our terms and conditions before signup', Toast.LONG);
            return;
        }

        setIsLoading(true);

        let payload: IUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user?.email,
            address: user.address,
            gender: user.gender,
            dob: user.dob
        }
        // console.log(`patient info`, payload);
        signup({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: stopLoading });

    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const navigateMethod = async (data: any) => {
        navigation.navigate('Home');
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
        handleTextInputChange('dob', dob);
    };

    const handleCheckTermsAndConditions = () => {
        setHasAgreedTerms(!hasAgreedTerms);
    };
    
    const handlePrivacyPolicyPress = () => {
        Linking.openURL('https://example.com/privacy-policy');
    };

    const handleTermsPress = () => {
        Linking.openURL('https://example.com/terms-and-conditions');
    };

    return (
        <>
            <SafeAreaView style={styles.container}>

                <StatusBar backgroundColor={config.colors.primary} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Create a {HOSPITAL_NAME} Medical Services Account</Text>

                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>First Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="First Name"
                            value={user.first_name}
                            mode="outlined"
                            dense={false}
                            activeOutlineColor={config.colors.primary}
                            numberOfLines={numberOfLines}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('first_name', text)}
                        />
                    </View>


                    <View style={styles.inputWrap}>
                        <Text style={styles.labelTxt}>Last Name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Last Name"
                            value={user.last_name}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('last_name', text)}

                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Email address</Text>
                        <TextInput
                            label="Email address"
                            value={user.email}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('email', text)}
                        />
                    </View>


                    <View style={styles.viewContainer}>
                        <Text style={styles.labelTxt}>Address<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            label="Address"
                            value={user.address}
                            mode="outlined"
                            activeOutlineColor={config.colors.primary}
                            style={styles.textInput}
                            textColor={config.colors.dark}
                            onChangeText={(text) => handleTextInputChange('address', text)}

                        />
                    </View>

                    <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                            <SelectList
                                setSelected={(val: string) => handleTextInputChange('gender', val)}
                                data={genderOptions}
                                save="value"
                                search={false}
                                placeholder={"Select Gender"}
                                inputStyles={{ color: config.colors.black }}
                                boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Date of Birth<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Date of Birth"
                                value={user.dob}
                                mode="outlined"
                                activeOutlineColor={config.colors.primary}
                                style={styles.textInput}
                                textColor={config.colors.dark}
                                onFocus={showDatePicker}
                                showSoftInputOnFocus={false}
                                onChangeText={(text) => handleTextInputChange('dob', text)}
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

                    <View style={[styles.viewContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Checkbox
                            status={hasAgreedTerms ? 'checked' : 'unchecked'}
                            color={config.colors.primary}
                            onPress={handleCheckTermsAndConditions}
                        />
                        <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                            <Text style={{ marginLeft: 8, color: config.colors.grey, fontSize: 16 }}>
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

                    <View style={styles.viewContainer}>
                        <TouchableOpacity
                            // disabled={!isValidForm}
                            style={[isValidForm ? config.styles.primaryBtn : config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => submitDetails()}>
                            <Text style={[config.styles.btnText, isValidForm ? { color: config.colors.white } : { color: config.colors.primary }]}>Continue</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </>
    )
}


export default PatientRegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: config.colors.white,
        marginVertical: 10,
        marginHorizontal: 6,
        elevation: 8,
        borderRadius: 8,
        shadowColor: config.colors.gray,
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
    },

    scrollView: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
        margin: 15,
    },

    inputWrap: {
        flex: 1,
        paddingHorizontal: 5,
    },

    labelTxt: {
        fontSize: 18,
    },

    viewContainer: {
        flex: 1,
        marginVertical: 5,
    },

    title: {
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 16,
        color: config.colors.dark,
        paddingLeft: 30,
        paddingRight: 30,
        fontWeight: '900',
        opacity: 0.6,
        textTransform: 'uppercase',
    },

    back2Login: {
        alignItems: 'center',
        paddingBottom: 20,
    },

    back2LoginTxt: {
        color: config.colors.primary,
        fontSize: 18,
        textAlign: 'center',
    },

    required: {
        color: config.colors.danger,
    },

    textInput: {
        backgroundColor: config.colors.white,
        color: config.colors.silver,
    }
})