import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import * as config from '../../configs';
import { TextInput } from 'react-native-paper';
import AppLoader from '../../components/AppLoader';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, displayMessage, isValidEmail, isValidDob } from '../../components/common/SharedHelper';
import { Context as AppContext } from '../../context/appContext';
import { IUser } from '../../interfaces';
import { SelectList } from 'react-native-dropdown-select-list';


const RegistrationForm1 = ({ user, setUser, setScreen }: {
    user: IUser, setUser: React.Dispatch<React.SetStateAction<IUser>>,
    setScreen: React.Dispatch<React.SetStateAction<number>>
}) => {

    const [specialties, setSpecialties] = useState([]);
    const [isFetchingSpecialties, setIsFetchingSpecialties] = useState(true);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { getDoctorSpecialties } = useContext(AppContext);

    const genderOptions = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ];

    const titleOptions = [
        { key: '1', value: 'Dr.' },
        { key: '2', value: 'Mr.' },
        { key: '3', value: 'Mrs.' },
        { key: '4', value: 'Ms.' },
    ];

    useEffect(() => {
        getDoctorSpecialties({ onSuccess: populateSpecialties, onFailure: displayMessage, onCompletion: () => { setIsFetchingSpecialties(false) } });
    }, []);

    const populateSpecialties = (data: any) => {
        setSpecialties(data);
    }


    const moveToNextScreen = () => {

        if (!user.first_name) {
            Toast.show('Enter your first name', Toast.LONG);
            return;
        }

        if (!user.last_name) {
            Toast.show('Enter your last name', Toast.LONG);
            return;
        }

        if (!user.specialty) {
            Toast.show('Select your specialty', Toast.LONG);
            return;
        }

        if (!user.title) {
            Toast.show('Select your title', Toast.LONG);
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

        setScreen(1);
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

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Category
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, specialty: val }))}
                            data={specialties}
                            save="value"
                            search={false}
                            placeholder={"Select category"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
                        />
                    </View>

                    <View style={config.styles.registration.doctor.inputWrap}>
                        <Text style={config.styles.registration.doctor.labelTxt}>Title
                            <Text style={config.styles.registration.doctor.required}>*</Text></Text>
                        <SelectList
                            setSelected={(val: string) => setUser(prev => ({ ...prev, title: val }))}
                            data={titleOptions}
                            save="value"
                            search={false}
                            placeholder={"Select Title"}
                            inputStyles={{ color: config.colors.black }}
                            boxStyles={{ borderColor: config.colors.gray, borderWidth: 1, borderRadius: 4, marginTop: 6, height: 49, marginBottom: 10 }}
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

                    <View style={[config.styles.registration.doctor.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
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
                    </View>

                    <View style={config.styles.registration.doctor.viewContainer}>
                        <TouchableOpacity style={[config.styles.secondaryBtn, { width: '100%' }]}
                            onPress={() => moveToNextScreen()}>
                            <Text style={[config.styles.btnText]}>Next</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            {isFetchingSpecialties && <AppLoader />}
        </>
    )
}

export default RegistrationForm1;