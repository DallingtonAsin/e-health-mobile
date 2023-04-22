import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Linking, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput, Checkbox } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, isValidEmail, isValidDob } from '../../components/common/SharedHelper';
import { IUser } from '../../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';
import { Context as AuthContext } from '../../context/authContext';
import { initialUser } from '../../configs/constants';


const RegistrationScreen = ({ navigation }: { navigation: any }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
    const [user, setUser] = useState<IUser>(initialUser);
    const { registerDoctor } = useContext(AuthContext);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ];


    const submit = () => {

        if (!user.first_name) {
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if (!user.last_name) {
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if (!user.email) {
            Toast.show('Enter your email address', Toast.LONG);
        }

        if (!isValidEmail(user.email)) {
            Toast.show('Please enter a valid email', Toast.LONG);
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

        if (!isValidDob(user.dob)) {
            Toast.show('Enter valid date of birth. Doctor must be atleast greater than 18', Toast.LONG);
            return;
        }

        if (!hasAgreedTerms) {
            Toast.show('Please agree to our terms and conditions before signup', Toast.LONG);
            return;
        }

        let payload: IUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user?.email,
            gender: user.gender,
            dob: user.dob,
        }

        setIsLoading(true);
        registerDoctor({ payload: payload, onSuccess: navigateMethod, onFailure: displayMessage, onCompletion: () => setIsLoading(false) });
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
        setUser({
            ...user,
            dob: dob
        });
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
            <SafeAreaView style={config.styles.registration.doctor.container}>

                <StatusBar
                    backgroundColor={config.colors.primary}
                />

                <ScrollView
                    style={config.styles.registration.doctor.scrollView}
                    contentContainerStyle={config.styles.registration.doctor.scrollContainer}>
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
                            onChangeText={text => setUser(prev => ({ ...prev, first_name: text }))}

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
                            onChangeText={text => setUser({ ...user, last_name: text })}
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
                            onChangeText={text => setUser(prev => ({ ...prev, email: text }))}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Gender
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, gender: val }))}
                            data={genderOptions}
                            save="value"
                            search={false}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>


                    <View style={config.styles.registration.doctor.viewContainer}>
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
                            onChangeText={text => setUser(prev => ({ ...prev, dob: text }))}
                        />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            display='inline'
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}

                        />
                    </View>

                    <View style={[config.styles.registration.doctor.viewContainer, { flexDirection: 'row', alignItems: 'center' }]}>
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