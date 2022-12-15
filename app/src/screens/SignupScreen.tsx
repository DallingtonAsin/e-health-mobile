import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import * as configs from '../configs'
import { TextInput } from 'react-native-paper';
import AppLoader from '../components/AppLoader';
import { PaperSelect } from 'react-native-paper-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../components/common/SharedHelper';
import { AuthContext } from '../context/authContext';

interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    gender: string,
    language: string,
    address: string,
    phoneNumber: string,
}

const numberOfLines = 5;

const SignupScreen = ({ navigation }: { navigation: any }) => {

    const InitialUser = {
        firstName: '',
        lastName:  '',
        email:  '',
        dob:  '',
        gender:  '',
        language:  '',
        address:  '',
        phoneNumber:  '',
    }

    const [user, setUser] = useState<IUser>(InitialUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { signIn } = React.useContext(AuthContext);

    const [colors, setColors] = useState({
        value: '',
        list: [
            { _id: '1', value: 'BLUE' },
            { _id: '2', value: 'RED' },
            { _id: '3', value: 'GREEN' },
        ],
        selectedList: [],
        error: '',
    });

    const [gender, setGender] = useState({
        value: '',
        list: [
            { _id: '1', value: 'Male' },
            { _id: '2', value: 'Female' },
        ],
        selectedList: [],
        error: '',
    });


    const submitDetails = () => {
        setIsLoading(true);
        setTimeout(() => {
            signIn();
            setIsLoading(false);
            navigation.navigate('Home');
        }, 2000);
    }

    const selectValidator = (value: any) => {
        if (!value || value.length <= 0) {
            return 'Please select a value.';
        }
        return '';
    };

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
        console.warn("A date has been picked: ", dob);
    };

    const RegistrationScreen = () => {
        return (
            <>
                <SafeAreaView style={styles.container}>

                    <StatusBar
                        backgroundColor={configs.colors.primary}
                    />

                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>Create a Vastel Medical Services Account</Text>

                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>First Name<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="First Name"
                                value={user?.firstName}
                                mode="outlined"
                                dense={false}
                                activeOutlineColor={configs.colors.primary}
                                numberOfLines={numberOfLines}
                                error={false}
                                style={styles.textInput}
                                textColor={configs.colors.dark}
                            />
                        </View>


                        <View style={styles.inputWrap}>
                            <Text style={styles.labelTxt}>Last Name<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Last Name"
                                value={user?.lastName}
                                mode="outlined"
                                activeOutlineColor={configs.colors.primary}
                                style={styles.textInput}
                                textColor={configs.colors.dark}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.labelTxt}>Email address</Text>
                            <TextInput
                                label="Email address"
                                value={user?.email}
                                mode="outlined"
                                activeOutlineColor={configs.colors.primary}
                                style={styles.textInput}
                                textColor={configs.colors.dark}
                            />
                        </View>


                        <View style={styles.viewContainer}>
                            <Text style={styles.labelTxt}>Contact Number<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Phone Number"
                                value={user?.phoneNumber}
                                mode="outlined"
                                activeOutlineColor={configs.colors.primary}
                                style={styles.textInput}
                                textColor={configs.colors.dark}
                            />
                        </View>

                        <View style={styles.viewContainer}>
                            <Text style={styles.labelTxt}>Address<Text style={styles.required}>*</Text></Text>
                            <TextInput
                                label="Address"
                                value={user?.address}
                                mode="outlined"
                                activeOutlineColor={configs.colors.primary}
                                style={styles.textInput}
                                textColor={configs.colors.dark}
                            />
                        </View>

                        <View style={[styles.viewContainer, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View style={styles.inputWrap}>
                                <Text style={styles.labelTxt}>Gender<Text style={styles.required}>*</Text></Text>
                                <PaperSelect
                                    label="Select Gender"
                                    value={gender.value}
                                    onSelection={(value: any) => {
                                        setGender({
                                            ...gender,
                                            value: value.text,
                                            selectedList: value.selectedList,
                                            error: '',
                                        });
                                    }}
                                    arrayList={[...gender.list]}
                                    selectedArrayList={gender.selectedList}
                                    errorText={gender.error}
                                    multiEnable={false}
                                    textInputMode="outlined"
                                    searchStyle={{ iconColor: configs.colors.primary }}
                                    checkboxColor={configs.colors.primary}
                                    activeOutlineColor={configs.colors.primary}
                                    hideSearchBox={true}
                                    containerStyle={{ height: 10 }}
                                    dialogButtonLabelStyle={{ color: configs.colors.primary }}

                                />
                            </View>

                            <View style={styles.inputWrap}>
                                <Text style={styles.labelTxt}>Date of Bith<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    label="Date of Birth"
                                    value={user?.dob}
                                    mode="outlined"
                                    activeOutlineColor={configs.colors.primary}
                                    style={styles.textInput}
                                    textColor={configs.colors.dark}
                                    onFocus={showDatePicker}
                                    showSoftInputOnFocus={false}
                                />
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                        </View>

                        <View style={styles.viewContainer}>
                            <TouchableOpacity style={configs.styles.secondaryBtn}
                                onPress={() => submitDetails()}>
                                <Text style={[configs.styles.btnText]}>Continue</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </SafeAreaView>
                {isLoading && <AppLoader />}
            </>
        )
    }

    return (
        <RegistrationScreen />
    )
}


export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: configs.colors.white,
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
        color: configs.colors.dark,
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
        color: configs.colors.primary,
        fontSize: 18,
        textAlign: 'center',
    },

    required: {
        color: configs.colors.danger,
    },

    textInput: {
        backgroundColor: configs.colors.white,
        color: configs.colors.silver,
    }
})